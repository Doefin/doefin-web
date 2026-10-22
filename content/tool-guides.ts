/**
 * Plain-language guides for the calculators.
 *
 * Written for someone who runs machines, not a trading desk: no term is used
 * before it is explained, and every input entry names where to find your
 * own number, because a calculator whose inputs you have to guess is a toy.
 *
 * Labels here must match the Slider labels in components/tools/ verbatim.
 */

export type ToolGuideContent = {
  /** Publishing metadata for the standalone long-form guide at /academy/guides/<slug>. */
  article: { title: string; seoTitle: string; summary: string; publishedAt: string }
  whatItIs: string
  whoFor: string
  howToUse: string[]
  inputs: { label: string; means: string; whereToFind: string; typical: string }[]
  readingResults: { figure: string; means: string; soWhat: string }[]
  walkthrough: { title: string; setup: string; steps: string[]; takeaway: string }
  mistakes: string[]
  limits: string[]
}

export const TOOL_GUIDES: Record<string, ToolGuideContent> = {
  "hosting-effective-rate": {
    "article": {
        "title": "What your hosting contract really costs",
        "seoTitle": "Hosting effective rate: compare stated assumptions",
        "summary": "Compare an advertised hosting rate with fees and paid lost hours. Check billing assumptions before comparing quotes.",
        "publishedAt": "2026-08-31"
    },
    "whatItIs": "A normalized cost comparison for hosting priced per kWh. It adds management and power-factor percentages to the advertised rate, divides by the share of productive hours, and divides by one minus the pool-fee fraction. The result is an equivalent cost per productive kWh, not an actual invoice or a profit calculation.",
    "whoFor": "For machine owners comparing hosting terms when booked power capacity remains payable during lost hours. A business that hosts other people’s machines may also use it for machines it owns. Energy-only billing, revenue-share contracts, demand-response income and unrelated hosting income require different models.",
    "howToUse": [
        "Check your agreement and invoices. Confirm which fees are already included in the advertised rate and whether lost hours remain payable.",
        "Enter advertised rate in $/kWh. Enter management and power-factor adjustments as percentages of that rate; do not enter a fee twice.",
        "Enter distinct downtime and curtailment hours as percentages of the same period. Do not count an hour in both. Use actual records or explicitly labeled assumptions.",
        "Enter the pool-fee percentage. The tool converts it to an equivalent cost adjustment; a pool’s charge on revenue is not an electricity charge.",
        "Compare all steps and the absolute final rates for two offers under consistent assumptions. A small percentage uplift can still produce a higher absolute cost.",
        "Copy the URL to retain the inputs. Anyone with that URL can read the terms you entered."
    ],
    "inputs": [
        {
            "label": "Advertised power rate",
            "means": "The starting price per kWh before the separate adjustments you enter.",
            "whereToFind": "Contract pricing schedule and invoices. Keep tax treatment consistent across comparisons.",
            "typical": "The slider supports $0–$0.20/kWh. The $0.065 default is a sample, not a market benchmark."
        },
        {
            "label": "Management fee",
            "means": "An added percentage of the advertised power rate.",
            "whereToFind": "The applicable contract fee clause. If this fee is already included, do not add it again.",
            "typical": "The sample is 5%; the supported range is 0–30%."
        },
        {
            "label": "Power factor extra (if billed on kVA)",
            "means": "A separate percentage adjustment to the advertised rate. It is added with management fees, not compounded.",
            "whereToFind": "Billing terms or a measured charge from your host. A technical power-factor specification alone may not describe your invoice.",
            "typical": "The sample is 3%; the supported range is 0–30%."
        },
        {
            "label": "Unplanned downtime",
            "means": "A share of the same measured period when machines were unavailable and booked capacity remained payable.",
            "whereToFind": "Pool or site records reconciled with billing. Exclude hours already counted as curtailment.",
            "typical": "The sample is 4%; the supported range is 0–30%."
        },
        {
            "label": "Curtailment",
            "means": "A separate share of deliberately stopped hours for which booked capacity remains payable.",
            "whereToFind": "Your agreement, invoices and site records. This model does not include curtailment credits or payments.",
            "typical": "The sample is 6%; the supported range is 0–30%."
        },
        {
            "label": "Pool fee",
            "means": "A revenue percentage represented here as an equivalent cost adjustment.",
            "whereToFind": "Your pool terms. It is modeled by dividing the adjusted cost by one minus this percentage.",
            "typical": "The sample is 2%; the supported range is 0–30%."
        }
    ],
    "readingResults": [
        {
            "figure": "Effective rate",
            "means": "The adjusted comparison cost per productive kWh. The sample yields $0.0796/kWh.",
            "soWhat": "Compare absolute values under matching billing assumptions. This is not an invoice, revenue or profit."
        },
        {
            "figure": "% above the advertised rate",
            "means": "The percentage difference from the starting advertised rate. The sample rounds to 22%.",
            "soWhat": "This measures the effect of entered assumptions. It cannot establish a provider’s honesty or quality."
        },
        {
            "figure": "Effective uptime",
            "means": "100% minus downtime and curtailment. The sample is 90%.",
            "soWhat": "Check that the same hours are not counted twice and that the billing model fits your agreement."
        },
        {
            "figure": "After fees and after lost hours",
            "means": "Separate steps show which inputs contribute to the final equivalent cost. Pool-fee adjustment follows those steps.",
            "soWhat": "Use the working to check the arithmetic and compare assumptions. The model does not recommend a provider."
        }
    ],
    "walkthrough": {
        "title": "Reproduce the $0.065/kWh educational example",
        "setup": "Use a $0.065/kWh rate, 5% management fee, 3% power-factor adjustment, 4% downtime, 6% curtailment and 2% pool fee. These are sample inputs, not observed contract terms.",
        "steps": [
            "Add management and power-factor percentages: $0.065 × 1.08 = $0.0702/kWh.",
            "Subtract the distinct lost-hours percentages from 100%: effective uptime is 90%.",
            "Divide $0.0702 by 0.90: $0.0780 per productive kWh.",
            "Divide by 0.98 for the equivalent pool-fee adjustment: $0.0795918, displayed as $0.0796/kWh.",
            "The uplift from $0.065 is 22.449%, displayed as 22%."
        ],
        "takeaway": "The result follows the entered billing and lost-hours assumptions. Comparing another offer requires the same treatment of tax, fees and paid lost hours."
    },
    "mistakes": [
        "Adding a fee that is already in the advertised rate.",
        "Counting the same stopped hour as both downtime and curtailment.",
        "Using this paid-capacity model for a bill that falls proportionally when machines stop.",
        "Treating the percentage uplift as a provider rating or comparing uplift percentages without comparing the absolute final rates."
    ],
    "limits": [
        "Booked capacity is assumed payable during lost hours. Credits, energy-only charges, curtailment compensation and revenue-share contracts need separate treatment.",
        "The pool-fee calculation is an equivalent comparison adjustment, not the actual dollar charge a pool takes from revenue. Mining revenue is not an input.",
        "The model does not include BTC price, difficulty, machine efficiency, hardware cost, repairs, financing, tax, deposits or resale value. It cannot determine profitability.",
        "Management and power-factor percentages add once. Compounded charges or fees applied to a different base need separate arithmetic.",
        "The defaults and presets are illustrative. No market rates, provider ranking or safe decision threshold are established here."
    ]
},
  "difficulty-exposure": {
    "article": {
        "title": "What a difficulty move is worth to your fleet",
        "seoTitle": "Model Bitcoin production under difficulty changes",
        "summary": "Compare BTC production under assumptions you choose. Separate production sensitivity from costs and contract payouts.",
        "publishedAt": "2026-08-31"
    },
    "whatItIs": "For a fixed hashrate and time window, higher difficulty reduces modeled BTC production. This calculator compares constant-difficulty scenarios. The spread between two scenarios is not a financial loss, a forecast, a contract payout or a position size.",
    "whoFor": "For anyone whose own mining output changes with difficulty, within the calculator’s input range. There is no minimum fleet size at which this calculation becomes economically relevant. Relevance depends on your own income and obligations. A hosting business may use it for machines it owns as well as host other people’s machines; a fee-only hosting income stream needs a separate model. Holding or selling mined BTC does not change the production calculation. Fixed-output commitments and sold hashrate need their own analysis.",
    "howToUse": [
        "Enter your fleet’s expected average hashrate in EH/s. Divide TH/s by 1,000,000. If your pool average already includes downtime, do not deduct that downtime again.",
        "Choose the horizon in modeled epochs. Each represents 2,016 target block intervals, about two weeks. This is a fixed-duration approximation, not a prediction of actual epoch dates.",
        "Check starting difficulty against a source you trust. V3 exposes a Starting difficulty input; older calculator views also accept ?diffT= in the address. The default 127.48 T is illustrative.",
        "Choose easier and harder difficulty scenarios for the whole horizon. The defaults −2.4% and +7.0% are invented sensitivity inputs, not a published forecast or a confidence interval.",
        "Enter average transaction fees per block. The model adds the fixed 3.125 BTC subsidy, assumes both remain constant and excludes pool fees. Use a different model for a horizon that crosses a subsidy change.",
        "Read production at unchanged difficulty and both scenario values. Worst case vs today compares the harder scenario with the unchanged baseline; it does not measure cash-flow loss.",
        "BTC price converts the scenario spread into a USD illustration only. It changes no BTC result. Copy the URL to retain inputs, and share only assumptions you are comfortable making visible."
    ],
    "inputs": [
        {
            "label": "Hashrate",
            "means": "Expected average fleet speed in EH/s. One EH/s is 1,000,000 TH/s.",
            "whereToFind": "Use pool records and adjust only for changes not already represented in that average, such as planned additions or future downtime.",
            "typical": "The supported slider range is 0.01–30 EH/s. This technical input range is not an audience eligibility rule."
        },
        {
            "label": "How far ahead",
            "means": "The number of approximately two-week modeled epochs.",
            "whereToFind": "Choose the time window you want to compare. Actual block timing and adjustment dates can differ.",
            "typical": "1–13 modeled epochs, approximately 2–26 weeks."
        },
        {
            "label": "Expected fees",
            "means": "Average transaction fees in BTC per block, added to the fixed 3.125 BTC subsidy.",
            "whereToFind": "Pool records or block data can inform an assumption. No future fee level is supplied by this page.",
            "typical": "The sample is 0.05 BTC per block; the slider supports 0–0.5."
        },
        {
            "label": "Bitcoin price",
            "means": "A constant USD conversion assumption for the spread.",
            "whereToFind": "Choose and record your own scenario price. This page does not supply a live price or predict a price path.",
            "typical": "$20,000–$200,000 in $1,000 steps. The $64,000 default is illustrative."
        },
        {
            "label": "Best case: difficulty falls by",
            "means": "A lower constant-difficulty scenario, applied from the start of the modeled horizon.",
            "whereToFind": "Choose a sensitivity assumption. Historical data or a separately sourced forecast can inform it, but neither guarantees the future.",
            "typical": "0–15% lower difficulty. The sample 2.4% has no forecast status."
        },
        {
            "label": "Worst case: difficulty rises by",
            "means": "A higher constant-difficulty scenario, applied from the start of the modeled horizon.",
            "whereToFind": "Choose a sensitivity assumption for the whole horizon. The page does not widen it automatically when you extend the horizon.",
            "typical": "0–15% higher difficulty. This range cannot represent every possible future outcome."
        },
        {
            "label": "Current difficulty",
            "means": "The starting network difficulty in trillions, used to infer target-interval network hashrate.",
            "whereToFind": "Check current difficulty with an independently selected block data source. In V3 change Starting difficulty; in older views use ?diffT= in the URL.",
            "typical": "127.48 T is a sample baseline, not the current network value."
        }
    ],
    "readingResults": [
        {
            "figure": "Your exposure",
            "means": "The BTC difference between production in the easier and harder scenarios. With sample inputs it is about 2.525 BTC.",
            "soWhat": "It includes both the upside from easier difficulty and the downside from harder difficulty. It is not the amount of BTC lost against the unchanged baseline."
        },
        {
            "figure": "Worst case vs today",
            "means": "The harder scenario minus production at unchanged starting difficulty. With sample inputs the difference is about −1.836 BTC.",
            "soWhat": "This is a modeled production difference, before pool fees and operating costs. There is no percentage-of-bills rule, reserve recommendation or recommendation to trade."
        },
        {
            "figure": "Production at each difficulty",
            "means": "At 1 EH/s, four modeled epochs, 127.48 T and 0.05 BTC fees per block: approximately 28.057 BTC unchanged, 28.747 BTC at −2.4% and 26.222 BTC at +7%.",
            "soWhat": "These values use constant hashrate, constant rewards and a whole-horizon difficulty change. A gradual path produces different results."
        },
        {
            "figure": "Network hashrate",
            "means": "A target-block-interval estimate derived from difficulty, about 912.54 EH/s at the sample baseline. It is not a measurement of current network speed.",
            "soWhat": "Compare with pool records using consistent periods and fee treatment. If your hashrate average already includes lost hours, do not deduct the same downtime again."
        }
    ],
    "walkthrough": {
        "title": "An illustrative 0.80 EH/s fleet over four modeled epochs",
        "setup": "Use 0.80 EH/s, four epochs, 127.48 T, 0.05 BTC fees per block, −2.4% and +7.0% scenarios, and a $64,000 conversion price. These are educational inputs, not an operational forecast.",
        "steps": [
            "At unchanged difficulty, modeled production is 22.446 BTC.",
            "At 2.4% lower difficulty, it is 22.998 BTC. At 7.0% higher difficulty, it is 20.977 BTC.",
            "The spread is 2.020 BTC, approximately $129,303 at the assumed price. It is the difference between the two scenarios, not a loss.",
            "The harder scenario produces 1.468 BTC less than the unchanged baseline, approximately $94,000 at the assumed price. No power, hosting, financing, tax or trading cost is included."
        ],
        "takeaway": "The model isolates production sensitivity. Whether that matters to a particular operation and whether any response is appropriate require information this calculator does not contain."
    },
    "mistakes": [
        "Treating the scenario spread as a loss. Compare the harder scenario with unchanged difficulty when asking about lower production.",
        "Treating sample inputs as a forecast or the harder slider as a guaranteed worst possible outcome. The supported slider range is finite.",
        "Assuming the model follows difficulty changes over time. It applies each scenario difficulty for the entire horizon.",
        "Deducting downtime twice when expected average hashrate already includes those lost hours."
    ],
    "limits": [
        "The calculator models BTC output, not profit or cash flow. It excludes power, hosting, hardware, financing, tax and pool fees.",
        "The defaults are illustrative. This standalone calculator does not depend on the public planner’s market-data feed and does not supply live network difficulty or a forecast.",
        "The model fixes the subsidy at 3.125 BTC and assumes constant hashrate, average fees and target block timing. It does not model subsidy changes or a changing difficulty path.",
        "A difficulty contract observes one specified block and pays a binary amount in its collateral currency. That payout can be zero even when your production is lower; a winning payout may over- or under-offset production changes. Contract entry cost, trading fees and full entry-cost loss are separate from this calculator.",
        "This page contains no executable price, liquidity, contract sizing or hedge-economics test. Fleet size alone cannot establish whether a contract would cover its costs."
    ]
},
  "fleet-payback": {
    "article": {
        "title": "How long until your machines pay for themselves",
        "seoTitle": "Bitcoin mining fleet payback scenarios",
        "summary": "Compare a simplified payback model under three difficulty-growth assumptions and inspect its limits.",
        "publishedAt": "2026-08-31"
    },
    "whatItIs": "The model starts with a capital outlay, adds modeled mining revenue and subtracts power cost each month. It reports the first month that cumulative modeled cash flow is non-negative, if that occurs within the chosen horizon. Three difficulty-growth assumptions provide a sensitivity comparison.",
    "whoFor": "For machine owners exploring capital recovery under explicit assumptions. Hosting operators can use it for fleets they own. A fee-only hosting business, bought hashrate, non-mining income or a full investment valuation requires another model.",
    "howToUse": [
        "Enter fleet hashrate in TH/s and efficiency in J/TH. Keep both consistent with the fleet you are modeling.",
        "Enter the modeled power cost per kWh and initial outlay. Specify which actual costs those inputs cover; omitted costs do not appear elsewhere.",
        "Choose a constant BTC conversion price and your own monthly difficulty-growth assumption. The default 1.5% is an illustrative input, not an estimate supplied by this site.",
        "Check starting difficulty and horizon. V3 exposes Starting difficulty; the URL also accepts diffT and months within supported bounds. Defaults are 127.48 T and 48 months.",
        "Compare the central row with the lower-growth and higher-growth rows. Lower growth is the selected rate minus two percentage points, floored at zero; higher growth is the selected rate plus three points.",
        "Check the final cumulative cash balance alongside the payback month. No payback within the horizon cannot establish whether payback happens later.",
        "Copy the URL to retain inputs. Share only assumptions you are comfortable exposing."
    ],
    "inputs": [
        {
            "label": "Fleet hashrate",
            "means": "Combined modeled fleet speed in TH/s.",
            "whereToFind": "Use a consistent fleet specification or operating average, and document how downtime is represented.",
            "typical": "The slider supports 100–20,000 TH/s. The default 1,000 TH/s is illustrative."
        },
        {
            "label": "Efficiency",
            "means": "Joules per terahash. Hashrate × efficiency determines modeled wall power.",
            "whereToFind": "Use a measurement or specification relevant to the same operating mode as your hashrate.",
            "typical": "The slider supports 12–40 J/TH. The default 15 J/TH is illustrative."
        },
        {
            "label": "All-in power cost",
            "means": "The chosen cost per modeled kWh. No separate operating-cost input is added.",
            "whereToFind": "Use your own billing assumptions. If converting another cost into $/kWh, avoid counting it twice and record the approximation.",
            "typical": "The slider supports $0.02–$0.15/kWh. The default $0.045 is not a quoted market rate."
        },
        {
            "label": "What you paid up front",
            "means": "The initial outlay to recover. It is independent of the hashrate input.",
            "whereToFind": "Use invoices or a stated scenario amount. The model does not validate equipment prices or purchase history.",
            "typical": "The slider supports $5,000–$2,000,000. The default $20,000 is a sample."
        },
        {
            "label": "Bitcoin price",
            "means": "A constant USD price used to value all modeled mined BTC.",
            "whereToFind": "Choose and record a scenario price. It does not predict a future price path.",
            "typical": "The slider supports $20,000–$200,000. The $90,000 default is illustrative."
        },
        {
            "label": "Assumed difficulty growth",
            "means": "A compounded monthly growth assumption. The first growth step applies in month one.",
            "whereToFind": "Choose a sensitivity assumption. Historical observations are not a guarantee of a future growth rate.",
            "typical": "The central slider supports 0–8% per month. The comparison rows use its defined offsets."
        },
        {
            "label": "Starting difficulty",
            "means": "A sample network difficulty in trillions that sets the initial production denominator.",
            "whereToFind": "Check a separately selected data source and enter the value in V3, or change diffT in the URL.",
            "typical": "The 127.48 T default is illustrative, not current network data."
        }
    ],
    "readingResults": [
        {
            "figure": "Payback",
            "means": "The first modeled month cumulative revenue after power cost covers the initial outlay, on the central path.",
            "soWhat": "It is conditional on the input assumptions and excluded costs. It does not guarantee capital recovery."
        },
        {
            "figure": "The three growth rows",
            "means": "Lower, central and higher monthly difficulty-growth assumptions for the same fleet and costs.",
            "soWhat": "They form a sensitivity comparison, not a confidence interval, forecast or ranking of investments."
        },
        {
            "figure": "Cash after the modeled horizon",
            "means": "Cumulative modeled revenue minus power costs and initial outlay. The model values mined BTC at the constant input price.",
            "soWhat": "A negative value is a deficit at that date. It cannot prove payback will never occur."
        },
        {
            "figure": "Power cost per day",
            "means": "Hashrate × efficiency ÷ 1,000 × 24 hours × the power-rate input. For the sample this is $16.20/day.",
            "soWhat": "The model holds it constant and does not automatically add other operating costs."
        }
    ],
    "walkthrough": {
        "title": "Reproduce the static-versus-range educational example",
        "setup": "Use 1,000 TH/s, 15 J/TH, $0.045/kWh, $20,000 outlay, $90,000/BTC, 127.48 T, 1.5% central growth and 48 months. Inputs are illustrative.",
        "steps": [
            "The fleet draws 15 kW, consumes 360 kWh per modeled day and costs $16.20/day in power.",
            "At 0% monthly difficulty growth, the first non-negative cumulative cash month is 24. The final 48-month balance is approximately +$21,123.",
            "At 1.5% monthly growth, the first non-negative cumulative cash month is 38. The final balance is approximately +$2,291.",
            "At 4.5% monthly growth, there is no payback within 48 months. The final balance is approximately −$17,282."
        ],
        "takeaway": "The same sample fleet produces different conditional results under different difficulty paths. None is a complete investment model or a contract-sizing calculation."
    },
    "mistakes": [
        "Interpreting no payback within 48 months as a claim about every later year.",
        "Treating sample equipment cost, BTC price or growth as a current market benchmark or recommendation.",
        "Changing hashrate while unintentionally retaining an unrelated capital outlay or power assumption.",
        "Ignoring costs, downtime or additional income that the simplified model does not represent."
    ],
    "limits": [
        "The subsidy is fixed at 3.125 BTC throughout the horizon, including across a future halving. The model cannot represent an actual horizon crossing a subsidy change.",
        "Transaction fees, pool fees, downtime, repairs, tax, financing, resale value and non-mining income are not separate inputs. Costs folded into the power rate are approximations.",
        "BTC price, hashrate, efficiency and power rate stay constant. Difficulty follows a compounded constant monthly assumption, not an observed or forecast path.",
        "Each month has 30.4 modeled days. Starting difficulty grows once before month-one revenue is calculated.",
        "The lower-growth path is floored at zero. Falling difficulty cannot be modeled. Three paths do not bound every possible outcome.",
        "A binary difficulty contract observes one specified block and has its own collateral payout, entry cost, fees and possible full entry-cost loss. This model contains no such position and establishes no hedge economics."
    ]
},

}

export const guideFor = (slug: string): ToolGuideContent | undefined => TOOL_GUIDES[slug]

export const allGuides = (): { slug: string; guide: ToolGuideContent }[] =>
  Object.entries(TOOL_GUIDES).map(([slug, guide]) => ({ slug, guide }))
