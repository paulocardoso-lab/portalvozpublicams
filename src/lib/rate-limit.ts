import { headers } from "next/headers";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type Entry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Entry>();

function normalizeIp(value: string | null) {
  return value?.split(",")[0]?.trim() || "unknown";
}

function checkRateLimit(identifier: string, options: RateLimitOptions) {
  const now = Date.now();
  const key = `${options.key}:${identifier}`;
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return { limited: false };
  }

  current.count += 1;
  store.set(key, current);

  return {
    limited: current.count > options.limit,
    retryAfter: Math.ceil((current.resetAt - now) / 1000),
  };
}

export function rateLimitRequest(request: Request, options: RateLimitOptions) {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip");

  return checkRateLimit(normalizeIp(ip), options);
}

export async function rateLimitAction(options: RateLimitOptions) {
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for") ||
    headerStore.get("x-real-ip") ||
    headerStore.get("cf-connecting-ip");

  return checkRateLimit(normalizeIp(ip), options);
}
