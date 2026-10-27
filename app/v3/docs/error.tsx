'use client'
export default function DocsError({reset}:{reset:()=>void}) {
  return <section role="alert" className="mx-auto max-w-prose px-6 py-16"><h1 className="text-3xl font-bold">Documentation is temporarily unavailable</h1><p className="mt-4 text-subtle">Published documentation could not be loaded. Please try again.</p><button onClick={reset} className="mt-6 min-h-11 text-highlight underline">Try again</button></section>
}
