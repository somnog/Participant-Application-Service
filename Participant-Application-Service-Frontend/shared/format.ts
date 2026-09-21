import dayjs from 'dayjs';

export const formatDate = (value?: string) => (value ? dayjs(value).format('DD MMM YYYY, HH:mm') : '—');
export const formatDay = (value?: string) => (value ? dayjs(value).format('DD MMM YYYY') : '—');
export const dash = (value?: string | null) => (value && value.trim() ? value : '—');

/** "Amina Hassan" -> "AH" for avatars. */
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
