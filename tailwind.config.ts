import type { Config } from 'tailwindcss'

/**
 * Brand tokens are lifted from the trading app so the two properties read as one
 * company. Do not introduce arbitrary hex values in components — add a token here.
 *
 * The company brand (vendor/doefin-brand, see docs/brand.md) adds its own tokens under
 * a df- prefix (bg-df-surface, text-df-text-muted, rounded-df-panel, text-df-figure).
 * They read the --df-* variables that app/globals.css imports.
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const doefinBrand = require('./vendor/doefin-brand/dist/tailwind-preset.cjs')

export default {
  presets: [doefinBrand],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Grounds
        ink: '#0A0F1C',           // deepest panel / page ground
        surface: '#1c1f2e',       // card background
        surfaceAlt: '#1E243C',    // alternate panel
        active: '#2A3A5C',        // selected / active state

        // Type
        body: '#E8ECF4',
        muted: '#838EA7',
        subtle: '#99A2B5',

        // Brand
        brand: '#3475FE',         // primary CTA / links
        brandAction: '#2C63D6',   // high-contrast filled audience actions (white text: 5.44:1)
        brandDeep: '#5B73E8',
        chart: '#4F85F6',
        highlight: '#CCEAFB',

        // Semantic
        up: '#3EC875',
        down: '#F05122',
        caution: '#F0B429',
      },
      borderRadius: {
        panel: '22px',
        header: '30px',
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '68ch',
        container: '1200px',
      },
    },
  },
  plugins: [],
} satisfies Config
