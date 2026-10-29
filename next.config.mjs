/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Render unmatched URLs with a standalone 404.
  experimental: { globalNotFound: true },
  // PostHog is proxied through our own origin so ad-blockers — heavy on a crypto
  // audience — do not drop analytics. Mirrors the trading app's configuration.
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      { source: '/v3', destination: '/', permanent: true },
      { source: '/v3/:path*', destination: '/:path*', permanent: true },
    ]
  },
  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: 'https://eu-assets.i.posthog.com/static/:path*' },
      { source: '/ingest/:path*', destination: 'https://eu.i.posthog.com/:path*' },
    ]
  },
}
export default nextConfig
