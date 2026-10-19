import Link from '@/components/routing/SiteLink'
import { Arrow } from './Arrow'

const questions = [
  { question: 'How do I fund my account?', answer: 'Open Funds in the app and follow the deposit instructions for your selected token and network. Check the destination and wait for confirmation before trading. Available funding routes can have different fees and conditions.', href: '/v3/docs/getting-collateral', label: 'Read the funding guide' },
  { question: 'How does a market settle?', answer: 'Each market specifies a difficulty threshold and an observation block. After resolution, winning position tokens can be redeemed for the stated payout; losing tokens pay zero. Redemption and withdrawal are separate steps.', href: '/v3/docs/how-settlement-works', label: 'Read the settlement guide' },
  { question: 'Can I exit before settlement?', answer: 'You can place a sell order for position tokens you hold. A sale depends on available liquidity and price, so a complete exit is not guaranteed. Cancelling an open order does not sell an existing position.', href: '/v3/docs/managing-positions', label: 'Read about managing positions' },
  { question: 'What fees and costs should I check?', answer: 'Review the costs shown for your order and funding route before confirming. Wallets, exchanges and conversion services may charge separately. Your purchase price and applicable costs affect your result, even when your position wins.', href: '/v3/docs/market-vs-limit-orders', label: 'Read about orders and execution' },
  { question: 'What risks should I understand?', answer: 'A losing position has no payout. Liquidity, collateral and technical dependencies also matter. A difficulty position does not cover every mining risk: Bitcoin price, power costs and downtime remain separate considerations.', href: '/v3/docs/risks-and-limitations', label: 'Read the risks and limitations' },
]

/** Native disclosures keep every answer in the HTML and work without JavaScript. */
export function HomeFaq() {
  return <div className="divide-y divide-white/10 border-y border-white/10">
    {questions.map(item => <details key={item.href} className="group">
      <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-5 text-left text-base font-semibold hover:text-highlight [&::-webkit-details-marker]:hidden">
        {item.question}
        <span aria-hidden="true" className="relative h-5 w-5 shrink-0 text-subtle"><span className="absolute left-1 top-2.5 h-px w-3 bg-current" /><span className="absolute left-2.5 top-1 h-3 w-px bg-current group-open:hidden" /></span>
      </summary>
      <div className="pb-5 pr-3 sm:pr-8">
        <p className="max-w-2xl text-[15px] leading-relaxed text-subtle">{item.answer}</p>
        <Link href={item.href} className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-highlight hover:underline underline-offset-4">{item.label} <Arrow className="!h-4 !w-4 shrink-0" /></Link>
      </div>
    </details>)}
  </div>
}
