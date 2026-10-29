import { faqText, safeFaqHref } from '../home-faq-contract'
export type HomeFaqItem = { id: string; question: string; answer: string; href: string; label: string }
type Row = Record<string, any>
export function parseHomeFaq(value: unknown): HomeFaqItem[] {
 if (!Array.isArray(value)) throw new Error('Sanity FAQ response is not an array')
 const ids = new Set<string>(), result: HomeFaqItem[] = []
 for (const row of value as Row[]) {
  if (!row || row._id !== 'home-faq-homepage' || row._type !== 'homeFaqPlacement' || ids.has(row._id) || !Array.isArray(row.items)) throw new Error('Invalid Sanity FAQ placement')
  ids.add(row._id); const seen = new Set<string>()
  for (const item of row.items.filter(Boolean)) {
   if (!item || !faqText(item._id) || item._type !== 'faqItem' || seen.has(item._id) || !faqText(item.question) || !faqText(item.answer) || !faqText(item.label) || !safeFaqHref(item.href)) throw new Error('Invalid Sanity FAQ item')
   seen.add(item._id); result.push({ id: item._id, question: item.question, answer: item.answer, href: item.href, label: item.label })
  }
 }
 return result
}
