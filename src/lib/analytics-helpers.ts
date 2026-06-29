export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isValidVisitorId(value: string | undefined): boolean {
  return Boolean(value && /^[a-f0-9-]{32,64}$/i.test(value));
}

const DEFAULT_RETENTION_DAYS = 180;

export function retentionDays(): number {
  const raw = Number(process.env.ANALYTICS_VISITOR_RETENTION_DAYS);
  if (!Number.isFinite(raw)) return DEFAULT_RETENTION_DAYS;
  return Math.max(30, Math.min(730, Math.floor(raw)));
}
