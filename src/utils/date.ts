/** Formats ISO date values for operator-friendly tables. */
export function formatDateTime(value: string | null): string { if (!value) return '—'; const date = new Date(value); if (Number.isNaN(date.getTime())) return value; return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'medium' }).format(date); }
