import type { MarketIndicator } from '@prisma/client';

export type HeaderIndicator = {
  key: string;
  label: string;
  value: string;
  unit: string | null;
  showInMobile: boolean;
  displayOrder: number;
};

export type IndicatorSourceInput = {
  sourceUrl: string | null;
  sourcePath: string | null;
  sourceHeaders?: string | null;
  formatDecimals?: number | null;
  prefix?: string | null;
  suffix?: string | null;
};

const DEFAULT_LABELS: Record<string, string> = {
  usd: 'USD',
  boi: 'BOI',
  soja: 'SOJA',
  milho: 'MILHO',
  trigo: 'TRIGO',
};

const DEFAULT_VALUES: Record<string, string> = {
  usd: '5,12',
  boi: '353,80',
  soja: '122,51',
  milho: '65,98',
  trigo: '1.250,00',
};

const FALLBACK_HEADER_INDICATORS: HeaderIndicator[] = [
  { key: 'usd', label: 'USD', value: '5,12', unit: 'R$', showInMobile: true, displayOrder: 10 },
  { key: 'boi', label: 'BOI', value: '353,80', unit: 'R$/@', showInMobile: true, displayOrder: 20 },
  { key: 'soja', label: 'SOJA', value: '122,51', unit: 'R$/sc', showInMobile: false, displayOrder: 30 },
  { key: 'milho', label: 'MILHO', value: '65,98', unit: 'R$/sc', showInMobile: false, displayOrder: 40 },
];

export function fallbackHeaderIndicators() {
  return FALLBACK_HEADER_INDICATORS;
}

export function indicatorLabel(indicator: Pick<MarketIndicator, 'key' | 'label'>) {
  return (indicator.label || DEFAULT_LABELS[indicator.key] || indicator.key).trim();
}

export function toHeaderIndicator(
  indicator: Pick<MarketIndicator, 'key' | 'label' | 'value' | 'unit' | 'showInMobile' | 'displayOrder'>
): HeaderIndicator {
  return {
    key: indicator.key,
    label: indicatorLabel(indicator).toUpperCase(),
    value: indicator.value?.trim() || DEFAULT_VALUES[indicator.key] || '',
    unit: indicator.unit,
    showInMobile: indicator.showInMobile,
    displayOrder: indicator.displayOrder,
  };
}

export function formatIndicatorValue(
  value: unknown,
  decimals = 2,
  prefix?: string | null,
  suffix?: string | null
) {
  const parseNumericString = (raw: string) => {
    const cleaned = raw.trim();
    if (cleaned.includes(',') && cleaned.includes('.')) {
      return Number(cleaned.replace(/\./g, '').replace(',', '.'));
    }
    if (cleaned.includes(',')) return Number(cleaned.replace(',', '.'));
    return Number(cleaned);
  };

  const numeric = typeof value === 'number'
    ? value
    : typeof value === 'string'
      ? parseNumericString(value)
      : Number.NaN;

  const formatted = Number.isFinite(numeric)
    ? new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(numeric)
    : String(value ?? '').trim();

  return `${prefix ?? ''}${formatted}${suffix ?? ''}`.trim();
}

export function extractValueByPath(data: unknown, path: string | null | undefined) {
  if (!path) return data;

  const tokens = path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .map((token) => token.trim())
    .filter(Boolean);

  return tokens.reduce<unknown>((current, token) => {
    if (current == null) return undefined;
    if (Array.isArray(current)) return current[Number(token)];
    if (typeof current === 'object') {
      return (current as Record<string, unknown>)[token];
    }
    return undefined;
  }, data);
}

function assertPublicHttpUrl(rawUrl: string) {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error('URL inválida.');
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('A fonte precisa usar HTTP ou HTTPS.');
  }

  const host = parsed.hostname.toLowerCase();
  const blockedHosts = ['localhost', '127.0.0.1', '::1', '0.0.0.0'];
  const privateIp = /^(10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host);

  if (blockedHosts.includes(host) || privateIp || host.endsWith('.local')) {
    throw new Error('URLs internas ou locais não são permitidas.');
  }

  return parsed.toString();
}

function resolveHeaderValue(value: unknown) {
  if (typeof value !== 'string') return '';
  return value.replace(/\$\{([A-Z0-9_]+)\}/gi, (_, name: string) => {
    const envValue = process.env[name];
    if (!envValue) throw new Error(`Variável de ambiente ausente: ${name}`);
    return envValue;
  });
}

export function parseSourceHeaders(sourceHeaders: string | null | undefined) {
  if (!sourceHeaders?.trim()) return {};

  const parsed = JSON.parse(sourceHeaders) as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(parsed)
      .map(([key, value]) => [key, resolveHeaderValue(value)])
      .filter(([, value]) => Boolean(value))
  ) as Record<string, string>;
}

export async function fetchJsonIndicatorValue(input: IndicatorSourceInput) {
  if (!input.sourceUrl) throw new Error('Informe a URL da fonte.');

  const url = assertPublicHttpUrl(input.sourceUrl);
  const headers = parseSourceHeaders(input.sourceHeaders);
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'VozPublicaMS/1.0',
      ...headers,
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) throw new Error(`Fonte respondeu HTTP ${res.status}.`);

  const length = Number(res.headers.get('content-length') || 0);
  if (length > 1_000_000) throw new Error('Resposta muito grande para indicador.');

  const text = await res.text();
  if (text.length > 1_000_000) throw new Error('Resposta muito grande para indicador.');

  const json = JSON.parse(text) as unknown;
  const rawValue = extractValueByPath(json, input.sourcePath);
  if (rawValue == null || rawValue === '') {
    throw new Error('Caminho JSON não retornou valor.');
  }

  return {
    rawValue,
    value: formatIndicatorValue(rawValue, input.formatDecimals ?? 2, input.prefix, input.suffix),
  };
}
