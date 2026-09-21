import axios from 'axios';

/**
 * Turns any failed request into the message NestJS sent back.
 * NestJS answers { statusCode, message, error } where message is a string
 * or, for validation errors, an array of strings.
 */
export function apiMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as { message?: string | string[] } | undefined;
    if (Array.isArray(body?.message)) return body.message.join(', ');
    if (typeof body?.message === 'string' && body.message) return body.message;
    if (!error.response) return 'Cannot reach participant-application-service. Is it running on port 3000?';
  }
  return fallback;
}

/** Drops empty strings so optional fields are not sent as "". */
export function clean<T extends object>(values: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(values).filter(([, v]) => v !== '' && v !== undefined && v !== null),
  ) as Partial<T>;
}
