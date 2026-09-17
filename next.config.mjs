/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // PostHog is proxied through our own origin so ad-blockers — heavy on a crypto
  // audience — do not drop analytics. Mirrors the trading app's configuration.
  skipTrailingSlashRedirect: true,
  async redirects() {
    const originalSections = [
      'about', 'academy', 'blog', 'data', 'docs', 'for', 'glossary', 'methodology',
      'newsletter', 'privacy', 'research', 'resources', 'terms', 'tools',
    ]
    return [
      { source: '/', destination: '/v1', permanent: false },
      { source: '/home-v2/:path*', destination: '/v2/:path*', permanent: false },
      ...originalSections.map(section => ({
        source: '/' + section + '/:path*',
        destination: '/v1/' + section + '/:path*',
        permanent: false,
      })),
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
