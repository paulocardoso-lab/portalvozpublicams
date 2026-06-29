const BOT_PATTERN = /bot|crawl|spider|slurp|mediapartners|google-read-aloud|facebookexternalhit/i;

export function parseDevice(ua: string | null): string {
  if (!ua) return 'unknown';
  if (BOT_PATTERN.test(ua)) return 'bot';
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  if (/mobile|android|iphone|ipod|windows phone/i.test(ua)) return 'mobile';
  return 'desktop';
}

export function parseReferrer(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    // Strip path/query — keep only hostname to avoid leaking sensitive referrer paths
    return url.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}
