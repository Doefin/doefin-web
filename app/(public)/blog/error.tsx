'use client'
export default function EditorialError({ reset }: { reset: () => void }) {
  return <div className="mx-auto max-w-3xl px-6 py-16"><h1 className="text-3xl font-bold">Articles temporarily unavailable</h1><p className="mt-4 text-subtle">We could not load the published content. Please try again.</p><button onClick={reset} className="mt-6 min-h-11 rounded-lg border border-white/20 px-4">Try again</button></div>
}
