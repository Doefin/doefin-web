import { apiFailure, type BackendData } from './bitcoin-analytics-contract'

export type BrowserFallbackServerStatus = Exclude<BackendData<unknown>, { status: 'available' }>['status']

export function describeServerOutcome(status: BrowserFallbackServerStatus): string {
  if (status === 'region-restricted') return 'The server request was region-restricted; the browser request succeeded.'
  if (status === 'invalid') return 'The server response did not match the supported schema; the browser request succeeded.'
  if (status === 'not-found') return 'The server returned no record; the browser request succeeded.'
  return 'The server request did not return usable data; the browser request succeeded.'
}

export async function fetchBrowserAnalytics<T>(
  url: string,
  parse: (value: unknown) => T | null,
  fetcher: typeof fetch = fetch,
  signal?: AbortSignal,
): Promise<BackendData<T>> {
  const receivedAt = new Date().toISOString()
  try {
    const response = await fetcher(url, { method: 'GET', mode: 'cors', credentials: 'omit', cache: 'no-store', headers: { accept: 'application/json' }, signal })
    const respondedAt = new Date().toISOString()
    let body: unknown
    try { body = await response.json() } catch { body = null }
    if (!response.ok) return apiFailure(response.status, body, respondedAt)
    const data = parse(body)
    return data ? { status: 'available', httpStatus: response.status, receivedAt: respondedAt, data } : { status: 'invalid', httpStatus: response.status, receivedAt: respondedAt }
  } catch {
    return { status: 'unavailable', httpStatus: null, receivedAt: new Date().toISOString(), detail: 'The browser request failed or was blocked by CORS or network policy.' }
  }
}
