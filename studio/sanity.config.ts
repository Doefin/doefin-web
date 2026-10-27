import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { permanentSlugPublishAction } from './permanentSlugPublishAction'
import { glossaryTerm } from './schemaTypes/glossaryTerm'
import { topic } from './schemaTypes/topic'
import { editorialArticle } from './schemaTypes/editorialArticle'
import { docPage } from './schemaTypes/docPage'
import { toolGuide } from './schemaTypes/toolGuide'
import { faqItem } from './schemaTypes/faqItem'
import { homeFaqPlacement } from './schemaTypes/homeFaqPlacement'

export default defineConfig({
  name: 'doefin-marketing',
  title: 'Doefin Marketing Site',
  projectId: 'yzvr33lo',
  dataset: 'production',
  plugins: [structureTool()],
  releases: { enabled: false },
  scheduledDrafts: { enabled: false },
  schema: { types: [glossaryTerm, topic, editorialArticle, docPage, toolGuide, faqItem, homeFaqPlacement] },
  document: {
    actions: (previous, context) => ['glossaryTerm', 'topic', 'editorialArticle', 'docPage', 'toolGuide', 'faqItem', 'homeFaqPlacement'].includes(context.schemaType)
      ? previous.filter(action => !['duplicate', 'restore'].includes(String(action.action))).map(action => ['glossaryTerm', 'topic', 'editorialArticle', 'docPage', 'toolGuide'].includes(context.schemaType) && action.action === 'publish' ? permanentSlugPublishAction(action, context) : action)
      : previous,
  },
})
