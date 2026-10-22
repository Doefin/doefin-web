import assert from 'node:assert/strict'
import { normalizePublicSnapshot, isPublicSnapshot, marketIdentity, samePublicMarket, marketReviewUrl } from '../lib/public-markets.ts'
import { Rational, estimateProduction, estimateProtection, estimatePremium, supportsProductionSizing, formatPublicAmount, validateMinerInputs } from '../lib/public-miners-math.ts'

let checks = 0
const check = (name, fn) => { fn(); checks++; console.log(`PASS ${name}`) }
const analytics = {current_block_height:972622,current_difficulty:140577680051919.62}
const row = { id:'cbBTC-490-148-x', marketId:29,currency:'cbBTC',targetBlock:987840,settlementBlock:987846,difficultyThresholdTrillions:148,yesPriceExact:'0.610000000000000000001',noPriceExact:'0.46',resolved:false }
const snapshot = rows => normalizePublicSnapshot(analytics,{markets:rows},{avg_fee_btc:'0.00000000000000000001'}, '2026-10-22T14:25:00.000Z')
const market = snapshot([row]).markets[0]
check('normalizes raw difficulty to trillions, preserves exact price and fee strings',()=>{const s=snapshot([row]);assert.equal(s.currentDifficultyTrillions,140.57768005191962);assert.equal(s.markets[0].yesPrice,row.yesPriceExact);assert.equal(s.averageFeeBtc,'0.00000000000000000001');assert.ok(isPublicSnapshot(s))})
check('rejects partial network data rather than invented baseline',()=>assert.throws(()=>normalizePublicSnapshot({}, {markets:[row]}, {})))
check('excludes resolved, observed, missing-side and invalid tuples',()=>assert.equal(snapshot([{...row,resolved:true},{...row,targetBlock:900000},{...row,noPriceExact:null},{...row,settlementBlock:1},{...row,marketId:NaN}]).markets.length,0))
check('rejects duplicate IDs and canonical tuples rather than choosing first',()=>{assert.equal(snapshot([row,{...row,yesPriceExact:'0.5'}]).markets.length,0);assert.equal(snapshot([row,{...row,id:'different',marketId:31}]).markets.length,0)})
check('permits a price of one and a conditional zero return',()=>{assert.equal(snapshot([{...row,noPriceExact:'1'}]).markets[0].noPrice,'1');assert.equal(estimatePremium('0.1','1').netIfNo.fixed(6),'0.000000')})
check('market selection identity survives reordering and prices but rejects changed tuple or ID',()=>{assert.equal(marketIdentity(market),marketIdentity({...market,yesPrice:'0.9'}));assert.ok(samePublicMarket(market,{...market}));assert.ok(!samePublicMarket(market,{...market,marketId:30}));assert.ok(!samePublicMarket(market,{...market,targetBlock:987841}))})
check('strict review URL uses observation block, trillions, ID and intended side; never amount',()=>{const url=new URL(marketReviewUrl(market,'no'));assert.equal(url.pathname,'/app/market-review/cbBTC/987840/148');assert.equal(url.searchParams.get('marketId'),'29');assert.equal(url.searchParams.get('side'),'no');assert.equal(url.searchParams.size,2);assert.throws(()=>marketReviewUrl(market,'sell'));assert.throws(()=>marketReviewUrl(market,'yes','javascript:alert(1)'))})
check('production PH/EH units agree without decimal loss',()=>{const ph=estimateProduction('1000','PH','0.125',140,'2');const eh=estimateProduction('1','EH','0.125',140,'2');assert.equal(ph.fixed(15),eh.fixed(15));assert.ok(ph.number()>0)})
check('protection rounds payout to 0.01 before exact pricing',()=>{const p=estimateProtection(new Rational('10'),100,110,'0.610000000000000000001');assert.equal(p.payout.fixed(2),'0.91');assert.equal(p.cost.fixed(23),'0.55510000000000000000091')})
check('threshold at or below current produces zero protection sizing',()=>{assert.equal(estimateProtection(new Rational(10),100,90,'0.5').payout.fixed(2),'0.00');assert.equal(estimateProtection(new Rational(10),100,100,'0.5').payout.fixed(2),'0.00')})
check('NO budget estimates buying exposure, preserving decimal cost and loss boundary',()=>{const p=estimatePremium('0.10000000000000000001','0.5');assert.equal(p.payout.fixed(20),'0.20000000000000000002');assert.equal(p.netIfNo.fixed(20),'0.10000000000000000001');assert.throws(()=>estimatePremium('-1','0.5'))})
check('horizon validates separately and scales production; rejects blank fees',()=>{const a=estimateProduction('1000','PH','0',140,'1'),b=estimateProduction('1000','PH','0',140,'2');assert.equal(a.mul(2).fixed(15),b.fixed(15));assert.throws(()=>estimateProduction('1000','PH','',140,'2'));assert.throws(()=>estimateProduction('1000','PH','0',140,'13'))})
check('USDC and unsupported collateral cannot size BTC production',()=>{assert.equal(supportsProductionSizing('cbBTC'),true);for(const symbol of ['USDC','USDT','cbBTC.e',''])assert.equal(supportsProductionSizing(symbol),false)})
check('small positive estimates never display as zero',()=>assert.equal(formatPublicAmount(new Rational('0.00000000001')),'<0.000001'))
check('small losses retain their sign instead of negative zero',()=>{assert.equal(formatPublicAmount(new Rational('-0.00000000001')),'>-0.000001');assert.equal(formatPublicAmount(new Rational('-0.00001'),3),'-0.000010')})
check('field validation identifies each invalid input and preserves valid zero fees',()=>{const e=validateMinerInputs({hash:'0',fees:'-0.1',epochs:'13',risk:'0'},true);for(const field of ['hash','fees','epochs','risk'])assert.ok(e[field]);assert.deepEqual(validateMinerInputs({hash:'1000',fees:'0',epochs:'0.5',risk:'0'},false),{hash:'',fees:'',epochs:'',risk:''})})
check('field validation rejects incomplete and nonfinite numeric text',()=>{const e=validateMinerInputs({hash:'abc',fees:'',epochs:'.',risk:'NaN'},true);for(const field of ['hash','fees','epochs','risk'])assert.ok(e[field])})
console.log(`${checks} public-market and planner regression checks passed.`)
