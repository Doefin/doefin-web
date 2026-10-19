import { ReferenceGlossaryIndex } from '@/components/content/ReferencePages'
import { seo } from '@/lib/seo'

export const metadata = seo({
  title: 'Bitcoin mining glossary',
  description:
    'Every term in Bitcoin mining difficulty and hashrate economics, defined once, properly.',
  path: '/glossary',
})

export default function GlossaryIndex() {
  return <ReferenceGlossaryIndex />
}
