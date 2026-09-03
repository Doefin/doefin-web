import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { PageHeader, Panel, Tag } from '@/components/ui'
import { allPosts, allTags } from '@/content'
import { dateShort } from '@/lib/format'
import { seo } from '@/lib/seo'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

const toSlug = (t: string) => t.replace(/\s+/g, '-')
const fromSlug = (s: string) => allTags().find((t) => toSlug(t) === s)

export function generateStaticParams() {
  return allTags().map((t) => ({ tag: toSlug(t) }))
}
export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params
  const label = fromSlug(tag)
  if (!label) return {}
  return seo({
    title: `${label} — articles`,
    description: `Articles on ${label} from Doefin Research.`,
    path: `/blog/tag/${tag}`,
  })
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params
  const label = fromSlug(tag)
  if (!label) notFound()
  const posts = allPosts().filter((p) => p.tags.includes(label))

  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ name: 'Articles', href: '/blog' }, { name: label, href: `/blog/tag/${tag}` }]} />
      <div className="mt-6">
        <PageHeader eyebrow="Topic" title={label} lede={`${posts.length} article${posts.length === 1 ? '' : 's'}.`} />
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
            <Panel as="article" className="h-full transition-colors group-hover:border-brand/40">
              <div className="flex flex-wrap gap-2">
                {p.tags.map((t) => (<Tag key={t}>{t}</Tag>))}
              </div>
              <h2 className="mt-4 text-xl font-bold leading-snug tracking-[-0.015em]">{p.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.summary}</p>
              <p className="mt-4 text-xs text-muted/70">{dateShort(p.publishedAt)}</p>
            </Panel>
          </Link>
        ))}
      </div>

      <NextLinks
        items={[
          { href: '/blog', label: 'Blog', note: 'Commentary on what the network is doing.' },
          { href: '/research', label: 'Research', note: 'Dated reports with the data behind them.' },
          { href: '/academy', label: 'Learn', note: 'How difficulty works, from first principles.' },
        ]}
      />

      <Reviewed />
    </Container>
  )
}
