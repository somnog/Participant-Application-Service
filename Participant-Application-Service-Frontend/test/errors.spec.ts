import { describe, expect, it } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import { apiMessage, clean } from '@/shared/errors';

const nestError = (message: unknown) =>
  new AxiosError('fail', 'ERR_BAD_REQUEST', undefined, undefined, {
    status: 400, statusText: 'Bad Request', headers: {}, config: { headers: new AxiosHeaders() }, data: { statusCode: 400, message, error: 'Bad Request' },
  });

describe('apiMessage — reads NestJS error bodies', () => {
  it('joins validation messages', () => {
    expect(apiMessage(nestError(['email must be an email', 'name must be a string']))).toBe('email must be an email, name must be a string');
  });
  it('returns a single message', () => {
    expect(apiMessage(nestError('Participant with id "x" not found'))).toBe('Participant with id "x" not found');
  });
  it('explains when the backend is down', () => {
    expect(apiMessage(new AxiosError('Network Error', 'ERR_NETWORK'))).toMatch(/Cannot reach/);
  });
});

describe('clean', () => {
  it('removes empty values only', () => {
    expect(clean({ a: '', b: 0, c: undefined, d: 'x', e: null })).toEqual({ b: 0, d: 'x' });
  });
});
