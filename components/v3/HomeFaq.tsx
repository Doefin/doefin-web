import Link from '@/components/routing/SiteLink'
import { Arrow } from './Arrow'
import { allHomeFaq } from '@/content/sanity/home-faq'
import type { HomeFaqItem } from '@/content/sanity/home-faq-parse'

/** Native disclosures keep every answer in the HTML and work without JavaScript. */
export async function HomeFaq() {
  let questions: HomeFaqItem[]
  let unavailable = false
  try { questions = await allHomeFaq() } catch { questions = []; unavailable = true }
  if (unavailable) return <p role="status" className="text-sm text-subtle">Answers are temporarily unavailable. Please try again later.</p>
  if (!questions.length) return <p className="text-sm text-subtle">No questions are currently published.</p>
  return <div className="divide-y divide-white/10 border-y border-white/10">
    {questions.map(item => <details key={item.id} className="group">
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
