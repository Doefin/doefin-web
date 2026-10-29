import 'server-only'
import { apiFailure, parseCurrentHashrate, parseDifficultyAnalytics, type BackendData, type CurrentHashrate, type DifficultyAnalytics } from './bitcoin-analytics-contract'

const apiBase = () => (process.env.DOFIN_API_BASE_URL || 'https://api.doefin.com').replace(/\/+$/, '')
async function fetchEndpoint<T>(path: string, parse: (value: unknown) => T | null): Promise<BackendData<T>> {
  const receivedAt = new Date().toISOString()
  let url: URL
  try {
    url = new URL(path, `${apiBase()}/`)
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Unsupported API protocol')
  } catch {
    return { status: 'unavailable', httpStatus: null, receivedAt, detail: 'API base URL is invalid' }
  }
  try {
    const response = await fetch(url, { cache: 'no-store', headers: { accept: 'application/json' }, signal: AbortSignal.timeout(8000) })
    let body: unknown
    try { body = await response.json() } catch { body = null }
    const respondedAt = new Date().toISOString()
    if (!response.ok) return apiFailure(response.status, body, respondedAt)
    const data = parse(body)
    return data ? { status: 'available', httpStatus: response.status, receivedAt: respondedAt, data } : { status: 'invalid', httpStatus: response.status, receivedAt: respondedAt }
  } catch {
    return { status: 'unavailable', httpStatus: null, receivedAt: new Date().toISOString() }
  }
}

export const getDifficultyAnalytics = () => fetchEndpoint<DifficultyAnalytics>('/v1/block/analytics', parseDifficultyAnalytics)
export const getCurrentHashrate = () => fetchEndpoint<CurrentHashrate>('/bitcoin/hashrate/current', parseCurrentHashrate)
