import { researchForecasts } from '@/lib/research-data'
import { evaluateForecasts } from '@/lib/research-archive'
export const dynamic = 'force-static'
export function GET() { return Response.json({ schemaVersion: '1.0.0', status: 'No prospective forecasts published', records: researchForecasts, evaluation: evaluateForecasts(researchForecasts, []), marketListingPrecedence: 'Unverified; no original publication or listing receipts supplied', guidance: 'Use the illustrative epoch pages for the prototype flow. A local hash chain is not proof of publication or immutable hosting.' }, { headers: { 'X-Robots-Tag': 'noindex, nofollow' } }) }
