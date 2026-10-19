type BrandIconName = 'mining' | 'market' | 'block' | 'threshold' | 'settlement' | 'arrow'

export function BrandIcon({ name, className }: { name: BrandIconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === 'mining' && <>
        <rect x="3" y="7" width="18" height="11" rx="2" />
        <path d="M7 11v3m4-3v3m4-3v3m3-3v3M7 4v1m5-1v1m5-1v1M7 18v2m10-2v2" />
      </>}
      {name === 'market' && <>
        <path d="M4 7h13m-3-3 3 3-3 3M20 17H7m3-3-3 3 3 3M4 12h16" />
      </>}
      {name === 'block' && <>
        <path d="m12 3 9 5v8l-9 5-9-5V8l9-5Z" />
        <path d="m3 8 9 5 9-5m-9 5v8M7.5 5.5l9 5" />
      </>}
      {name === 'threshold' && <>
        <path d="M4 4v16h16M7 16l4-4 4 2 5-8" />
        <path d="M4 9h16" strokeDasharray="2 3" />
      </>}
      {name === 'settlement' && <>
        <path d="M19 5.5A9 9 0 1 0 21 12M19 2v4h-4" />
        <path d="m8 12 3 3 6-6" />
      </>}
      {name === 'arrow' && <path d="M4 12h15m-6-6 6 6-6 6" />}
    </svg>
  )
}
