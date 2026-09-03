import Link from 'next/link'
import type { ToolGuideContent } from '@/content'

/**
 * The long-form guide, rendered as an article rather than as help text bolted to a
 * calculator. Same words, different job: on the tool page they were a wall nobody
 * read, and here they are the page itself.
 *
 * Every section carries an id so the contents list can jump to it — and so an
 * assistant quoting this page can cite the specific heading rather than the URL.
 */

const SECTIONS = [
  { id: 'how-to-use', label: 'How to use it' },
  { id: 'settings', label: 'What each setting means' },
  { id: 'reading', label: 'Reading the answer' },
  { id: 'walkthrough', label: 'A worked example' },
  { id: 'mistakes', label: 'Mistakes people make' },
  { id: 'limits', label: 'What it does not tell you' },
] as const

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-2xl font-extrabold tracking-[-0.02em]">
      {children}
    </h2>
  )
}

function OpenTool({ slug, title }: { slug: string; title: string }) {
  return (
    <Link
      href={`/tools/${slug}`}
      className="group flex items-center justify-between gap-4 rounded-panel border border-brand/30 bg-brand/[0.07] px-6 py-5 transition-colors hover:border-brand/60"
    >
      <span>
        <span className="block text-xs font-bold uppercase tracking-[0.12em] text-brand">
          Open the calculator
        </span>
        <span className="mt-1 block font-bold tracking-[-0.015em]">{title}</span>
      </span>
      <span aria-hidden className="text-2xl text-brand transition-transform group-hover:translate-x-1">
        →
      </span>
    </Link>
  )
}

export function GuideArticle({
  g,
  slug,
  toolTitle,
}: {
  g: ToolGuideContent
  slug: string
  toolTitle: string
}) {
  return (
    <>
      <div className="mt-8">
        <OpenTool slug={slug} title={toolTitle} />
      </div>

      <nav aria-label="On this page" className="mt-10 border-y border-white/[0.07] py-5">
        <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted">On this page</h2>
        <ol className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {SECTIONS.map((s, i) => (
            <li key={s.id} className="flex gap-3 text-[15px]">
              <span aria-hidden className="tabular text-muted/60">
                {i + 1}
              </span>
              <a href={`#${s.id}`} className="text-subtle hover:text-brand hover:underline">
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 space-y-4">
        <p className="text-[19px] leading-[1.65] text-body">{g.whatItIs}</p>
        <p className="text-[17px] leading-[1.7] text-muted">{g.whoFor}</p>
      </div>

      <section className="mt-14">
        <H2 id="how-to-use">How to use it</H2>
        <ol className="mt-6 space-y-4">
          {g.howToUse.map((step, i) => (
            <li key={i} className="flex gap-4 text-[16px] leading-[1.7] text-subtle">
              <span
                aria-hidden
                className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/15 text-xs font-bold text-brand"
              >
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <H2 id="settings">What each setting means</H2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          Every number the calculator asks for, what it is, and where to find yours.
        </p>
        <div className="mt-6 divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {g.inputs.map((i) => (
            <div key={i.label} className="py-7">
              <h3 className="text-lg font-bold tracking-[-0.015em] text-body">{i.label}</h3>
              <p className="mt-3 text-[16px] leading-[1.7] text-subtle">{i.means}</p>
              <p className="mt-3 text-[15px] leading-[1.7] text-muted">
                <span className="font-semibold text-body">Where to find it: </span>
                {i.whereToFind}
              </p>
              <p className="mt-3 text-[15px] leading-[1.7] text-muted">
                <span className="font-semibold text-body">Typical range: </span>
                {i.typical}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <H2 id="reading">Reading the answer</H2>
        <div className="mt-6 space-y-6">
          {g.readingResults.map((r) => (
            <div key={r.figure} className="rounded-panel border border-white/[0.07] bg-surface p-6">
              <h3 className="font-bold leading-snug tracking-[-0.015em] text-brand">{r.figure}</h3>
              <p className="mt-3 text-[16px] leading-[1.7] text-subtle">{r.means}</p>
              <p className="mt-4 border-t border-white/[0.07] pt-4 text-[15px] leading-[1.7] text-muted">
                <span className="font-semibold text-body">So: </span>
                {r.soWhat}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <H2 id="walkthrough">{g.walkthrough.title}</H2>
        <p className="mt-3 text-[16px] leading-[1.7] text-subtle">{g.walkthrough.setup}</p>
        <ol className="mt-6 space-y-3">
          {g.walkthrough.steps.map((s, i) => (
            <li
              key={i}
              className="flex gap-4 rounded-lg border border-white/[0.07] bg-surface px-5 py-4 text-[15px] leading-[1.7] text-subtle"
            >
              <span aria-hidden className="tabular shrink-0 font-bold text-brand">
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 border-l-[3px] border-brand pl-5 text-[17px] leading-[1.7] text-body">
          {g.walkthrough.takeaway}
        </p>
      </section>

      <section className="mt-14">
        <H2 id="mistakes">Mistakes people make</H2>
        <ul className="mt-6 space-y-4">
          {g.mistakes.map((m, i) => (
            <li key={i} className="flex gap-3 text-[16px] leading-[1.7] text-subtle">
              <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-caution" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <H2 id="limits">What it does not tell you</H2>
        <ul className="mt-6 space-y-4">
          {g.limits.map((l, i) => (
            <li key={i} className="flex gap-3 text-[16px] leading-[1.7] text-subtle">
              <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted" />
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-14">
        <OpenTool slug={slug} title={toolTitle} />
      </div>
    </>
  )
}
