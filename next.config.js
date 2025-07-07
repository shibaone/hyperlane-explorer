/**
 * Environment variables for deployment:
 *   BASE_PATH    - the base path for the app (e.g. /explorer)
 *   ASSET_PREFIX - the full asset prefix (e.g. https://domain.com/explorer)
 *
 * If not set, defaults are used for production.
 */

/** @type {import('next').NextConfig} */

const { version } = require('./package.json');

const isProd = process.env.NODE_ENV === 'production';
const basePath = process.env.BASE_PATH || (isProd ? '/explorer' : '');
const assetPrefix = process.env.ASSET_PREFIX || (isProd ? `https://foundation.testnetrollup.shib.io${basePath}` : undefined);

const isDev = !isProd;

const IMG_SRC_HOSTS = [
  'https://raw.githubusercontent.com',
  'https://cdn.jsdelivr.net/gh/hyperlane-xyz/hyperlane-registry@main/',
];

const securityHeaders = [
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: `default-src 'self'; script-src 'self'${isDev ? " 'unsafe-eval'" : ''
      }; connect-src *; img-src 'self' data: ${IMG_SRC_HOSTS.join(' ')}; style-src 'self' 'unsafe-inline'; font-src 'self' data:; base-uri 'self'; form-action 'self'`,
  },
];

const nextConfig = {
  basePath,
  assetPrefix,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  env: {
    NEXT_PUBLIC_VERSION: version,
  },

  reactStrictMode: true,

  experimental: {
    optimizePackageImports: [
      '@hyperlane-xyz/registry',
      '@hyperlane-xyz/sdk',
      '@hyperlane-xyz/utils',
      '@hyperlane-xyz/widgets',
    ],
  },
};

module.exports = nextConfig;
