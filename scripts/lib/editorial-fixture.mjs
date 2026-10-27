import { toolGuidesFixture } from './tool-guides-fixture.mjs'
import { docsFixture } from './docs-fixture.mjs'
import { editorialMigrationDocuments } from './editorial-migration.mjs'
import { seed, idFor } from './glossary-migration.mjs'
/** Query-shaped fixtures use the actual migration documents, never legacy renderers. */
export function editorialFixture() {
  const { topics, articles } = editorialMigrationDocuments()
  const publicTopics = topics.map(topic => ({ ...topic, slug: topic.slug.current }))
  return { guides:toolGuidesFixture(), docs: docsFixture(), glossary: seed.map(term => ({ _id: idFor(term.slug), ...term })), editorial: {
    topics: publicTopics,
    articles: articles.map(article => ({ ...article, slug: article.slug.current, topics: article.topics.map(ref => publicTopics.find(topic => topic._id === ref._ref)) })),
  } }
}
