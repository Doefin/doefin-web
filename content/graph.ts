import { allAcademy, allGlossary, allPosts, allReports } from '.'
import { termsIn } from '@/lib/terms'

/**
 * The link graph, derived at module load — therefore at build time. No runtime,
 * no backend, no hand-maintained "related" lists.
 *
 * Why this exists: every `<NextLinks>` on the site passed a hardcoded array, and
 * between all 27 call sites they resolved to about ten hub URLs already in the
 * nav. Every glossary page ended with the same three links; both blog posts ended
 * with the same three. No article linked to another article, and no glossary term
 * linked back to a page that used it. The arrow ran one way — prose down into the
 * glossary — and stopped there.
 *
 * The precedent for deriving rather than authoring is already in this repo:
 * `examplesFor()` in content/tools.ts, and the sibling-epoch nav on the epoch
 * pages. This extends it to editorial content.
 */

export type RefKind = 'post' | 'academy' | 'research' | 'glossary'

export type Ref = {
  kind: RefKind
  slug: string
  href: string
  title: string
  summary: string
  publishedAt?: string
  tags?: string[]
  terms: string[]
}

const HUB: Record<RefKind, { href: string; label: string; note: string }> = {
  post: { href: '/blog', label: 'All notes', note: 'Shorter pieces on mining economics and method.' },
  academy: { href: '/academy', label: 'Academy', note: 'How difficulty, hashrate and hashprice actually work.' },
  research: { href: '/research', label: 'Research', note: 'Dated reports, with their sources and confidence.' },
  glossary: { href: '/glossary', label: 'Glossary', note: 'Definitions, each written to be quoted.' },
}

/** Every editorial item, with the glossary terms it actually mentions. */
export function allRefs(): Ref[] {
  const posts = allPosts().map((p) => ({
    kind: 'post' as const,
    slug: p.slug,
    href: `/blog/${p.slug}`,
    title: p.title,
    summary: p.summary,
    publishedAt: p.publishedAt,
    tags: p.tags,
    terms: termsIn(p.body),
  }))

  const academy = allAcademy().map((p) => ({
    kind: 'academy' as const,
    slug: p.slug,
    href: `/academy/${p.slug}`,
    title: p.title,
    summary: p.summary,
    publishedAt: p.publishedAt,
    // A declared term is a claim the piece is ABOUT the concept, which is stronger
    // than happening to name it. Union, so neither source can silently lose a link.
    terms: Array.from(new Set([...termsIn(p.body), ...(p.glossaryTerms ?? [])])),
  }))

  const research = allReports().map((r) => ({
    kind: 'research' as const,
    slug: r.slug,
    href: `/research/${r.slug}`,
    title: r.title,
    summary: r.summary,
    publishedAt: r.publishedAt,
    terms: Array.from(new Set([...termsIn(r.body), ...termsIn(r.findings)])),
  }))

  return [...posts, ...academy, ...research]
}

/**
 * The inversion: which pages use each glossary term.
 *
 * This is the missing return leg. It also gives each of the 19 near-identical
 * glossary pages a block of content unique to it, which is the real thin-content
 * exposure today.
 */
export function usedBy(slug: string): Ref[] {
  return allRefs()
    .filter((r) => r.terms.includes(slug))
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
}

/**
 * Relatedness, stated so it can be argued with.
 *
 * Shared glossary terms are weighted above shared tags because terms are what
 * this site actually computes: the two blog posts share no tags at all, so a
 * tag-only rule would render an empty block on every post today.
 *
 * Anything scoring zero is dropped rather than padded. deagentic's theme
 * backfills its "Related Articles" with the newest posts when tags do not match,
 * which means a block labelled "related" routinely is not — a credibility cost on
 * a research site, for no gain. Two honest links beat three padded ones.
 */
export function siblings(ref: Ref, n = 2): Ref[] {
  const scored = allRefs()
    .filter((r) => !(r.kind === ref.kind && r.slug === ref.slug))
    .map((r) => {
      const sharedTerms = r.terms.filter((t) => ref.terms.includes(t)).length
      const sharedTags = (r.tags ?? []).filter((t) => (ref.tags ?? []).includes(t)).length
      return { ref: r, score: 2 * sharedTerms + sharedTags }
    })
    .filter((x) => x.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        Math.abs(Date.parse(a.ref.publishedAt ?? '') - Date.parse(ref.publishedAt ?? '')) -
          Math.abs(Date.parse(b.ref.publishedAt ?? '') - Date.parse(ref.publishedAt ?? '')) ||
        a.ref.slug.localeCompare(b.ref.slug),
    )

  // At most one sibling of the same kind, so a reader is offered a different
  // shape of thing rather than three more of what they are already reading.
  const out: Ref[] = []
  const kinds = new Set<RefKind>()
  for (const { ref: r } of scored) {
    if (kinds.has(r.kind) && out.length) continue
    kinds.add(r.kind)
    out.push(r)
    if (out.length >= n) break
  }
  return out
}

/** Find a ref by href, so a route can look itself up without rebuilding one. */
export const refFor = (href: string): Ref | undefined => allRefs().find((r) => r.href === href)

/**
 * "Where to go next": one hub upward, then real siblings.
 *
 * Replaces the hardcoded arrays. The hub link is kept because a reader who wants
 * breadth still needs it, but it no longer occupies all three slots.
 */
export function nextLinksFor(
  ref: Ref | undefined,
  fallback: RefKind = 'research',
): { href: string; label: string; note: string }[] {
  // A ref can be missing for a draft or a route not yet in the graph. Degrade to
  // the hub rather than throwing during the build.
  if (!ref) return [HUB[fallback]]
  const hub = HUB[ref.kind]
  return [
    ...siblings(ref, 2).map((s) => ({ href: s.href, label: s.title, note: s.summary })),
    { href: hub.href, label: hub.label, note: hub.note },
  ]
}

/** The same, for a glossary term: pages that use it, then the glossary hub. */
export function nextLinksForTerm(slug: string): { href: string; label: string; note: string }[] {
  const uses = usedBy(slug).slice(0, 2)
  const seeAlso = allGlossary().find((t) => t.slug === slug)?.seeAlso ?? []
  const related = seeAlso
    .map((s) => allGlossary().find((t) => t.slug === s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
    .slice(0, 2 - uses.length)

  return [
    ...uses.map((u) => ({ href: u.href, label: u.title, note: u.summary })),
    ...related.map((t) => ({
      href: `/glossary/${t.slug}`,
      label: t.term,
      note: t.shortDef,
    })),
    { href: HUB.glossary.href, label: HUB.glossary.label, note: HUB.glossary.note },
  ]
}
