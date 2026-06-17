export type VideoPlatform = 'youtube' | 'vimeo' | 'gif' | 'other';

export interface VideoEmbed {
  platform: VideoPlatform;
  embedUrl: string;
  thumbnailUrl: string | null;
}

/**
 * Aceita tanto uma URL pura quanto um código de incorporação completo
 * (`<iframe ... src="..."></iframe>`) colado direto do botão "Compartilhar > Incorporar"
 * do YouTube/Vimeo. Quando recebe um iframe, extrai o atributo `src`.
 */
function extractSrcFromIframe(input: string): string {
  const trimmed = input.trim();
  if (!/<iframe/i.test(trimmed)) return trimmed;
  const m = trimmed.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
  return m ? m[1].trim() : trimmed;
}

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function extractVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

export function resolveVideoEmbed(rawInput: string): VideoEmbed {
  // Suporta colar o <iframe> de incorporação inteiro (YouTube/Vimeo) ou só a URL.
  const url = extractSrcFromIframe(rawInput);

  const ytId = extractYoutubeId(url);
  if (ytId) {
    return {
      platform: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
    };
  }

  const vmId = extractVimeoId(url);
  if (vmId) {
    return {
      platform: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vmId}?byline=0&portrait=0`,
      thumbnailUrl: null, // resolvido de forma assíncrona se necessário
    };
  }

  // GIF / WebP animado — renderiza como <img>, não iframe
  if (/\.(gif|webp)(\?.*)?$/i.test(url)) {
    return {
      platform: 'gif',
      embedUrl: url,
      thumbnailUrl: url,
    };
  }

  // Outro: aceita URL direta de embed (ex: iframe src de outros players)
  return {
    platform: 'other',
    embedUrl: url,
    thumbnailUrl: null,
  };
}
