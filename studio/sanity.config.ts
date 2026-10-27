import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { permanentSlugPublishAction } from './permanentSlugPublishAction'
import { glossaryTerm } from './schemaTypes/glossaryTerm'
import { topic } from './schemaTypes/topic'
import { editorialArticle } from './schemaTypes/editorialArticle'
import { docPage } from './schemaTypes/docPage'
import { toolGuide } from './schemaTypes/toolGuide'

export default defineConfig({
  name: 'doefin-marketing',
  title: 'Doefin Marketing Site',
  projectId: 'yzvr33lo',
  dataset: 'production',
  plugins: [structureTool()],
  releases: { enabled: false },
  scheduledDrafts: { enabled: false },
  schema: { types: [glossaryTerm, topic, editorialArticle, docPage, toolGuide] },
  document: {
    actions: (previous, context) => ['glossaryTerm', 'topic', 'editorialArticle', 'docPage', 'toolGuide'].includes(context.schemaType)
      ? previous.filter(action => !['duplicate', 'restore'].includes(String(action.action))).map(action => action.action === 'publish' ? permanentSlugPublishAction(action, context) : action)
      : previous,
  },
})
