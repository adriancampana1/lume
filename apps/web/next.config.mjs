/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  typedRoutes: true,
  transpilePackages: ['@lume/shared'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    // Allow .js imports to resolve .ts/.tsx sources (verbatimModuleSyntax convention)
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js'],
      '.jsx': ['.tsx', '.jsx'],
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV !== 'production' ? " 'unsafe-eval'" : ''}`,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://lh3.googleusercontent.com",
              "font-src 'self' data:",
              process.env.NODE_ENV !== 'production'
                ? "connect-src 'self' ws: wss: http://localhost:* http://127.0.0.1:*"
                : "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self' https://accounts.google.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
  async rewrites() {
    const apiBase = process.env.API_INTERNAL_URL ?? 'http://localhost:3001';
    return [
      { source: '/api/auth/:path*', destination: `${apiBase}/auth/:path*` },
      { source: '/auth/callback/:path*', destination: `${apiBase}/auth/callback/:path*` },
      { source: '/api/:path*', destination: `${apiBase}/:path*` },
    ];
  },
};

export default nextConfig;