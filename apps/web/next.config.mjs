/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: { typedRoutes: true },
  async rewrites() {
    const apiBase = process.env.API_INTERNAL_URL ?? 'http://localhost:3001';
    return [
      { source: '/api/auth/:path*', destination: `${apiBase}/auth/:path*` },
      { source: '/api/:path*', destination: `${apiBase}/:path*` },
    ];
  },
};

export default nextConfig;