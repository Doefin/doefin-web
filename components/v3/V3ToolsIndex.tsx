import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { allGuides, getExposureTutorial, previewTools } from '@/content'
import { seo } from '@/lib/seo'
import { Arrow } from './Arrow'

export const metadata = seo({
  title: 'Mining calculators: hosting, production and payback',
  description: 'Choose a mining calculator by the question, inputs and result: compare hosting costs, size difficulty exposure or explore simplified fleet payback.',
  path: '/v3/tools',
})

const choices = [
  { slug: 'hosting-effective-rate', name: 'Hosting comparison', output: 'Effective cost per kWh', number: '01' },
  { slug: 'difficulty-exposure', name: 'Difficulty exposure', output: 'Production across two scenarios', number: '02' },
  { slug: 'fleet-payback', name: 'Fleet payback', output: 'Recovery across difficulty paths', number: '03' },
] as const

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight'
const sampleLabel = 'text-[10px] font-bold uppercase tracking-[0.12em] text-caution'
const inputsLabel = 'text-[10px] font-bold uppercase tracking-[0.12em] text-subtle'

function StartLink({ slug, children }: { slug: string; children: React.ReactNode }) {
  return <Link href={`/v3/tools/${slug}`} className={`inline-flex min-h-11 items-center justify-center gap-4 rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brandDeep ${focus}`}>{children}<Arrow className="h-4 w-4" /></Link>
}

function GuideLink({ slug, title }: { slug: string; title: string }) {
  return <Link href={`/v3/academy/guides/${slug}`} className={`group flex min-h-12 items-center justify-between gap-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-subtle hover:text-highlight ${focus}`}><span><span className="mr-2 text-body">Worked guide</span>{title}</span><Arrow className="h-4 w-4" /></Link>
}

function Inputs({ children }: { children: React.ReactNode }) {
  return <div className="mt-5 border-t border-white/10 pt-4"><p className={inputsLabel}>Bring these numbers</p><p className="mt-2 text-xs leading-[1.8] text-subtle">{children}</p></div>
}

/** Static decision aid: all destinations and specimen values are present without JavaScript. */
export default function V3ToolsIndex() {
  const tools = previewTools()
  const guides = allGuides()
  const guideTitle = (slug: string) => guides.find(item => item.slug === slug)!.guide.article.title
  const hosting = tools.find(tool => tool.slug === 'hosting-effective-rate')!
  const exposure = tools.find(tool => tool.slug === 'difficulty-exposure')!
  const payback = tools.find(tool => tool.slug === 'fleet-payback')!
  const tutorial = getExposureTutorial()
  const { inputs: exampleInputs, example } = tutorial
  const hostingSample = { rate: .065, management: 5, powerFactor: 3, downtime: 4, curtailment: 6, pool: 2 }
  const billed = hostingSample.rate * (1 + (hostingSample.management + hostingSample.powerFactor) / 100)
  const productive = billed / (1 - (hostingSample.downtime + hostingSample.curtailment) / 100)
  const effective = productive / (1 - hostingSample.pool / 100)

  return <Container className="pb-14 pt-7 sm:pb-20 sm:pt-10">
    <header className="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-14">
      <div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-highlight">Doefin / Mining calculators</p><h1 className="mt-3 max-w-2xl text-balance text-[34px] font-extrabold leading-[1.12] tracking-[-0.04em] sm:text-[50px]">Work through the numbers.</h1></div>
      <p className="max-w-lg text-[15px] leading-[1.8] text-subtle">Compare a hosting quote, size a production change or test when a fleet could recover its cost.</p>
    </header>

    <nav aria-label="Choose a mining calculator" className="mb-7 mt-6 grid gap-0 divide-y divide-white/10 border-y border-white/10 sm:mb-9 sm:mt-8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {choices.map(choice => <Link key={choice.slug} href={`/v3/tools/${choice.slug}`} className={`group flex items-center justify-between gap-4 py-3.5 sm:items-start sm:px-5 sm:py-5 sm:first:pl-0 sm:last:pr-0 ${focus}`}>
        <div><p className="text-[13px] font-bold text-body group-hover:text-highlight"><span className="tabular mr-2.5 text-[10px] text-subtle">{choice.number}</span>{choice.name}</p><p className="mt-1.5 text-[11px] text-subtle">{choice.output}</p></div><Arrow className="mt-0.5 h-4 w-4 text-highlight transition-transform group-hover:translate-x-1" />
      </Link>)}
    </nav>

    <section aria-labelledby="hosting-title" className="overflow-hidden rounded-panel border border-brand/25 bg-gradient-to-br from-active/35 via-surfaceAlt/40 to-surface/35">
      <div className="grid lg:grid-cols-[1fr_1.08fr]">
        <div className="p-5 sm:p-7 lg:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-highlight"><span className="tabular mr-3 text-subtle">01</span>Operating cost</p>
          <h2 id="hosting-title" className="mt-4 max-w-md text-balance text-[26px] font-extrabold leading-tight tracking-[-0.035em] sm:text-[32px]">What does this hosting quote really cost?</h2>
          <p className="mt-3 max-w-md text-sm leading-[1.8] text-subtle">{hosting.description}</p>
          <div className="mt-5"><StartLink slug={hosting.slug}>Compare hosting costs</StartLink></div>
          <Inputs>Advertised rate · management and power-factor charges · downtime · curtailment · pool fee</Inputs>
          <p className="mt-3 text-xs leading-[1.8] text-subtle"><strong className="font-semibold text-body">You get</strong> an effective rate per productive kWh and a saved-quote comparison.</p>
        </div>

        <figure className="m-4 mt-0 flex min-w-0 flex-col rounded-2xl border border-white/10 bg-ink/55 p-5 sm:m-6 sm:mt-0 sm:p-6 lg:my-6 lg:ml-0">
          <figcaption className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-semibold text-body">From quote to effective rate</span><span className={sampleLabel}>Illustrative sample</span></figcaption>
          <div className="my-6 grid min-w-0 grid-cols-[1fr_auto_1fr] items-start gap-2 sm:gap-4">
            <div className="min-w-0"><p className="mb-2 text-[11px] text-subtle">Advertised</p><p className="tabular whitespace-nowrap text-[22px] font-extrabold leading-none tracking-[-0.045em] min-[380px]:text-[28px] sm:text-[36px]">${hostingSample.rate.toFixed(3)}</p><p className="mt-2 text-[11px] text-subtle">per kWh</p></div>
            <Arrow className="mt-7 h-4 w-4 text-subtle sm:mt-8 sm:h-5 sm:w-5" />
            <div className="min-w-0"><p className="mb-2 text-[11px] text-highlight">Effective</p><p className="tabular whitespace-nowrap text-[22px] font-extrabold leading-none tracking-[-0.045em] text-highlight min-[380px]:text-[28px] sm:text-[36px]">${effective.toFixed(4)}</p><p className="mt-2 text-[11px] text-subtle">per productive kWh</p></div>
          </div>
          <dl className="divide-y divide-white/[0.07] border-y border-white/10 text-xs">
            <div className="flex items-baseline justify-between gap-3 py-3"><dt className="text-subtle">After billing charges <span className="tabular">(+8%)</span></dt><dd className="tabular shrink-0 font-semibold">${billed.toFixed(4)}</dd></div>
            <div className="flex items-baseline justify-between gap-3 py-3"><dt className="text-subtle">After lost hours <span className="tabular">(10%)</span></dt><dd className="tabular shrink-0 font-semibold">${productive.toFixed(4)}</dd></div>
            <div className="flex items-baseline justify-between gap-3 py-3"><dt className="text-subtle">After pool adjustment <span className="tabular">(2%)</span></dt><dd className="tabular shrink-0 font-semibold text-highlight">${effective.toFixed(4)}</dd></div>
          </dl>
          <p className="mt-4 text-[11px] leading-[1.8] text-subtle">Sample: <span className="tabular">5%</span> management + <span className="tabular">3%</span> power-factor charge; <span className="tabular">4%</span> downtime + <span className="tabular">6%</span> curtailment. Assumes power is paid during lost hours. Pool fee is a comparison equivalent, not an electricity charge.</p>
        </figure>
      </div>
      <div className="px-5 pb-5 sm:px-7 sm:pb-6 lg:px-8"><GuideLink slug={hosting.slug} title={guideTitle(hosting.slug)} /></div>
    </section>

    <div className="mt-5 grid items-stretch gap-5 lg:grid-cols-2">
      <section aria-labelledby="exposure-title" className="flex min-w-0 flex-col rounded-panel border border-white/10 bg-surface/35 p-5 sm:p-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-highlight"><span className="tabular mr-3 text-subtle">02</span>Production sensitivity</p>
        <h2 id="exposure-title" className="mt-4 max-w-md text-balance text-[26px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[28px]">What does a difficulty change mean for your BTC?</h2>
        <p className="mt-3 text-sm leading-[1.8] text-subtle">Hold your fleet and time window constant. Compare the BTC produced under two difficulty scenarios.</p>
        <div className="mt-5"><StartLink slug={exposure.slug}>Size difficulty exposure</StartLink></div>
        <Inputs>Fleet hashrate · time window · starting difficulty · scenario changes · fees and BTC price</Inputs>
        <p className="mt-3 text-xs leading-[1.8] text-subtle"><strong className="font-semibold text-body">You get</strong> production in each scenario and the BTC spread between them.</p>

        <figure className="mb-5 mt-6 rounded-xl border border-white/10 bg-ink/50 p-4 sm:p-5">
          <figcaption className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-semibold">Same fleet. Same time.</span><span className={sampleLabel}>Illustrative sample</span></figcaption>
          <div className="mt-5 space-y-4">
            {[{ label: 'Difficulty unchanged', value: example.base }, { label: `Difficulty +${exampleInputs.high}%`, value: example.atHigh }].map(row => <div key={row.label}><div className="mb-2 flex items-baseline justify-between gap-3"><p className="tabular text-[11px] text-subtle">{row.label}</p><p className="tabular text-sm font-bold">{row.value.toFixed(3)} <span className="text-[10px] font-medium text-subtle">BTC</span></p></div><div aria-hidden="true" className="h-2 rounded-full bg-active/50"><div className="h-2 rounded-full bg-chart" style={{ width: `${row.value / example.base * 100}%` }} /></div></div>)}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-subtle"><strong className="tabular font-bold text-body">{example.lossHigh.toFixed(3)} BTC less</strong> with the difficulty increase.</p>
          <p className="mt-3 border-t border-white/10 pt-3 text-[11px] leading-[1.8] text-subtle">Sample: <span className="tabular">{exampleInputs.eh} EH/s</span> over <span className="tabular">{exampleInputs.epochs}</span> target {exampleInputs.epochs === 1 ? 'epoch' : 'epochs'} (~<span className="tabular">{example.weeks}</span> weeks), starting at <span className="tabular">{exampleInputs.diffT} T</span>; <span className="tabular">{exampleInputs.fees} BTC</span> fees per block and fixed <span className="tabular">3.125 BTC</span> subsidy. Excludes uptime and pool fees. Figures rounded to three decimals.</p>
          <Link href={tutorial.calculatorHref} className={`mt-3 inline-flex min-h-10 items-center gap-3 text-xs font-bold text-highlight hover:underline ${focus}`}>Load this example<Arrow className="h-4 w-4" /></Link>
        </figure>
        <div className="mt-auto"><GuideLink slug={exposure.slug} title={guideTitle(exposure.slug)} /></div>
      </section>

      <section aria-labelledby="payback-title" className="flex min-w-0 flex-col rounded-panel border border-white/10 bg-surface/35 p-5 sm:p-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-highlight"><span className="tabular mr-3 text-subtle">03</span>Capital recovery</p>
        <h2 id="payback-title" className="mt-4 max-w-md text-balance text-[26px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[28px]">When could the fleet earn back its cost?</h2>
        <p className="mt-3 text-sm leading-[1.8] text-subtle">{payback.description}</p>
        <div className="mt-5"><StartLink slug={payback.slug}>Test fleet payback</StartLink></div>
        <Inputs>Fleet hashrate and efficiency · all-in power rate · upfront cost · BTC price · difficulty and horizon</Inputs>
        <p className="mt-3 text-xs leading-[1.8] text-subtle"><strong className="font-semibold text-body">You get</strong> a payback month, or no payback within your horizon, plus final cash across three difficulty paths.</p>

        <figure className="mb-5 mt-6 rounded-xl border border-white/10 bg-ink/50 p-4 sm:p-5">
          <figcaption className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-semibold">Follow the capital</span><span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-subtle">Model logic</span></figcaption>
          <ol className="relative mt-5 space-y-0">
            {[
              { label: 'Start with the outlay', text: 'The fleet begins below zero by its upfront cost.', sign: '−' },
              { label: 'Add revenue, subtract power', text: 'Repeat each month as difficulty changes.', sign: '±' },
              { label: 'Find the recovery point', text: 'Payback is the first month cumulative cash reaches zero.', sign: '=' },
            ].map((step, i) => <li key={step.label} className={`flex gap-3 ${i < 2 ? 'pb-4' : ''}`}><span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-active/35 text-base font-bold text-highlight">{step.sign}</span><div><p className="text-xs font-bold">{step.label}</p><p className="mt-1 text-[11px] leading-[1.7] text-subtle">{step.text}</p></div></li>)}
          </ol>
          <p className="mt-4 border-t border-white/10 pt-3 text-[11px] leading-[1.8] text-subtle">Compare lower, central and higher difficulty growth. BTC price and subsidy stay fixed; future halvings, downtime, tax and resale value are excluded. Simplified scenarios, not a return forecast.</p>
        </figure>
        <div className="mt-auto"><GuideLink slug={payback.slug} title={guideTitle(payback.slug)} /></div>
      </section>
    </div>

    <aside aria-labelledby="tools-note-title" className="mt-8 grid gap-5 border-y border-white/10 py-6 sm:mt-10 sm:grid-cols-[1fr_1fr] sm:gap-12 sm:py-7">
      <div><h2 id="tools-note-title" className="text-sm font-bold">Your assumptions. An inspectable result.</h2><p className="mt-2 max-w-xl text-xs leading-[1.9] text-subtle">Each calculator starts with illustrative inputs, not live data. Replace them with your own numbers; the page URL keeps the scenario so you can return to it or share it.</p></div>
      <div><p className="text-sm font-bold">Production and contract settlement are different.</p><p className="mt-2 text-xs leading-[1.9] text-subtle">A BTC production change is not a contract payout or an order size.</p><Link href="/v3/product/settlement" className={`mt-2 inline-flex min-h-10 items-center gap-3 text-xs font-semibold text-highlight hover:underline ${focus}`}>Read how settlement works<Arrow className="h-4 w-4" /></Link></div>
    </aside>
  </Container>
}
