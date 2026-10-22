import { exposureBounds } from './exposure'

export const newsletterRoles = [
  ['miner', 'Miner / mining operator'], ['fund-or-desk', 'Fund / trading desk'],
  ['service-provider', 'Service provider'], ['other', 'Other'],
] as const
export type NewsletterRole = typeof newsletterRoles[number][0]
export type NewsletterRequest = {
  kind: 'newsletter'; email: string; role: NewsletterRole; company: string; domain: string;
  research: boolean; product: boolean; alerts: boolean; consent: true; token: string
}
export type DeliveryRequest = { kind: 'report' | 'scenario'; email: string; consent: true; token: string; inputs?: Record<string, number> }
export type EngagementRequest = NewsletterRequest | DeliveryRequest
export class EngagementError extends Error { constructor(public status: number, message: string, public field?: string) { super(message) } }
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
export function validateEngagement(value: unknown): EngagementRequest {
  if (!object(value)) throw new EngagementError(400, 'Enter the requested form details.')
  const email = typeof value.email === 'string' ? value.email.trim().toLowerCase() : ''
  if (email.length > 254 || !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email)) throw new EngagementError(400, 'Enter a valid email address.', 'email')
  if (value.consent !== true) throw new EngagementError(400, 'Confirm that you understand the demo before continuing.', 'consent')
  const token = typeof value.token === 'string' && value.token.length <= 2048 ? value.token : ''
  if (value.kind === 'newsletter') {
    if (!newsletterRoles.some(([role]) => role === value.role)) throw new EngagementError(400, 'Choose your role.', 'role')
    for (const key of ['research', 'product', 'alerts']) if (typeof value[key] !== 'boolean') throw new EngagementError(400, 'Choose your email preferences.', 'research')
    if (!value.research && !value.product && !value.alerts) throw new EngagementError(400, 'Choose at least one email preference.', 'research')
    const company = typeof value.company === 'string' ? value.company.trim() : ''
    const domain = typeof value.domain === 'string' ? value.domain.trim().toLowerCase() : ''
    if (company.length > 120 || /[\x00-\x1f]/.test(company)) throw new EngagementError(400, 'Use 120 characters or fewer for company.', 'company')
    if (domain && (domain.length > 253 || !/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}$/.test(domain))) throw new EngagementError(400, 'Enter a domain such as example.com, without a URL or path.', 'domain')
    return { kind: 'newsletter', email, role: value.role as NewsletterRole, company, domain, research: value.research as boolean, product: value.product as boolean, alerts: value.alerts as boolean, consent: true, token }
  }
  if (value.kind === 'report') return { kind: 'report', email, consent: true, token }
  if (value.kind === 'scenario' && object(value.inputs)) {
    const bounds = exposureBounds
    const inputs: Record<string, number> = {}
    for (const [key, [min, max]] of Object.entries(bounds)) {
      const number = value.inputs[key]
      if (typeof number !== 'number' || !Number.isFinite(number) || number < min || number > max || (key === 'epochs' && !Number.isInteger(number))) throw new EngagementError(400, 'A scenario input is outside the calculator range.')
      inputs[key] = number
    }
    return { kind: 'scenario', email, inputs, consent: true, token }
  }
  throw new EngagementError(400, 'Choose a supported email request.')
}
