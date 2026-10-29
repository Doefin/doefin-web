import { draftMode } from 'next/headers'
export async function GlossaryPreviewNotice() {
  if (!(await draftMode()).isEnabled) return null
  return <aside className="border-b border-brand/40 bg-surface px-6 py-3 text-center text-sm">Draft preview: unpublished glossary content. <a href="/api/sanity/exit-preview" className="underline">Exit preview</a></aside>
}
