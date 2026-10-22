import assert from 'node:assert/strict'
import { GET } from '../app/api/v3/market-review-support/route.ts'
const original = globalThis.fetch
let count=0
try {
  for (const test of [
    { response: () => Response.json({version:1}), expected:true },
    { response: () => Response.json({version:2}), expected:false },
    { response: () => new Response('missing', {status:404}), expected:false },
    { response: () => new Response('<html>legacy app</html>'), expected:false },
    { response: () => { throw new Error('offline') }, expected:false },
  ]) {
    globalThis.fetch = async (url, options) => {assert.equal(url,'https://www.doefin.com/api/market-review-support');assert.equal(options.cache,'no-store');assert.deepEqual(options.headers,{Accept:'application/json'});return test.response()}
    const response=await GET()
    assert.equal(response.headers.get('cache-control'),'no-store')
    assert.deepEqual(await response.json(),{supported:test.expected})
    count++
  }
} finally { globalThis.fetch=original }
console.log(`${count} app support handshake checks passed.`)
