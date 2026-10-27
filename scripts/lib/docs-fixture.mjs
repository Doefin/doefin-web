import { docsMigrationDocuments } from './docs-migration.mjs'
/** Actual query shape, including optional weak-reference dereferencing. */
export function docsFixture(documents = docsMigrationDocuments()) {
  return documents.map(doc => ({...doc,slug:doc.slug.current,related:doc.related.map(ref => {
    const target=documents.find(row=>row._id===ref._ref)
    return {_ref:ref._ref,target:target ? {_id:target._id,_type:target._type,slug:target.slug.current}:null}
  })}))
}
