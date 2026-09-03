/**
 * In-product microcopy for the calculators.
 *
 * The long version of all of this lives in content/tool-guides.ts and is published
 * as an article at /academy/guides/<slug>. What sits on the tool page itself is
 * deliberately tiny: a reader who has opened a calculator wants to use it, not read
 * an essay. Anything here that runs long has failed at its job.
 *
 * Every `label` must match a Slider label in components/tools/ verbatim, and every
 * `figure` a results-panel row — scripts/check-tools.mjs fails the build otherwise,
 * because a hint attached to nothing is worse than no hint. That script also enforces
 * the word caps, which is what stops this file growing back into the essay.
 */

export type ToolMicro = {
  /** One short paragraph under the page title. */
  blurb: string
  /** Two chips, rendered as "Use this if <useIf>" / "Not this if <notFor>". */
  useIf: string
  notFor: string
  /** Numbered strip above the calculator. Three or four short imperatives. */
  steps: string[]
  inputHints: { label: string; means: string; whereToFind: string; typical: string }[]
  resultHints: { figure: string; hint: string }[]
  /** Named scenarios wired to the sliders. */
  presets: { name: string; note: string; values: Record<string, number> }[]
  /** Collapsed "Before you rely on this" block. */
  watchOut: string[]
}

export const TOOL_MICRO: Record<string, ToolMicro> = {
  "hosting-effective-rate": {
    blurb: "What you really pay for each kWh that earns bitcoin, after fees and idle hours.",
    useIf: "someone else runs your machines, you pay per kWh, comparing quotes or renewing",
    notFor: "your own site; a host that takes a cut of your bitcoin; bought hashrate",
    steps: [
      "Get your contract and twelve months of invoices.",
      "Enter your rate in $/kWh, then both fees.",
      "Set lost hours from your pool records. Read the top number.",
      "Copy the link; it holds your contract terms. Rerun contract two.",
    ],
    inputHints: [
      { label: "Advertised power rate",
        means: "The headline price per kWh in your contract. Every other slider is an adjustment to it.",
        whereToFind: "Pricing schedule, page one or two. Divide last month's power dollars by that invoice's kWh. Both quotes with tax, or neither.",
        typical: "$0.045–$0.085/kWh; under $0.040 usually means switch-offs; flat deals higher." },
      { label: "Management fee",
        means: "What the host charges to run the machines, as a percentage of your power bill.",
        whereToFind: "Fees clause, or invoice line: management, service, O&M. No line? 0%. Dollars? Divide by the machine's full-power kWh per month.",
        typical: "3% to 10% of the power bill." },
      { label: "Power factor extra (if billed on kVA)",
        means: "Some hosts bill the power the site pulls from the grid, not what your machines use. This covers the gap.",
        whereToFind: "Ask your site manager: am I billed on kW or kVA? If kW, put 0%.",
        typical: "0% to 5%. Plenty of contracts have none." },
      { label: "Unplanned downtime",
        means: "The share of hours your machines stopped because something broke, not because anyone chose.",
        whereToFind: "Pool worker history, not the host's. Zero-hashrate hours ÷ 2,160 for 90 days. No machines yet? Use host figures, add half.",
        typical: "1% to 5% of hours at a well-run site." },
      { label: "Curtailment",
        means: "The share of hours the host switched your machines off on purpose. Added straight onto downtime.",
        whereToFind: "Ask for last year's switched-off hours at your building. There are 8,760 hours in a year, so 876 hours is 10%.",
        typical: "0% with no grid deal; 5–15% with one; 20%+ happens." },
      { label: "Pool fee",
        means: "Your pool's cut of what you earn. The tool charges it on cost, so it is close, not exact.",
        whereToFind: "Your pool's fee page or dashboard. Set it the same for both contracts; then it cannot change which host wins.",
        typical: "0% to 4% of what you earn; 2% is common." },
    ],
    resultHints: [
      { figure: "After fees",
        hint: "The advertised rate plus the management fee and power factor extra. If most of the jump is here, push on fees." },
      { figure: "Effective uptime",
        hint: "100% minus your two lost-hours sliders. If your host advertises better, ask why before you renew." },
      { figure: "After lost hours",
        hint: "The after-fees cost spread over only the hours you hashed. Whichever jump is bigger, fees or lost hours, is what to negotiate." },
      { figure: "% above the advertised rate",
        hint: "Your bad-surprise score. Under about 10% the quote is roughly honest; over about 40%, read the curtailment clause." },
    ],
    presets: [
      { name: "Cheap rate, heavy curtailment",
        note: "$0.055/kWh, a 10% management fee, and a quarter of the year switched off.",
        values: {"rate":0.055,"mgmt":10,"pf":3,"down":5,"curt":25,"pool":2} },
      { name: "Higher rate, steady site",
        note: "$0.070/kWh, no switch-off deal, billed on kW. The higher quote that wins.",
        values: {"rate":0.07,"mgmt":3,"pf":0,"down":2,"curt":0,"pool":2} },
      { name: "Flat per-machine deal",
        note: "$256 a month per 3.5 kW machine, all-in: fees already inside.",
        values: {"rate":0.1,"mgmt":0,"pf":0,"down":3,"curt":0,"pool":2} },
    ],
    watchOut: [
      "Ask if the host's uptime already includes switched-off hours. If it does, leave curtailment at 0%. If not, add them. Never double-count.",
      "Use the switched-off hours that actually happened, not the contract's cap. Ask for twelve months, building by building; it swings by season.",
      "A cost, not a profit: no bitcoin price, efficiency or difficulty here, and no deposits, insurance, freight, repairs, spares or hardware.",
      "This assumes you pay for the power you booked, even when idle. If your host doesn't bill switched-off hours, put 0%.",
    ],
  },
  "difficulty-exposure": {
    blurb: "When mining gets harder, the same machines earn less bitcoin. This puts a bitcoin figure on that, for the weeks you pick. Costs are not in it.",
    useIf: "you run 0.2 EH/s or more — about 1,000 machines — and sell the bitcoin",
    notFor: "under 1,000 machines; hosting others per kWh; hashrate or bitcoin already sold",
    steps: [
      "Enter your pool's 7-day average hashrate, in EH/s.",
      "Pick how many weeks of bills you need covering.",
      "Set the two difficulty sliders to your real best and worst.",
      "Read \"Worst case vs today\". That is the money figure.",
    ],
    inputHints: [
      { label: "Hashrate",
        means: "How fast your machines run, in EH/s. One EH/s is 1,000,000 TH/s, about 5,000 machines.",
        whereToFind: "Your pool dashboard, the 7-day average — not the sticker rating. Knock off hours you know you will be down.",
        typical: "0.80 EH/s is roughly a 15 MW site." },
      { label: "How far ahead",
        means: "How many weeks ahead you are looking. Difficulty only changes every two weeks.",
        whereToFind: "Nowhere — you choose. Use bills you are committed to: hosting invoices, a loan payment, your power contract ending.",
        typical: "8 weeks (4 periods). Round up past your bill date." },
      { label: "Expected fees",
        means: "Extra fees a block pays you, on top of the fixed 3.125 BTC reward.",
        whereToFind: "Your pool's payout breakdown lists fees separately, or check mempool.space. Take a month's average, not one busy day.",
        typical: "0.05 BTC per block. Close enough is fine." },
      { label: "Bitcoin price",
        means: "Only used to show one dollar figure. It changes no BTC number on this page.",
        whereToFind: "Any exchange. Set it below today's price — when difficulty climbs hardest, the price is often weak too.",
        typical: "$20,000 to $200,000, in $1,000 steps." },
      { label: "Best case: difficulty falls by",
        means: "The biggest fall in difficulty you think could really happen. Lower difficulty, more bitcoin.",
        whereToFind: "The difficulty forecast at /data/difficulty, or a block explorer. Further out, use the last dozen changes.",
        typical: "2.4% over two weeks. The slider stops at 0%." },
      { label: "Worst case: difficulty rises by",
        means: "The biggest rise in difficulty you think could really happen. This is the case that costs you bitcoin.",
        whereToFind: "Same places. Take the biggest rise of the past year. Rises stack: three of 3% make about 9%.",
        typical: "7.0% for two weeks. Widen it for longer views." },
    ],
    resultHints: [
      { figure: "Best case vs worst case",
        hint: "The gap between your good case and your bad case. Not a loss — a range." },
      { figure: "Worst case vs today",
        hint: "The hole in your cash if difficulty rises. Against your bills for those weeks: under 5%, carry on; over 20%, price cover." },
      { figure: "Production at current difficulty",
        hint: "What you mine if difficulty never moves. Take off 2% pool fee, then 1–3% downtime. Still 5% above your payouts? Your hashrate is wrong." },
      { figure: "Network hashrate",
        hint: "Every miner on earth, in EH/s — taken from the fixed difficulty, not measured. Divide your hashrate by it: 1 EH/s is about 0.11%." },
    ],
    presets: [
      { name: "Entry fleet",
        note: "1,000 machines, one difficulty change — the smallest move worth measuring.",
        values: {"eh":0.2,"epochs":1,"diffT":127.48,"low":-1,"high":3,"fees":0.05,"price":60000} },
      { name: "15 MW site",
        note: "4,000 machines, eight weeks of hosting invoices.",
        values: {"eh":0.8,"epochs":4,"diffT":127.48,"low":-4,"high":12,"fees":0.05,"price":64000} },
      { name: "Big fleet, six months",
        note: "5 EH/s, 26 weeks. +15% is the slider's ceiling. Six months may need more.",
        values: {"eh":5,"epochs":13,"diffT":127.48,"low":-5,"high":15,"fees":0.05,"price":64000} },
    ],
    watchOut: [
      "The big number at the top is not your loss. It is a range. Use \"Worst case vs today\" instead.",
      "The -2.4% and +7.0% defaults cover two weeks only. Look further ahead and widen the sliders — the worst case stops at +15%.",
      "The tool jumps to your worst case on day one. Difficulty climbs in steps, so the real figure is about two-thirds of this.",
      "Difficulty is fixed at 127.48 T, not live. If real difficulty is higher, you mine less than shown. Override with ?diffT= in the address.",
    ],
  },
  "fleet-payback": {
    blurb: "Your machines cost money and burn power. This shows how many months until they earn that back. Three guesses at how fast mining gets harder.",
    useIf: "you own or are buying the machines, and pay the power bill.",
    notFor: "you rent hashrate, own paid-off machines, or earn from heat, curtailment or demand response.",
    steps: [
      "Check difficulty on mempool.space; replace the made-up default with ?diffT=140.",
      "Put in your hashrate, efficiency, real $/kWh and what you paid.",
      "Set today's bitcoin price. Guess growth: 1.5% per month if unsure.",
      "Read all three rows. Ask if you survive the worst one.",
    ],
    inputHints: [
      { label: "Fleet hashrate",
        means: "How much work your machines do in total, in TH/s.",
        whereToFind: "Pool dashboard, 30-day average: downtime is already in it, so don't discount again. Not bought? Spec sheets minus a few percent.",
        typical: "One modern machine is 200–250 TH/s; slider runs 100–20,000 TH/s." },
      { label: "Efficiency",
        means: "Electricity a machine uses per unit of work, in J/TH. Lower is better. It sets your whole power bill.",
        whereToFind: "Spec sheet, wall watts not chip-only: 3,250 W at 200 TH/s is 16.25 J/TH. Mixed fleet: total watts over total TH/s.",
        typical: "Today's machines 12–20 J/TH; a 2021 S19 30–34 J/TH." },
      { label: "All-in power cost",
        means: "What one kWh really costs you, everything counted.",
        whereToFind: "Divide one month's full bill by the kWh you burned mining. Hosted: add fees and downtime, never the advertised rate.",
        typical: "$0.03–$0.05/kWh industrial, $0.06–$0.09 hosted, $0.15 and up at home." },
      { label: "What you paid up front",
        means: "Everything spent before the first hash: machines, freight, duty, racks, the electrician.",
        whereToFind: "Your invoices, added up. Nothing monthly: hosting fees go in power cost. Already running? Subtract what the fleet earned after power.",
        typical: "New machines $15–$25 per TH/s, so 1,000 TH/s is $15,000–$25,000." },
      { label: "Bitcoin price",
        means: "The price used to value every coin mined. In this tool it stays flat for 48 months.",
        whereToFind: "Any exchange, today's price. Try low and high: $70,000 never pays back, $110,000 pays back in 23 months.",
        typical: "Slider runs $20,000–$200,000; the $90,000 default is made up." },
      { label: "Difficulty growth guess",
        means: "How fast you think mining gets harder each month. Each month's rise stacks on the last.",
        whereToFind: "It is a guess. Compare last year's difficulty with today's: 20% a year is 1.5% a month.",
        typical: "1% to 3% per month covers most recent stretches." },
    ],
    resultHints: [
      { figure: "Payback",
        hint: "The month your machines finish earning back what you paid, after power. It uses your growth guess — the middle row." },
      { figure: "Monthly difficulty growth",
        hint: "Your guess, two percentage points lower, three higher. You don't control that gap. Under 2% the low row sticks at 0% and flatters." },
      { figure: "Cash after 48 months",
        hint: "Cash in hand after four years, minus what you paid. Ask if you could survive the worst row." },
      { figure: "Power cost per day",
        hint: "What the fleet burns in electricity daily. If daily earnings ever fall below it, you are paying to mine and payback means nothing." },
    ],
    presets: [
      { name: "Cheap industrial power",
        note: "Five 200 TH/s machines, $15,000 up front, $0.035/kWh on your own site.",
        values: {"th":1000,"jPerTh":12.5,"power":0.035,"capex":15000,"price":90000,"growth":1.5} },
      { name: "Hosted, advertised rate",
        note: "Six 200 TH/s machines, $18,000, at the contract's $0.065/kWh, not what you pay.",
        values: {"th":1200,"jPerTh":12.5,"power":0.065,"capex":18000,"price":90000,"growth":1.5} },
      { name: "Hosted, rate you pay",
        note: "Same six machines at $0.078/kWh: the contract rate plus 20% fees and downtime.",
        values: {"th":1200,"jPerTh":12.5,"power":0.078,"capex":18000,"price":90000,"growth":1.5} },
    ],
    watchOut: [
      "No halving in it. The reward halves around spring 2028 — that alone moves the default fleet from 38 months to never.",
      "Fleet hashrate and what you paid move on their own. The tool will report 20,000 TH/s for $20,000, paying back in 2 months.",
      "'Beyond 48 months' can mean never, not 'a bit late'. Check Cash after 48 months: far below zero means never.",
      "All-in power cost is the only running cost here. Add pool fees, rent and repairs into it yourself. No tax anywhere.",
    ],
  },
}

export const microFor = (slug: string): ToolMicro | undefined => TOOL_MICRO[slug]

export const hintFor = (slug: string, label: string) =>
  TOOL_MICRO[slug]?.inputHints.find((h) => h.label === label)

export const resultHintFor = (slug: string, figure: string) =>
  TOOL_MICRO[slug]?.resultHints.find((h) => h.figure === figure)?.hint

export const presetsFor = (slug: string) => TOOL_MICRO[slug]?.presets ?? []
