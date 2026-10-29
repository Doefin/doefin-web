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
import { aboutPage } from './schemaTypes/aboutPage'
import { authorProfile } from './schemaTypes/authorProfile'
import { researchReport } from './schemaTypes/researchReport'
import { researchMethodology } from './schemaTypes/researchMethodology'

export default defineConfig({
  name: 'doefin-marketing',
  title: 'Doefin Marketing Site',
  projectId: 'yzvr33lo',
  dataset: 'production',
  plugins: [structureTool()],
  releases: { enabled: false },
  scheduledDrafts: { enabled: false },
  schema: { types: [glossaryTerm, topic, editorialArticle, docPage, toolGuide, faqItem, homeFaqPlacement, aboutPage, authorProfile, researchReport, researchMethodology] },
  document: {
    actions: (previous, context) => ['glossaryTerm', 'topic', 'editorialArticle', 'docPage', 'toolGuide', 'faqItem', 'homeFaqPlacement', 'aboutPage', 'authorProfile', 'researchReport', 'researchMethodology'].includes(context.schemaType)
      ? previous.filter(action => !['duplicate', 'restore'].includes(String(action.action))).map(action => ['glossaryTerm', 'topic', 'editorialArticle', 'docPage', 'toolGuide', 'researchReport', 'researchMethodology'].includes(context.schemaType) && action.action === 'publish' ? permanentSlugPublishAction(action, context) : action)
      : previous,
  },
})
