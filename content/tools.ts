export type ToolExample = {
  slug: string
  toolSlug: string
  title: string
  /** Shorter title for the <title> tag; the headline figure moves to the description. */
  seoTitle: string
  summary: string
  headline: string
  /** Inputs that reproduce this educational scenario in the calculator. */
  calculatorInputs: Record<string, number>
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
      'Compare a stated power rate with management fees, power-factor adjustments and paid lost hours. The pool-fee adjustment is an equivalent comparison cost, not an electricity charge or a profit result.',
    status: 'live',
    faq: [
      {
        q: 'Why is my effective hosting rate higher than the advertised rate?',
        a: 'This model assumes booked capacity stays payable during lost hours. Under that assumption, fees and fewer productive hours raise the equivalent cost. Check whether your actual billing terms fit the model.',
      },
      {
        q: 'What is curtailment in Bitcoin mining?',
        a: 'Deliberately stopping mining, for example in response to power conditions. Billing treatment and compensation depend on the agreement; this model assumes the affected capacity remains payable and includes no curtailment income.',
      },
      {
        q: 'Can I verify my hosting provider’s uptime claims?',
        a: 'Compare your pool-side and site records with the contract’s definition and the relevant invoices. Use the same period, and establish whether downtime and curtailment overlap. The calculator does not verify provider claims.',
      },
    ],
  },
  {
    slug: 'difficulty-exposure',
    title: 'Difficulty exposure sizer',
    summary: 'What a difficulty move is worth to your fleet over a horizon you choose.',
    lede:
      'Size the exposure you already carry: how much expected BTC production a difficulty change costs you, under scenarios you choose rather than a forecast from this site.',
    status: 'preview',
    faq: [
      {
        q: 'How do I calculate my difficulty exposure?',
        a: 'Take your hashrate as a share of network hashrate, multiply by network issuance over the period you care about, then recompute at the two difficulty scenarios you choose. The gap between those two production figures is the exposure.',
      },
    ],
  },
  {
    slug: 'fleet-payback',
    title: 'Fleet payback model',
    summary: 'Payback under a range of difficulty paths rather than one fixed growth assumption.',
    lede:
      'Compare three assumed monthly difficulty-growth rates over a finite horizon. Results depend on the inputs and excluded costs.',
    status: 'preview',
    faq: [
      {
        q: 'Why do mining calculators get payback wrong?',
        a: 'A payback estimate changes when assumptions change. This simplified model compares three constant monthly difficulty-growth rates, holds the subsidy and price fixed, and excludes several real-world costs. It is not a forecast or complete investment valuation.',
      },
    ],
  },
]

export const EXAMPLES: ToolExample[] = [
  {
    slug: 'advertised-6-5-cents',
    toolSlug: 'hosting-effective-rate',
    seoTitle: 'Hosting at $0.065/kWh: the effective cost',
    title: 'An advertised $0.065/kWh contract',
    summary: 'Illustrative fees, 4% downtime and 6% curtailment.',
    headline: '$0.0796/kWh effective, 22% above advertised',
    calculatorInputs: { rate: 0.065, mgmt: 5, pf: 3, down: 4, curt: 6, pool: 2 },
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
      ['Equivalent pool-fee adjustment: divide by 0.98', '$0.0796'],
    ],
    body: [
      "Educational inputs, not a quoted offer. The model assumes booked capacity stays payable during lost hours. The $0.065 rate is multiplied by 1.08 for the two added fees, divided by 0.90 for productive hours and divided by 0.98 for an equivalent pool-fee adjustment.",
      "The result is $0.0796 per productive kWh, an uplift of approximately 22% over the sample advertised rate. This equivalent cost is not an electricity invoice, revenue, profit or contract payout.",
      "Compare another offer using the same treatment of paid hours, fees and tax. The calculator cannot verify a provider’s terms or performance."
],
  },
  {
    slug: 'high-curtailment',
    toolSlug: 'hosting-effective-rate',
    seoTitle: 'Cheap hosting with heavy curtailment',
    title: 'A cheap rate with heavy curtailment',
    summary: 'Advertised $0.045/kWh but 20% of hours curtailed.',
    headline: '$0.0653/kWh effective, 45% above advertised',
    calculatorInputs: { rate: 0.045, mgmt: 5, pf: 3, down: 4, curt: 20, pool: 2 },
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
      ['Equivalent pool-fee adjustment: divide by 0.98', '$0.0653'],
    ],
    body: [
      "Educational inputs, not a quoted offer. A $0.045 rate with 8% combined added fees gives $0.0486/kWh. With 4% downtime and 20% separate curtailment, the productive-hours fraction is 0.76.",
      "Dividing $0.0486 by 0.76 and then 0.98 gives an equivalent $0.0653 per productive kWh, approximately 45% above the sample rate. This assumes booked capacity stays payable during lost hours and represents pool fees as a comparison adjustment.",
      "Compare offers on absolute equivalent cost under the same billing assumptions. The percentage uplift alone cannot rank providers or establish profitability."
],
  },
  {
    slug: 'well-run-site',
    toolSlug: 'hosting-effective-rate',
    seoTitle: 'Hosting at a well-run site: the effective cost',
    title: 'A well-run site',
    summary: 'Higher advertised rate, minimal downtime, no curtailment.',
    headline: '$0.0832/kWh effective, 7% above advertised',
    calculatorInputs: { rate: 0.078, mgmt: 3, pf: 0, down: 1.5, curt: 0, pool: 2 },
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
      ['Equivalent pool-fee adjustment: divide by 0.98', '$0.0832'],
    ],
    body: [
      "Educational inputs, not a provider assessment. The formula is $0.078 × 1.03 ÷ 0.985 ÷ 0.98 = $0.083228/kWh. It assumes booked capacity stays payable during lost hours and converts pool fees into an equivalent cost adjustment.",
      "The result displays as $0.0832/kWh, approximately 7% above the illustrative starting rate. It is the highest absolute effective rate among these three samples despite having the smallest percentage uplift.",
      "“Well-run” describes the low lost-hours assumptions in this sample. It is not evidence about a real provider’s quality, profitability or contract performance."
],
  },
]


EXAMPLES.push(
  {
    slug: 'one-exahash-four-epochs',
    toolSlug: 'difficulty-exposure',
    seoTitle: '1 EH/s over four epochs: difficulty exposure',
    title: 'One exahash over four epochs',
    summary: 'An illustrative fleet compared under two constant-difficulty scenarios.',
    headline: '2.525 BTC between the two scenarios',
    calculatorInputs: { eh: 1, epochs: 4, diffT: 127.48, low: -2.4, high: 7, fees: 0.05, price: 64000 },
    inputs: [
      ['Fleet hashrate', '1.00 EH/s'],
      ['Horizon', '4 epochs · about 8 weeks'],
      ['Illustrative starting difficulty', '127.48T'],
      ['Illustrative difficulty scenarios', '−2.4% and +7.0%'],
      ['Assumed transaction fees', '0.05 BTC / block'],
      ['Fixed subsidy', '3.125 BTC / block'],
      ['USD conversion assumption', '$64,000 / BTC'],
    ],
    steps: [
      ['Implied target-interval network hashrate', '912.537 EH/s'],
      ['Production at unchanged starting difficulty', '28.057 BTC'],
      ['If difficulty is 2.4% lower throughout', '28.747 BTC'],
      ['If difficulty is 7.0% higher throughout', '26.222 BTC'],
      ['Spread between the two scenarios', '2.525 BTC'],
      ['Harder scenario vs unchanged baseline', '−1.836 BTC'],
    ],
    body: [
      'At the sample baseline, 1 EH/s is expected to produce 28.057 BTC over four modelled epochs. Applying each scenario difficulty throughout the whole horizon gives 28.747 BTC at −2.4% and 26.222 BTC at +7.0%. These are sensitivity assumptions, not a forecast or a confidence interval.',
      'The 2.525 BTC spread includes both the gain in the easier case and the reduction in the harder case. The harder case gives 1.836 BTC less expected production than the unchanged baseline. The calculator excludes operating costs and pool fees, so neither number is a net-profit or cash-flow result.',
      'A binary difficulty contract observes difficulty at a specified block and has a separate fixed payout, position cost and trading fees. You can lose the full amount paid for a position. This production example supplies no executable price, position size or conclusion about whether a hedge would cover its costs at any fleet size.',
    ],
  },
  {
    slug: 'static-versus-range',
    toolSlug: 'fleet-payback',
    seoTitle: 'What a static difficulty assumption costs',
    title: 'A static assumption versus a range',
    summary: '1,000 TH/s at $20k outlay, run at three difficulty growth rates.',
    headline: '24 months, 38 months or no payback within 48 months',
    calculatorInputs: { th: 1000, jPerTh: 15, power: 0.045, capex: 20000, price: 90000, diffT: 127.48, growth: 1.5, months: 48 },
    inputs: [
      ['Fleet hashrate', '1,000 TH/s, about five modern machines'],
      ['Efficiency', '15 J/TH'],
      ['All-in power', '$0.045 / kWh'],
      ['Capital outlay', '$20,000'],
      ['Bitcoin price', '$90,000'],
      ['Illustrative starting difficulty', '127.48T'],
      ['Fixed subsidy', '3.125 BTC / block'],
      ['Horizon', '48 modelled months · 30.4 days per month'],
    ],
    steps: [
      ['Power cost per day', '$16.20'],
      ['At 0% monthly difficulty growth', '24 months'],
      ['At 1.5% monthly growth (central)', '38 months'],
      ['At 4.5% monthly growth', 'beyond 48 months'],
      ['Cash position at 48 months, 4.5% growth', '−$17,282'],
    ],
    body: [
      'Using these illustrative inputs, the model first reaches non-negative cumulative cash flow at month 24 with 0% monthly difficulty growth and month 38 with 1.5% growth. At 4.5%, it has not reached payback by month 48 and ends approximately $17,282 short of recovering the initial outlay. The finite horizon cannot establish that payback will never occur.',
      'The model starts difficulty growth in month one, uses 30.4 days per month and holds BTC price, hashrate, efficiency, power rate and the 3.125 BTC subsidy constant. It does not model a subsidy halving, transaction fees, pool fees, downtime, tax, financing, resale value or a contract position. Actual costs and production can differ materially.',
      'These three paths are assumptions for comparison, not predictions, investment ratings or proof of a hedge’s economics. A difficulty contract observes difficulty at a specified block. Assess its payout, position cost and fees separately. You can lose the full amount paid for a position.',
    ],
  },
)

export const examplesFor = (toolSlug: string) => EXAMPLES.filter((e) => e.toolSlug === toolSlug)
