import {toolGuideMigrationDocuments} from './tool-guides-migration.mjs'
export const toolGuidesFixture = (documents=toolGuideMigrationDocuments()) => documents.map(doc=>({...doc,slug:doc.slug.current}))
