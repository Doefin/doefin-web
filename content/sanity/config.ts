/** Public project identifiers, never credentials. Shared by website and migration. */
export const sanityProjectId = 'yzvr33lo'
export const sanityDataset = 'production'
export const sanityApiVersion = '2025-02-19'
// Optional navigation and FAQ reads must not hold up the rest of a page.
export const sanityOptionalContentTimeoutMs = 2_000
export const glossaryQuery = `*[_type == "glossaryTerm"] | order(term asc){
  _id, "slug": slug.current, term, shortDef, aliases, body, browseTopic, domain,
  "seeAlso": seeAlso[]->slug.current, faq[]{q, a}, updatedAt
}`
