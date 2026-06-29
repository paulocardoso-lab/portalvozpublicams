import type { MarketIndicator } from '@prisma/client';

const DAY_MS = 24 * 60 * 60 * 1000;
const AGRO_KEYS = new Set(['boi', 'soja', 'milho', 'trigo']);

export function marketIndicatorMaxAgeMs(indicator: Pick<MarketIndicator, 'key' | 'sourceType' | 'sourceRefreshMinutes'>) {
  if (indicator.sourceType === 'JSON_API') {
    return Math.max(5, indicator.sourceRefreshMinutes) * 2 * 60 * 1000;
  }

  if (indicator.key === 'usd') return DAY_MS;
  if (AGRO_KEYS.has(indicator.key)) return 3 * DAY_MS;

  return DAY_MS;
}

export function isMarketIndicatorStale(
  indicator: Pick<MarketIndicator, 'key' | 'sourceType' | 'sourceRefreshMinutes' | 'lastFetchedAt'>,
  now = new Date()
) {
  if (!indicator.lastFetchedAt) return indicator.sourceType !== 'MANUAL';
  return now.getTime() - indicator.lastFetchedAt.getTime() > marketIndicatorMaxAgeMs(indicator);
}
