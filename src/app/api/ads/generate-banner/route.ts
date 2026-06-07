import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import OpenAI from 'openai';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

// ── Auth ──────────────────────────────────────────────────────────────────────

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized');
  }
}

// ── Slot dimensions ───────────────────────────────────────────────────────────

const SLOT_DIMS: Record<string, { w: number; h: number }> = {
  'leaderboard':    { w: 970, h: 90  },
  'sidebar-top':    { w: 300, h: 250 },
  'sidebar-bottom': { w: 300, h: 250 },
  'in-article':     { w: 600, h: 120 },
  'mobile-top':     { w: 320, h: 50  },
  'mobile-inline':  { w: 300, h: 250 },
  'sticky-bottom':  { w: 320, h: 50  },
  'native-feed':    { w: 600, h: 200 },
};

// ── Scraping ──────────────────────────────────────────────────────────────────

interface ScrapeResult {
  title: string;
  description: string;
  brandName: string;
  logoUrl: string | null;
  themeColor: string | null;
}

async function scrapeUrl(url: string): Promise<ScrapeResult> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(12000),
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
    },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} ao buscar ${url}`);

  const html = await res.text();
  const base = new URL(url).origin;

  function meta(prop: string, attr = 'content') {
    const m = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]+${attr}=["']([^"']+)["']`, 'i'))
           || html.match(new RegExp(`<meta[^>]+${attr}=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`, 'i'));
    return m?.[1]?.trim() ?? null;
  }

  const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? '';
  const title = meta('og:title') || meta('twitter:title') || titleTag || new URL(url).hostname;
  const description = meta('og:description') || meta('twitter:description') || meta('description') || '';
  const themeColor = meta('theme-color', 'content') ?? meta('msapplication-TileColor', 'content');

  // Logo: try og:image first (often the brand logo in smaller sites), then favicon
  let logoUrl: string | null = meta('og:image');
  if (!logoUrl) {
    // Look for apple-touch-icon or icon link tags
    const iconMatch = html.match(/<link[^>]+rel=["'][^"']*(?:apple-touch-icon|shortcut icon|icon)[^"']*["'][^>]+href=["']([^"']+)["']/i)
                   || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*(?:apple-touch-icon|icon)[^"']*["']/i);
    if (iconMatch?.[1]) {
      logoUrl = iconMatch[1].startsWith('http') ? iconMatch[1] : `${base}${iconMatch[1].startsWith('/') ? '' : '/'}${iconMatch[1]}`;
    }
  }
  if (logoUrl && !logoUrl.startsWith('http')) {
    logoUrl = `${base}${logoUrl.startsWith('/') ? '' : '/'}${logoUrl}`;
  }

  // Brand name: strip TLD from hostname or use first word of title
  const hostname = new URL(url).hostname.replace(/^www\./, '');
  const brandName = hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);

  return { title, description, brandName, logoUrl, themeColor };
}

// ── Gemini copy generation ────────────────────────────────────────────────────

interface BannerCopy {
  headline: string;
  subline: string;
  cta: string;
  bg: string;       // hex background color
  fg: string;       // hex text/foreground color
  accent: string;   // hex accent/CTA color
}

function titleCase(text: string) {
  return text
    .toLowerCase()
    .replace(/(^|\s)\S/g, char => char.toUpperCase())
    .trim();
}

function copyFromPrompt(userPrompt: string, scrape: ScrapeResult, isNarrow: boolean): BannerCopy {
  const normalized = userPrompt.trim();
  const brand = scrape.brandName && scrape.brandName !== 'Marca' ? scrape.brandName : '';

  const lower = normalized.toLowerCase();
  const headline =
    lower.includes('copa') || lower.includes('jogos')
      ? 'Tabela de Jogos 2026'
      : normalized
        .replace(/\b(gere|crie|faça|banner|aviso|para que|a pessoa|acesse|ao clicar|use|cores|oficiais|logomarcas)\b/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, isNarrow ? 38 : 58);

  const subline =
    lower.includes('copa')
      ? 'Datas, grupos e partidas em um só lugar'
      : scrape.description || (brand ? `Conheça ${brand}` : 'Confira todos os detalhes');

  let bg = '#112b5c';
  const fg = '#ffffff';
  let accent = '#2fbf71';

  if (lower.includes('escuro')) bg = '#111827';
  if (lower.includes('laranja')) accent = '#e17652';
  if (lower.includes('copa') || lower.includes('fifa')) {
    bg = '#12245a';
    accent = '#19b66a';
  }
  if (lower.includes('verão') || lower.includes('vibrante')) {
    bg = '#075985';
    accent = '#f59e0b';
  }

  return {
    headline: titleCase(headline || brand || 'Acesse Agora'),
    subline: isNarrow ? '' : subline.slice(0, 78),
    cta: lower.includes('tabela') || lower.includes('jogos') ? 'Ver tabela' : 'Acesse já',
    bg,
    fg,
    accent,
  };
}

async function generateBannerCopy(
  scrape: ScrapeResult,
  userPrompt: string,
  slot: string,
  dims: { w: number; h: number }
): Promise<BannerCopy> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  const isNarrow = dims.h <= 100; // leaderboard / mobile strip
  const promptSeed = crypto.randomUUID();

  const prompt = `Você é um diretor de arte especialista em banners publicitários digitais.

Crie o conteúdo textual e a paleta de cores para um banner de ${dims.w}×${dims.h}px.

INFORMAÇÕES DA MARCA/SITE:
- Nome da marca: ${scrape.brandName}
- Título da página: ${scrape.title}
- Descrição: ${scrape.description || '(sem descrição)'}
- Cor tema do site: ${scrape.themeColor || '(desconhecida)'}

INSTRUÇÃO DO USUÁRIO: ${userPrompt || 'Crie um banner profissional e atraente'}
ID DA VARIAÇÃO: ${promptSeed}

SLOT: ${slot} (${dims.w}×${dims.h}px) ${isNarrow ? '— formato horizontal estreito, textos MUITO curtos' : ''}

REGRAS:
- Obedeça literalmente a intenção da instrução do usuário.
- Se o usuário pedir Copa 2026, jogos ou tabela, a headline e o CTA precisam mencionar tabela/jogos.
- headline: ${isNarrow ? 'máx 40 caracteres' : 'máx 60 caracteres'}, impactante
- subline: ${isNarrow ? 'máx 30 caracteres ou string vazia se não couber' : 'máx 80 caracteres'}, complementar
- cta: botão de chamada para ação, máx 20 caracteres (ex: "Saiba mais", "Acesse já", "Ver oferta")
- bg: cor de fundo hex (harmoniosa com a marca, pode usar a cor tema)
- fg: cor do texto principal hex (contraste ≥ 4.5:1 com bg)
- accent: cor do botão CTA hex (diferente de bg, chamativa)
- Responda APENAS JSON válido, sem markdown

{"headline":"...","subline":"...","cta":"...","bg":"#xxxxxx","fg":"#xxxxxx","accent":"#xxxxxx"}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
    });
    const text = (completion.choices[0].message.content || '').replace(/```json|```/g, '').trim();
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON');
    const parsed = JSON.parse(match[0]) as BannerCopy;
    // Validate hex colors
    const hexRe = /^#[0-9a-fA-F]{6}$/;
    if (!hexRe.test(parsed.bg))     parsed.bg     = '#1a1a2e';
    if (!hexRe.test(parsed.fg))     parsed.fg     = '#ffffff';
    if (!hexRe.test(parsed.accent)) parsed.accent = '#e94560';
    if (!parsed.headline || parsed.headline === scrape.brandName) {
      return copyFromPrompt(userPrompt, scrape, isNarrow);
    }
    return parsed;
  } catch {
    return copyFromPrompt(userPrompt, scrape, isNarrow);
  }
}

// ── SVG banner renderer ───────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function luminance(hex: string): number {
  return hexToRgb(hex).reduce((lum, v, i) => {
    const c = v / 255;
    const linear = c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return lum + linear * [0.2126, 0.7152, 0.0722][i];
  }, 0);
}

function escSvg(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function hashText(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// Wraps text into lines fitting maxWidth (approximation: avgCharWidth * fontSize)
function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars && cur) {
      lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur.trim());
  return lines;
}

function buildSvg(
  copy: BannerCopy,
  dims: { w: number; h: number },
  logoDataUrl: string | null,
  slot: string,
  seed: string
): string {
  const { w, h } = dims;
  const { headline, subline, cta, bg, fg, accent } = copy;
  const isNarrow = h <= 100;
  const isTall = h >= 200;
  const variant = hashText(`${seed}-${headline}-${subline}-${slot}`) % 4;

  // Typography scale
  const headlineFontSize = isNarrow ? Math.max(14, Math.min(22, h * 0.3)) : isTall ? 28 : 20;
  const sublineFontSize  = isNarrow ? Math.max(10, headlineFontSize * 0.65) : headlineFontSize * 0.6;
  const ctaFontSize      = isNarrow ? Math.max(10, headlineFontSize * 0.6) : headlineFontSize * 0.55;
  const ctaH             = isNarrow ? Math.max(18, h * 0.4) : Math.max(28, headlineFontSize * 1.8);
  const ctaW             = isNarrow ? Math.min(110, w * 0.22) : Math.min(160, w * 0.3);
  const pad              = isNarrow ? 12 : 24;

  // Accent bg for CTA button — slightly darker shade
  const [ar, ag, ab] = hexToRgb(accent);
  const ctaBg = `rgb(${ar},${ag},${ab})`;
  const ctaFg = luminance(accent) > 0.4 ? '#111111' : '#ffffff';

  // Logo placement
  const logoSize = isNarrow ? Math.min(h - 12, 36) : Math.min(60, h * 0.22);
  const logoX    = pad;
  const logoY    = h / 2 - logoSize / 2;
  const textStartX = logoDataUrl ? logoX + logoSize + 12 : pad;

  // Text area width
  const ctaTotalW = ctaW + pad;
  const textAreaW = w - textStartX - ctaTotalW - pad;
  const maxCharsHead = Math.floor(textAreaW / (headlineFontSize * 0.55));
  const maxCharsSub  = Math.floor(textAreaW / (sublineFontSize * 0.55));

  const headlineLines = wrapText(headline, maxCharsHead);
  const sublineLines  = isNarrow ? [] : wrapText(subline, maxCharsSub);

  // Vertical text positioning
  const totalTextH = headlineLines.length * headlineFontSize * 1.2 + sublineLines.length * sublineFontSize * 1.3;
  let textY = (h - totalTextH) / 2 + headlineFontSize;

  // CTA button position
  const ctaX = w - pad - ctaW;
  const ctaY = (h - ctaH) / 2;

  // Gradient defs
  const [br, bg2, bb] = hexToRgb(bg);
  const brightenAmt = luminance(bg) < 0.15 ? 40 : -20;
  const bg2hex = `#${[br, bg2, bb].map(c => Math.max(0, Math.min(255, c + brightenAmt)).toString(16).padStart(2, '0')).join('')}`;

  let svgBody = '';

  // Background gradient
  svgBody += `<defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${escSvg(bg)}"/>
      <stop offset="100%" stop-color="${escSvg(bg2hex)}"/>
    </linearGradient>
    <linearGradient id="accent-shine" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.15)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.1)"/>
    </linearGradient>
    <clipPath id="logo-clip"><rect x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" rx="4"/></clipPath>
  </defs>`;

  // Background
  svgBody += `<rect width="${w}" height="${h}" fill="url(#bg)"/>`;

  // Prompt-sensitive decorative system: changes per generation.
  if (variant === 0) {
    svgBody += `<rect x="0" y="0" width="${Math.max(4, w * 0.008)}" height="${h}" fill="${escSvg(accent)}" opacity="0.95"/>`;
    svgBody += `<circle cx="${w * 0.82}" cy="${h * 0.12}" r="${Math.max(28, h * 0.65)}" fill="${escSvg(accent)}" opacity="0.10"/>`;
  } else if (variant === 1) {
    svgBody += `<path d="M${w * 0.68},0 L${w},0 L${w},${h} L${w * 0.58},${h} Z" fill="${escSvg(accent)}" opacity="0.14"/>`;
    svgBody += `<rect x="${pad}" y="${h - 5}" width="${w * 0.32}" height="3" fill="${escSvg(accent)}" opacity="0.9"/>`;
  } else if (variant === 2) {
    for (let i = 0; i < 5; i++) {
      svgBody += `<circle cx="${w - pad - i * 18}" cy="${pad + i * 7}" r="${Math.max(3, h * 0.035)}" fill="${escSvg(fg)}" opacity="${0.16 + i * 0.04}"/>`;
    }
    svgBody += `<rect x="0" y="0" width="${w}" height="2" fill="${escSvg(accent)}" opacity="0.85"/>`;
  } else {
    svgBody += `<path d="M0,${h} C${w * 0.25},${h * 0.45} ${w * 0.55},${h * 1.15} ${w},${h * 0.18} L${w},${h} Z" fill="${escSvg(accent)}" opacity="0.12"/>`;
    svgBody += `<rect x="${pad}" y="${pad}" width="${Math.max(36, w * 0.12)}" height="2" fill="${escSvg(accent)}" opacity="0.95"/>`;
  }

  // Logo
  if (logoDataUrl) {
    svgBody += `<image href="${logoDataUrl}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" clip-path="url(#logo-clip)" preserveAspectRatio="xMidYMid meet"/>`;
  }

  // Headline lines
  for (const line of headlineLines) {
    svgBody += `<text x="${textStartX}" y="${textY}" font-family="Arial,Helvetica,sans-serif" font-size="${headlineFontSize}" font-weight="700" fill="${escSvg(fg)}" letter-spacing="-0.3">${escSvg(line)}</text>`;
    textY += headlineFontSize * 1.25;
  }

  // Subline lines
  if (!isNarrow) {
    for (const line of sublineLines) {
      svgBody += `<text x="${textStartX}" y="${textY}" font-family="Arial,Helvetica,sans-serif" font-size="${sublineFontSize}" fill="${escSvg(fg)}" opacity="0.78">${escSvg(line)}</text>`;
      textY += sublineFontSize * 1.35;
    }
  }

  // CTA button
  svgBody += `<rect x="${ctaX}" y="${ctaY}" width="${ctaW}" height="${ctaH}" rx="4" fill="${ctaBg}"/>`;
  svgBody += `<rect x="${ctaX}" y="${ctaY}" width="${ctaW}" height="${ctaH / 2}" rx="4" fill="url(#accent-shine)"/>`;
  svgBody += `<text x="${ctaX + ctaW / 2}" y="${ctaY + ctaH / 2 + ctaFontSize * 0.38}" font-family="Arial,Helvetica,sans-serif" font-size="${ctaFontSize}" font-weight="700" fill="${ctaFg}" text-anchor="middle">${escSvg(cta)}</text>`;

  // "Publicidade" tag (tiny, top-right)
  svgBody += `<text x="${w - 4}" y="9" font-family="Arial,Helvetica,sans-serif" font-size="7" fill="${escSvg(fg)}" opacity="0.4" text-anchor="end">Publicidade</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${svgBody}</svg>`;
}

// ── Fetch logo as data URL ────────────────────────────────────────────────────

async function fetchLogoDataUrl(logoUrl: string): Promise<string | null> {
  try {
    const res = await fetch(logoUrl, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    // Resize to max 200px to keep SVG embed small
    const resized = await sharp(buf).resize(200, 200, { fit: 'inside', withoutEnlargement: true }).png().toBuffer();
    return `data:image/png;base64,${resized.toString('base64')}`;
  } catch {
    return null;
  }
}

// ── Upload to Supabase ────────────────────────────────────────────────────────

async function uploadBannerToSupabase(pngBuffer: Buffer): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const fileName = `ai-banner-${crypto.randomUUID()}.png`;
  const { error } = await supabase.storage.from('ads').upload(fileName, pngBuffer, { contentType: 'image/png', upsert: false });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from('ads').getPublicUrl(fileName);
  return publicUrl;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { sourceUrl?: string; prompt?: string; slot?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { sourceUrl, prompt, slot = 'sidebar-top' } = body;

  const dims = SLOT_DIMS[slot] ?? { w: 300, h: 250 };

  // ① Scrape source URL (optional — use empty fallback if not provided)
  let scrape: ScrapeResult = { title: 'Banner', description: '', brandName: 'Marca', logoUrl: null, themeColor: null };
  if (sourceUrl) {
    try {
      scrape = await scrapeUrl(sourceUrl);
    } catch (err) {
      console.warn('Scrape failed, using fallback:', err instanceof Error ? err.message : err);
    }
  }

  // ② Generate banner copy with Gemini
  const copy = await generateBannerCopy(scrape, prompt ?? '', slot, dims);

  // ③ Fetch logo as embedded data URL
  const logoDataUrl = scrape.logoUrl ? await fetchLogoDataUrl(scrape.logoUrl) : null;

  // ④ Build SVG
  const svg = buildSvg(copy, dims, logoDataUrl, slot, crypto.randomUUID());

  // ⑤ Rasterize SVG → PNG via sharp
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  // ⑥ Upload PNG to Supabase
  const publicUrl = await uploadBannerToSupabase(pngBuffer);

  return NextResponse.json({
    url: publicUrl,
    copy,
    scrape: {
      title: scrape.title,
      brandName: scrape.brandName,
      description: scrape.description,
    },
    dims,
  });
}
