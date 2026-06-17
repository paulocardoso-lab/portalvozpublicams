export const PORTAL_LOCALE = 'pt-BR';
export const PORTAL_TIME_ZONE = 'America/Campo_Grande';

type DateInput = Date | string | number;

export function formatPortalDate(date: DateInput, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(PORTAL_LOCALE, {
    timeZone: PORTAL_TIME_ZONE,
    ...options,
  }).format(new Date(date));
}

export function formatPortalTime(date: DateInput) {
  return formatPortalDate(date, {
    hour: '2-digit',
    minute: '2-digit',
  });
}
