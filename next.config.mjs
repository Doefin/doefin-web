/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // PostHog is proxied through our own origin so ad-blockers — heavy on a crypto
  // audience — do not drop analytics. Mirrors the trading app's configuration.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: 'https://eu-assets.i.posthog.com/static/:path*' },
      { source: '/ingest/:path*', destination: 'https://eu.i.posthog.com/:path*' },
    ]
  },
}
export default nextConfig
