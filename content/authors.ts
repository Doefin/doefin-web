/**
 * Who published a piece.
 *
 * Deliberately an organisation, not a person, and deliberately not more than one
 * record. Google accepts an Organization author, and "one research desk" is an
 * accurate description of how this content is produced.
 *
 * The temptation is to invent a named analyst for E-E-A-T. On a site whose Terms
 * admit professional investors only, and whose figures a fund might size a
 * position against, attaching a fabricated person to a difficulty estimate is not
 * an optimisation — it is a false statement about who produced a financial claim.
 * A real name belongs here only when all three hold: the person is real and
 * checkable, at least one `sameAs` URL resolves today, and they are free to
 * publish a result that makes Doefin look wrong.
 *
 * `url` must resolve. An author node pointing at a 404 is worse than no node.
 */

export type Author = {
  slug: string
  kind: 'organization' | 'person'
  name: string
  /** Must resolve — the anchor exists in app/about/page.tsx. */
  url: string
  description: string
  sameAs?: string[]
}

export const authors: Author[] = [
  {
    slug: 'doefin-research',
    kind: 'organization',
    name: 'Doefin Research',
    url: '/about#doefin-research',
    description:
      'The research desk at Doefin. Publishes difficulty forecasts as reproducible arithmetic over public chain data, with the method versioned and every restatement logged.',
  },
]

/** Throws rather than returning undefined, so a typo fails the build. */
export function getAuthor(slug: string): Author {
  const a = authors.find((x) => x.slug === slug)
  if (!a) throw new Error(`Unknown author "${slug}". Add it to content/authors.ts.`)
  return a
}
