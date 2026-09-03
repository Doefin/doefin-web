export type ToolExample = {
  slug: string
  toolSlug: string
  title: string
  /** Shorter title for the <title> tag; the headline figure moves to the description. */
  seoTitle: string
  summary: string
  headline: string
  inputs: [string, string][]
  steps: [string, string][]
  body: string[]
}

export type Tool = {
  slug: string
  title: string
  summary: string
  lede: string
  status: 'live' | 'preview'
  faq: { q: string; a: string }[]
}

export const TOOLS: Tool[] = [
  {
    slug: 'hosting-effective-rate',
    title: 'Hosting effective-rate calculator',
    summary:
      'What your advertised price per kilowatt-hour actually costs once fees, downtime and curtailment are counted.',
    lede:
      'The advertised power price is rarely the price you pay. Management fees, power-factor charges, unplanned downtime, curtailment and pool fees all sit between the quoted rate and the number that lands in your wallet.',
    status: 'live',
    faq: [
      {
        q: 'Why is my effective hosting rate higher than the advertised rate?',
        a: 'Because you are typically billed for contracted capacity whether or not the machines run, while you only earn while they do. Every hour lost to downtime or curtailment raises the cost of the hours that remain, on top of management fees and any power-factor uplift.',
      },
      {
        q: 'What is curtailment in Bitcoin mining?',
        a: 'Deliberately switching machines off, usually because power is expensive at that moment or the grid needs the capacity back. It reduces revenue, and under most contracts it does not proportionally reduce what you are billed.',
      },
      {
        q: 'Can I verify my hosting provider’s uptime claims?',
        a: 'Generally not independently. Providers advertise uptime targets that operators cannot audit, and the gap between advertised and realised uptime is one of the most common sources of dispute in hosting contracts. Track your own pool-side hashrate and compare.',
      },
    ],
  },
  {
    slug: 'difficulty-exposure',
    title: 'Difficulty exposure sizer',
    summary: 'What a difficulty move is worth to your fleet over a horizon you choose.',
    lede:
      'Size the exposure you already carry: how much bitcoin production a difficulty move costs you, across the current forecast interval rather than a single point estimate.',
    status: 'preview',
    faq: [
      {
        q: 'How do I calculate my difficulty exposure?',
        a: 'Take your hashrate as a share of network hashrate, multiply by network issuance over the period you care about, then recompute at the top and bottom of the current forecast interval. The gap between those two production figures is the exposure.',
      },
    ],
  },
  {
    slug: 'fleet-payback',
    title: 'Fleet payback model',
    summary: 'Payback under a range of difficulty paths rather than one fixed growth assumption.',
    lede:
      'Most return calculators assume difficulty grows at a fixed rate forever. This one runs a range and shows what the assumption is costing you.',
    status: 'preview',
    faq: [
      {
        q: 'Why do mining calculators get payback wrong?',
        a: 'Most either ignore difficulty growth or hard-code a fixed monthly rate. A fixed rate is a guess that happened to fit some past window, and over a two-year payback horizon a small error in it moves the payback date by months.',
      },
    ],
  },
]

export const EXAMPLES: ToolExample[] = [
  {
    slug: 'advertised-6-5-cents',
    toolSlug: 'hosting-effective-rate',
    seoTitle: 'Hosting at $0.065/kWh — the real cost',
    title: 'An advertised $0.065/kWh contract',
    summary: 'Typical fees, 4% downtime and 6% curtailment.',
    headline: '$0.0796/kWh effective — 22% above advertised',
    inputs: [
      ['Advertised power rate', '$0.065 / kWh'],
      ['Management fee', '5% of power'],
      ['Power factor uplift', '3%'],
      ['Unplanned downtime', '4% of hours'],
      ['Curtailment', '6% of hours'],
      ['Pool fee', '2% of revenue'],
    ],
    steps: [
      ['Advertised rate', '$0.0650'],
      ['Plus management fee and power-factor uplift (8%)', '$0.0702'],
      ['Effective uptime after 10% lost hours', '90.0%'],
      ['Cost per productive kWh', '$0.0780'],
      ['After a 2% pool fee on revenue', '$0.0796'],
    ],
    body: [
      'An advertised rate of $0.065 per kilowatt-hour ends up costing $0.0796 per productive kilowatt-hour once fees and lost hours are counted — roughly 22% above the headline figure.',
      'The largest single contributor is not the management fee. It is the ten percent of hours the machines are not earning, because under most contracts capacity is billed regardless. Downtime and curtailment do not reduce the bill proportionally; they raise the cost of every hour that remains.',
      'This is why comparing hosting providers on advertised rate alone is misleading. A provider quoting $0.070 with genuinely higher uptime can be cheaper than one quoting $0.065 with aggressive curtailment terms.',
    ],
  },
  {
    slug: 'high-curtailment',
    toolSlug: 'hosting-effective-rate',
    seoTitle: 'Cheap hosting with heavy curtailment',
    title: 'A cheap rate with heavy curtailment',
    summary: 'Advertised $0.045/kWh but 20% of hours curtailed.',
    headline: '$0.0653/kWh effective — 45% above advertised',
    inputs: [
      ['Advertised power rate', '$0.045 / kWh'],
      ['Management fee', '5% of power'],
      ['Power factor uplift', '3%'],
      ['Unplanned downtime', '4% of hours'],
      ['Curtailment', '20% of hours'],
      ['Pool fee', '2% of revenue'],
    ],
    steps: [
      ['Advertised rate', '$0.0450'],
      ['Plus fees (8%)', '$0.0486'],
      ['Effective uptime after 24% lost hours', '76.0%'],
      ['Cost per productive kWh', '$0.0639'],
      ['After a 2% pool fee', '$0.0653'],
    ],
    body: [
      'A headline rate of $0.045 per kilowatt-hour looks like a substantial saving until curtailment is counted. At twenty percent curtailed hours, the effective cost reaches $0.0653 — 45% above the advertised figure. That is more than the $0.065 the pricier contract merely advertises, and it wipes out most of the apparent saving.',
      'Curtailment terms are among the least visible line items in a hosting agreement, and among the largest determinants of what a quoted price actually costs. A contract that permits unlimited curtailment at the host’s discretion is a different product from one that caps it.',
      'Ask for the curtailment history of the specific site, not the contractual maximum. The two are frequently far apart in both directions.',
    ],
  },
  {
    slug: 'well-run-site',
    toolSlug: 'hosting-effective-rate',
    seoTitle: 'Hosting at a well-run site — the real cost',
    title: 'A well-run site',
    summary: 'Higher advertised rate, minimal downtime, no curtailment.',
    headline: '$0.0832/kWh effective — 7% above advertised',
    inputs: [
      ['Advertised power rate', '$0.078 / kWh'],
      ['Management fee', '3% of power'],
      ['Power factor uplift', '0%'],
      ['Unplanned downtime', '1.5% of hours'],
      ['Curtailment', '0% of hours'],
      ['Pool fee', '2% of revenue'],
    ],
    steps: [
      ['Advertised rate', '$0.0780'],
      ['Plus management fee (3%)', '$0.0803'],
      ['Effective uptime', '98.5%'],
      ['Cost per productive kWh', '$0.0816'],
      ['After a 2% pool fee', '$0.0832'],
    ],
    body: [
      'The most expensive advertised rate in these three examples produces the smallest gap between headline and reality — 7% rather than 22% or 45%.',
      'That is the point of running the calculation. The gap between headline and reality is not the same size for every contract — 7% here against 45% at the cheap, heavily curtailed site. That gap, not the advertised rate, is what a comparison has to be made on; raise curtailment at the cheap site much further and it stops being the cheap site at all.',
    ],
  },
]


EXAMPLES.push(
  {
    slug: 'one-exahash-four-epochs',
    toolSlug: 'difficulty-exposure',
    seoTitle: '1 EH/s over four epochs — difficulty exposure',
    title: 'One exahash over four epochs',
    summary: 'A mid-size operator across the current forecast interval.',
    headline: '2.53 BTC across the interval',
    inputs: [
      ['Fleet hashrate', '1.00 EH/s'],
      ['Horizon', '4 epochs · about 8 weeks'],
      ['Current difficulty', '127.48 T'],
      ['Forecast interval', '−2.4% to +7.0%'],
      ['Expected fees', '0.05 BTC / block'],
    ],
    steps: [
      ['Implied network hashrate', '913 EH/s'],
      ['Production at current difficulty', '28.06 BTC'],
      ['If difficulty falls 2.4%', '28.75 BTC'],
      ['If difficulty rises 7.0%', '26.22 BTC'],
      ['Spread across the interval', '2.53 BTC'],
    ],
    body: [
      'A one-exahash operator produces roughly 28 BTC over four epochs at current difficulty. Across the current forecast interval that figure ranges from 26.2 to 28.8 BTC — a spread of about 2.5 BTC, or roughly 9% of production.',
      'That spread, not the point forecast, is what a hedge is priced against. A contract sized to the top of the interval covers the case that actually hurts.',
      'Scale matters here more than anything else on the page. The same calculation at 10 PH/s produces a spread of about 0.025 BTC — a few hundred dollars, and below the size at which any hedge covers its own costs.',
    ],
  },
  {
    slug: 'static-versus-range',
    toolSlug: 'fleet-payback',
    seoTitle: 'What a static difficulty assumption costs',
    title: 'A static assumption versus a range',
    summary: '1,000 TH/s at $20k outlay, run at three difficulty growth rates.',
    headline: 'Payback moves from 24 months to never',
    inputs: [
      ['Fleet hashrate', '1,000 TH/s — about five modern machines'],
      ['Efficiency', '15 J/TH'],
      ['All-in power', '$0.045 / kWh'],
      ['Capital outlay', '$20,000'],
      ['Bitcoin price', '$90,000'],
    ],
    steps: [
      ['Power cost per day', '$16.20'],
      ['At 0% monthly difficulty growth', '24 months'],
      ['At 1.5% monthly growth (central)', '38 months'],
      ['At 4.5% monthly growth', 'beyond 48 months'],
      ['Position at 48 months, 4.5% growth', '−$17,282'],
    ],
    body: [
      'The same fleet, the same outlay and the same bitcoin price produce payback at 24 months, at 38 months, or never — depending only on what difficulty does. Most return calculators pick one of those and present it as the answer.',
      'A fixed growth assumption is not a forecast. It is a rate that happened to fit some past window, applied to a future under no obligation to match it — and the error compounds over a payback horizon.',
      'The honest version shows the range. At the pessimistic end this fleet never returns its capital and finishes 48 months down $17,000 — the difference between a sound investment and a loss, turning entirely on a variable the operator does not control.',
      'That is the exposure a difficulty hedge addresses. It is also why the answer for a small operator is often that the exposure is real but too small to hedge economically; the arithmetic should say so rather than manufacture a reason to trade.',
    ],
  },
)

export const examplesFor = (toolSlug: string) => EXAMPLES.filter((e) => e.toolSlug === toolSlug)
