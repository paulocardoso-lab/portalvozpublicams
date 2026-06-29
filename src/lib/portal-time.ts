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

export function formatPortalRelativeTime(date: DateInput, baseDate = new Date()) {
  const diffSeconds = Math.max(0, Math.floor((baseDate.getTime() - new Date(date).getTime()) / 1000));

  if (diffSeconds < 60) return 'agora';

  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) return `há ${minutes}min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `há ${days}d`;

  return formatPortalDate(date, {
    day: 'numeric',
    month: 'short',
  });
}
