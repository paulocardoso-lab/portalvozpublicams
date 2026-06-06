import type Parser from 'rss-parser';

type RSSImageItem = Parser.Item & {
  mediaContent?: { $?: { url?: string } };
  mediaThumbnail?: { $?: { url?: string } };
  enclosure?: { url?: string; type?: string };
};

type ImageCandidateSource =
  | 'og:image'
  | 'twitter:image'
  | 'json-ld'
  | 'article-img'
  | 'rss-media'
  | 'rss-thumbnail'
  | 'rss-enclosure'
  | 'rss-content-img';

type ImageCandidate = {
  url: string;
  source: ImageCandidateSource;
  width?: number;
  height?: number;
};

export type RSSHeroImageResult = {
  url: string | null;
  source: ImageCandidateSource | null;
  rejected: Array<{ url: string; source: ImageCandidateSource; reason: string }>;
};

export type RSSHeroImageStatus = 'original' | 'suspect' | 'missing' | 'fallback';

export type RSSHeroImageStatusInfo = {
  status: RSSHeroImageStatus;
  label: string;
  detail: string;
};

const MIN_IMAGE_WIDTH = 200;
const MIN_IMAGE_HEIGHT = 200;
const strictMode = process.env.RSS_IMAGE_STRICT_MODE === 'true';

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function normalizeUrl(value: string | null | undefined, baseUrl: string): string | null {
  const trimmed = value?.trim();
  if (!trimmed || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return null;

  try {
    return new URL(trimmed, baseUrl).toString();
  } catch {
    return null;
  }
}

function parseDimension(value: string | null | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function imageUrlFromSrcset(value: string | null | undefined): string | null {
  const srcset = value?.trim();
  if (!srcset) return null;

  const candidates = srcset
    .split(',')
    .map((part) => {
      const [url, descriptor] = part.trim().split(/\s+/, 2);
      const width = descriptor?.endsWith('w') ? Number.parseInt(descriptor, 10) : 0;
      return { url, width: Number.isFinite(width) ? width : 0 };
    })
    .filter((candidate) => candidate.url)
    .sort((a, b) => b.width - a.width);

  return candidates[0]?.url || null;
}

function hostnameFor(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

function isGoogleNewsUrl(url: string): boolean {
  const host = hostnameFor(url);
  return host === 'news.google.com' || host.endsWith('.news.google.com');
}

function isLikelyGoogleNewsAsset(url: string): boolean {
  const host = hostnameFor(url);
  const lower = url.toLowerCase();
  return (
    isGoogleNewsUrl(url) ||
    host === 'gstatic.com' ||
    host.endsWith('.gstatic.com') ||
    host === 'googleusercontent.com' ||
    host.endsWith('.googleusercontent.com') ||
    lower.includes('google-news') ||
    lower.includes('googlenews') ||
    lower.includes('news.google')
  );
}

function isLikelyLogoOrPlaceholder(url: string): boolean {
  const lower = decodeURIComponent(url).toLowerCase();
  return [
    'favicon',
    '/logo',
    'logo.',
    'logomarca',
    'brand',
    'placeholder',
    'default-image',
    'default.jpg',
    'default.png',
    'sprite',
    '/icon',
    'apple-touch-icon',
  ].some((fragment) => lower.includes(fragment));
}

export function classifyRSSHeroImage({
  heroImage,
  sourceUrl,
}: {
  heroImage: string | null | undefined;
  sourceUrl: string | null | undefined;
}): RSSHeroImageStatusInfo {
  if (!heroImage) {
    return {
      status: 'missing',
      label: 'Sem imagem',
      detail: 'A matéria foi importada sem imagem destacada.',
    };
  }

  if (isLikelyGoogleNewsAsset(heroImage)) {
    return {
      status: 'suspect',
      label: 'Imagem suspeita',
      detail: 'A imagem parece vir do Google News ou de um recurso genérico.',
    };
  }

  if (isLikelyLogoOrPlaceholder(heroImage)) {
    return {
      status: 'suspect',
      label: 'Imagem suspeita',
      detail: 'A imagem parece ser logo, favicon ou placeholder.',
    };
  }

  const sourceHost = sourceUrl ? hostnameFor(sourceUrl) : '';
  const imageHost = hostnameFor(heroImage);
  if (strictMode && sourceHost && imageHost && imageHost !== sourceHost && !imageHost.endsWith('.supabase.co')) {
    return {
      status: 'fallback',
      label: 'Usando fallback',
      detail: 'A imagem não está no mesmo domínio da fonte; revise antes de publicar.',
    };
  }

  return {
    status: 'original',
    label: 'Imagem original',
    detail: 'A imagem destacada passou nas validações automáticas.',
  };
}

function validateCandidate(candidate: ImageCandidate, sourceUrl: string): string | null {
  if (!isHttpUrl(candidate.url)) return 'not-http';

  const pageHost = hostnameFor(sourceUrl);
  const imageHost = hostnameFor(candidate.url);
  if (!imageHost) return 'invalid-url';

  if (isLikelyGoogleNewsAsset(candidate.url)) return 'google-news-asset';
  if (isLikelyLogoOrPlaceholder(candidate.url)) return 'logo-or-placeholder';

  if (
    candidate.width &&
    candidate.height &&
    (candidate.width < MIN_IMAGE_WIDTH || candidate.height < MIN_IMAGE_HEIGHT)
  ) {
    return 'too-small';
  }

  if (pageHost && imageHost === pageHost && /\/ads?\//i.test(candidate.url)) {
    return 'ad-image';
  }

  return null;
}

function candidateFromMeta(
  document: Document,
  selector: string,
  source: ImageCandidateSource,
  baseUrl: string
): ImageCandidate[] {
  const content = (document.querySelector(selector) as HTMLMetaElement | null)?.content;
  const url = normalizeUrl(content, baseUrl);
  return url ? [{ url, source }] : [];
}

function collectJsonLdImages(value: unknown, baseUrl: string, output: ImageCandidate[]) {
  if (!value) return;

  if (typeof value === 'string') {
    const url = normalizeUrl(value, baseUrl);
    if (url) output.push({ url, source: 'json-ld' });
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectJsonLdImages(item, baseUrl, output);
    return;
  }

  if (typeof value !== 'object') return;

  const record = value as Record<string, unknown>;
  const image = record.image ?? record.thumbnailUrl;
  if (image) collectJsonLdImages(image, baseUrl, output);

  const urlValue = record.url ?? record.contentUrl;
  if (typeof urlValue === 'string') {
    const url = normalizeUrl(urlValue, baseUrl);
    if (url) output.push({ url, source: 'json-ld' });
  }
}

function extractJsonLdImages(document: Document, baseUrl: string): ImageCandidate[] {
  const candidates: ImageCandidate[] = [];
  const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));

  for (const script of scripts) {
    const text = script.textContent?.trim();
    if (!text) continue;

    try {
      collectJsonLdImages(JSON.parse(text), baseUrl, candidates);
    } catch {
      // Some publishers ship malformed JSON-LD. Other image signals can still work.
    }
  }

  return candidates;
}

function extractArticleImages(document: Document, baseUrl: string): ImageCandidate[] {
  const candidates = Array.from(document.querySelectorAll('article img, main img, figure img, img'))
    .map((img): ImageCandidate | null => {
      const element = img as HTMLImageElement;
      const src =
        element.getAttribute('src') ||
        element.getAttribute('data-src') ||
        element.getAttribute('data-original') ||
        element.getAttribute('data-lazy-src') ||
        imageUrlFromSrcset(element.getAttribute('srcset') || element.getAttribute('data-srcset'));
      const url = normalizeUrl(src, baseUrl);
      if (!url) return null;

      return {
        url,
        source: 'article-img' as const,
        width: parseDimension(element.getAttribute('width')),
        height: parseDimension(element.getAttribute('height')),
      };
    })
    .filter((candidate): candidate is ImageCandidate => candidate !== null);

  return candidates;
}

function extractPageCandidates(document: Document, pageUrl: string): ImageCandidate[] {
  return [
    ...candidateFromMeta(document, 'meta[property="og:image:secure_url"]', 'og:image', pageUrl),
    ...candidateFromMeta(document, 'meta[property="og:image:url"]', 'og:image', pageUrl),
    ...candidateFromMeta(document, 'meta[property="og:image"]', 'og:image', pageUrl),
    ...candidateFromMeta(document, 'meta[name="twitter:image"]', 'twitter:image', pageUrl),
    ...candidateFromMeta(document, 'meta[name="twitter:image:src"]', 'twitter:image', pageUrl),
    ...extractJsonLdImages(document, pageUrl),
    ...extractArticleImages(document, pageUrl),
  ];
}

function extractRssCandidates(item: RSSImageItem, sourceUrl: string): ImageCandidate[] {
  const candidates: ImageCandidate[] = [];

  const mediaUrl = normalizeUrl(item.mediaContent?.$?.url, sourceUrl);
  if (mediaUrl) candidates.push({ url: mediaUrl, source: 'rss-media' });

  const thumbUrl = normalizeUrl(item.mediaThumbnail?.$?.url, sourceUrl);
  if (thumbUrl) candidates.push({ url: thumbUrl, source: 'rss-thumbnail' });

  const enclosureUrl = normalizeUrl(item.enclosure?.url, sourceUrl);
  const enclosureType = item.enclosure?.type || '';
  if (enclosureUrl && (enclosureType.startsWith('image/') || /\.(jpe?g|png|gif|webp)(\?|$)/i.test(enclosureUrl))) {
    candidates.push({ url: enclosureUrl, source: 'rss-enclosure' });
  }

  if (item.content) {
    const match = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
    const contentImage = normalizeUrl(match?.[1], sourceUrl);
    if (contentImage) candidates.push({ url: contentImage, source: 'rss-content-img' });
  }

  return candidates;
}

export function selectRSSHeroImage({
  item,
  document,
  sourceUrl,
}: {
  item: RSSImageItem;
  document?: Document | null;
  sourceUrl: string;
}): RSSHeroImageResult {
  const pageCandidates = document ? extractPageCandidates(document, sourceUrl) : [];
  const rssCandidates = extractRssCandidates(item, sourceUrl);
  const orderedCandidates = [...pageCandidates, ...rssCandidates];
  const rejected: RSSHeroImageResult['rejected'] = [];
  const seen = new Set<string>();

  for (const candidate of orderedCandidates) {
    if (seen.has(candidate.url)) continue;
    seen.add(candidate.url);

    const reason = validateCandidate(candidate, sourceUrl);
    if (reason) {
      rejected.push({ url: candidate.url, source: candidate.source, reason });
      continue;
    }

    return { url: candidate.url, source: candidate.source, rejected };
  }

  return { url: null, source: null, rejected };
}
