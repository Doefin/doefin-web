import { ReferenceGlossaryIndex } from '@/components/content/ReferencePages'
import { seo } from '@/lib/seo'

export const metadata = seo({
  title: 'Bitcoin mining glossary',
  description:
    'Short, factual definitions of the terms used in Bitcoin mining difficulty and hashrate economics.',
  path: '/glossary',
})

export default function GlossaryIndex() {
  return <ReferenceGlossaryIndex />
}
