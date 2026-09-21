import type { NextConfig } from 'next';

/**
 * The browser only ever calls /api/... on this same origin.
 * Next.js forwards it to the backend, so the backend needs no CORS setup.
 *
 *   /api/participants  ->  http://localhost:3000/participants
 */
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3000';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${BACKEND_URL}/:path*` }];
  },
};

export default nextConfig;
