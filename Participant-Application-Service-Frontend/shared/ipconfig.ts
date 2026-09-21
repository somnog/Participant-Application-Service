import axios from 'axios';

/**
 * The one axios instance. Every package imports this; nobody creates a second one.
 *
 * baseURL is "/api" on this same site. next.config.ts forwards it to
 * participant-application-service, so you write api.get('/participants'),
 * never the full backend address.
 */
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export default api;
