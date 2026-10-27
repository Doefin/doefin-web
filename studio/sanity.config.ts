import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { permanentSlugPublishAction } from './permanentSlugPublishAction'
import { glossaryTerm } from './schemaTypes/glossaryTerm'

export default defineConfig({
  name: 'doefin-marketing',
  title: 'Doefin Marketing Site',
  projectId: 'yzvr33lo',
  dataset: 'production',
  plugins: [structureTool()],
  releases: { enabled: false },
  scheduledDrafts: { enabled: false },
  schema: { types: [glossaryTerm] },
  document: {
    actions: (previous, context) => context.schemaType === 'glossaryTerm'
      ? previous.filter(action => !['duplicate', 'restore'].includes(String(action.action))).map(action => action.action === 'publish' ? permanentSlugPublishAction(action, context) : action)
      : previous,
  },
})
