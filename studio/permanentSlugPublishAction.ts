import { useState } from 'react'
import { useToast } from '@sanity/ui/toast'
import type { DocumentActionComponent, DocumentActionsContext } from 'sanity'
import { stampPermanentSlug } from './glossaryIdentity'

/** Retain Sanity's validation, permission and sync checks; stamp identity first. */
export function permanentSlugPublishAction(original: DocumentActionComponent, context: DocumentActionsContext): DocumentActionComponent {
  const client = context.getClient({ apiVersion: '2025-02-19' })
  const action: DocumentActionComponent = props => {
    const result = original(props)
    const [busy, setBusy] = useState(false)
    const toast = useToast()
    if (!result) return null
    return { ...result, disabled: result.disabled || busy, onHandle: async () => {
      if (result.disabled || busy) return
      setBusy(true)
      try {
        await stampPermanentSlug(client, props.id)
        result.onHandle?.()
      } catch (error) {
        toast.push({ status: 'error', title: 'Could not publish content', description: error instanceof Error ? error.message : 'Please retry after the draft has saved.' })
      } finally { setBusy(false) }
    } }
  }
  action.action = 'publish'
  return action
}
