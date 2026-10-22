import Link from '@/components/routing/SiteLink'
import { allV3Docs, v3DocGroups } from '@/content'
import { seo } from '@/lib/seo'
import { V3DocsLayout } from './V3DocsLayout'

export const metadata = seo({ title: 'Doefin documentation', description: 'Understand Bitcoin difficulty markets, learn the app workflows and find definitions, risks and technical reference.', path: '/v3/docs' })

const groupDescriptions = {
  'Understand Doefin': 'Build a clear picture of the underlying, market mechanics, settlement and risks.',
  'Use the app': 'Follow a specific task, from signing in and funding to managing orders and withdrawing.',
  Reference: 'Look up a term, check collateral details or review the evidence behind a technical claim.',
}

export default function V3DocsIndex() {
  const docs = allV3Docs()
  return <V3DocsLayout title="Doefin documentation" summary="Understand the product, complete a task or look up a reference. Start where your question begins." eyebrow="Documentation">
    <div className="border-l-2 border-brand pl-5">
      <h2 className="text-lg font-bold">New to Doefin?</h2>
      <p className="mt-2 text-[16px] leading-relaxed text-subtle">The overview explains what the market tracks and how an order, a position and a payout fit together.</p>
      <Link href="/v3/docs/overview" className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-highlight underline-offset-4 hover:underline">Start with the Doefin overview <span aria-hidden="true" className="ml-2">→</span></Link>
    </div>
    <div className="mt-12 space-y-12">{v3DocGroups.map(group => <section key={group}>
      <h2 className="text-2xl font-bold tracking-[-0.02em]">{group}</h2>
      <p className="mt-2 text-sm leading-relaxed text-subtle">{groupDescriptions[group]}</p>
      <ul className="mt-5 divide-y divide-white/10 border-y border-white/10">{docs.filter(doc => doc.group === group).map(doc => <li key={doc.slug}>
        <Link href={'/v3/docs/' + doc.slug} className="group block py-4">
          <h3 className="text-base font-semibold group-hover:text-highlight">{doc.title} <span aria-hidden="true">→</span></h3>
          <p className="mt-1.5 text-sm leading-relaxed text-subtle">{doc.summary}</p>
        </Link>
      </li>)}</ul>
    </section>)}</div>
    <aside className="mt-12 rounded-panel border border-white/10 bg-surface/40 p-6" aria-labelledby="docs-resources">
      <h2 id="docs-resources" className="text-xl font-bold">Explore the mining context</h2>
      <p className="mt-3 text-sm leading-relaxed text-subtle">The resource library connects mining fundamentals, calculators and worked examples. Look up a network term in the mining glossary, or compare production with your own assumptions.</p>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
        {[
          ['Browse resources', '/v3/resources'],
          ['Mining glossary', '/v3/glossary'],
          ['Compare production scenarios', '/v3/tools/difficulty-exposure'],
        ].map(([label, href]) => <Link key={href} href={href} className="inline-flex min-h-11 items-center text-sm font-semibold text-highlight hover:underline">{label} <span aria-hidden="true" className="ml-2">→</span></Link>)}
      </div>
    </aside>
  </V3DocsLayout>
}
