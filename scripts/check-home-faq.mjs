import assert from 'node:assert/strict'
import { loadTypescript } from './lib/load-typescript.mjs'
const seed=loadTypescript('content/home-faq.ts').homeFaqSeed
const contract=loadTypescript('content/home-faq-contract.ts')
const {parseHomeFaq}=loadTypescript('content/sanity/home-faq-parse.ts',{'../home-faq-contract':contract})
assert.equal(seed.length,5)
const originalFaq = [
 {id:'faq-funding-account',question:'How do I fund my account?',answer:'Open Funds in the app and follow the deposit instructions for your selected token and network. Check the destination and wait for confirmation before trading. Available funding routes can have different fees and conditions.',href:'/docs/getting-collateral',label:'Read the funding guide'},
 {id:'faq-market-settlement',question:'How does a market settle?',answer:'Each market specifies a difficulty threshold and an observation block. After resolution, winning position tokens can be redeemed for the stated payout; losing tokens pay zero. Redemption and withdrawal are separate steps.',href:'/docs/how-settlement-works',label:'Read the settlement guide'},
 {id:'faq-exit-before-settlement',question:'Can I exit before settlement?',answer:'You can place a sell order for position tokens you hold. A sale depends on available liquidity and price, so a complete exit is not guaranteed. Cancelling an open order does not sell an existing position.',href:'/docs/managing-positions',label:'Read about managing positions'},
 {id:'faq-fees-and-costs',question:'What fees and costs should I check?',answer:'Review the costs shown for your order and funding route before confirming. Wallets, exchanges and conversion services may charge separately. Your purchase price and applicable costs affect your result, even when your position wins.',href:'/docs/market-vs-limit-orders',label:'Read about orders and execution'},
 {id:'faq-risks',question:'What risks should I understand?',answer:'A losing position has no payout. Liquidity, collateral and technical dependencies also matter. A difficulty position does not cover every mining risk: Bitcoin price, power costs and downtime remain separate considerations.',href:'/docs/risks-and-limitations',label:'Read the risks and limitations'},
]
assert.deepEqual(seed.map(({id,question,answer,href,label})=>({id,question,answer,href,label})),originalFaq)
const {homeFaqMigrationDocuments,planHomeFaqImport}=await import('./lib/home-faq-migration.mjs')
const docs=homeFaqMigrationDocuments(); assert.equal(docs.length,6); assert.equal(docs[5].items.length,5)
const raw=docs.map(x=>({...x,_rev:'rev'})); assert.equal(planHomeFaqImport(raw).conflicts.length,0); assert.equal(planHomeFaqImport(raw).changed.length,0); assert.equal(planHomeFaqImport(raw).missing.length,0)
assert.equal(planHomeFaqImport([]).missing.length,6)
assert.match(planHomeFaqImport([{_id:'drafts.faq-funding-account',_type:'faqItem'}]).conflicts.join(' '),/draft\/version-only/)
assert.match(planHomeFaqImport([{_id:'faq-funding-account',_type:'editorialArticle'}]).conflicts.join(' '),/another type/)
assert.equal(contract.safeFaqHref('javascript:alert(1)'),false)
assert.equal(contract.safeFaqHref('//evil.example'),false)
assert.equal(contract.safeFaqHref('/%2e%2e/admin'),false)
const row=docs[5], items=docs.slice(0,5).map(x=>({_id:x._id,_type:x._type,...x}))
assert.equal(parseHomeFaq([{_id:row._id,_type:row._type,items}]).length,5)
assert.equal(parseHomeFaq([{_id:row._id,_type:row._type,items:[null,...items]}]).length,5)
assert.equal(parseHomeFaq([{_id:row._id,_type:row._type,items:[{...items[0],answer:'<script>alert(1)</script>'}]}])[0].answer,'<script>alert(1)</script>')
assert.throws(()=>parseHomeFaq([{_id:row._id,_type:row._type,items:[{...items[0],href:'javascript:alert(1)'}]}]),/Invalid/)
console.log('Passed exact FAQ source parity, ordered refs, create-only conflict/idempotence plan, published-reader parsing and unsafe href rejection.')
