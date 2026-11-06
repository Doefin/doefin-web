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
    "blurb": "Compare an advertised hosting rate with separate fees and hours you pay for while machines are stopped. The result is an equivalent cost, not profit.",
    "useIf": "you own hosted machines and still pay when they are stopped",
    "notFor": "energy-only billing, hosting fee income or a complete profitability model",
    "steps": [
        "Check the billing agreement and your invoices.",
        "Enter the rate and separate percentage fees.",
        "Enter paid downtime and curtailment separately.",
        "Compare final costs with the same billing assumptions."
    ],
    "inputHints": [
        {
            "label": "Advertised power rate",
            "means": "The starting price per kWh before the separate adjustments below.",
            "whereToFind": "Contract and invoices. Use consistent tax treatment; do not add included fees twice.",
            "typical": "Sample $0.065/kWh; supported input $0–$0.20/kWh."
        },
        {
            "label": "Management fee",
            "means": "An added percentage of the advertised rate.",
            "whereToFind": "Contract terms. Enter zero if already included in your rate.",
            "typical": "Sample 5%; supported input 0–30%."
        },
        {
            "label": "Power factor extra (if billed on kVA)",
            "means": "A separate percentage added to the advertised rate alongside management fees.",
            "whereToFind": "Your billing terms or a measured invoice charge.",
            "typical": "Sample 3%; supported input 0–30%."
        },
        {
            "label": "Unplanned downtime",
            "means": "Downtime you still pay for. Enter curtailment separately.",
            "whereToFind": "Pool and billing records for the same period. Never count an hour twice.",
            "typical": "Sample 4%; supported input 0–30%."
        },
        {
            "label": "Curtailment",
            "means": "Deliberately stopped hours that remain payable.",
            "whereToFind": "Site records and invoices. This model has no curtailment credit or payment input.",
            "typical": "Sample 6%; supported input 0–30%."
        },
        {
            "label": "Pool fee",
            "means": "The share of revenue paid to the pool, converted into an equivalent cost.",
            "whereToFind": "Your pool terms. This is not an actual electricity invoice charge.",
            "typical": "Sample 2%; supported input 0–30%."
        }
    ],
    "resultHints": [
        {
            "figure": "After fees",
            "hint": "Advertised rate multiplied by one plus management and power-factor percentages. These percentages add; they do not compound."
        },
        {
            "figure": "Effective uptime",
            "hint": "100% minus downtime and curtailment. Use the same period and count each lost hour once."
        },
        {
            "figure": "After lost hours",
            "hint": "Adjusted cost divided by the share of productive hours. You are assumed to pay for booked capacity even while idle."
        },
        {
            "figure": "% above the advertised rate",
            "hint": "The percentage increase caused by your inputs. Compare final costs too; this is not a provider rating."
        }
    ],
    "presets": [
        {
            "name": "Curtailment sample",
            "note": "Illustrative $0.055 rate, separate fees and 25% curtailment.",
            "values": {
                "rate": 0.055,
                "mgmt": 10,
                "pf": 3,
                "down": 5,
                "curt": 25,
                "pool": 2
            }
        },
        {
            "name": "Lower lost-hours sample",
            "note": "Illustrative $0.070 rate, 3% management and 2% downtime.",
            "values": {
                "rate": 0.07,
                "mgmt": 3,
                "pf": 0,
                "down": 2,
                "curt": 0,
                "pool": 2
            }
        },
        {
            "name": "Flat-fee conversion sample",
            "note": "An illustrative $0.100/kWh equivalent; fees already included.",
            "values": {
                "rate": 0.1,
                "mgmt": 0,
                "pf": 0,
                "down": 3,
                "curt": 0,
                "pool": 2
            }
        }
    ],
    "watchOut": [
        "Assumes booked capacity remains payable during lost hours. Other billing models need separate arithmetic.",
        "Pool fees are an equivalent comparison adjustment, not an electricity charge.",
        "This is not profit. Hardware, repairs, tax, deposits, BTC price and difficulty are excluded.",
        "All presets are educational inputs, not market benchmarks, provider ratings or recommendations."
    ]
},
  "difficulty-exposure": {
    "blurb": "Compare expected BTC production across difficulty scenarios you choose. The sample is illustrative; costs and contract payouts are separate.",
    "useIf": "your own BTC production changes with difficulty, within the supported input range",
    "notFor": "fee-only hosting income or a complete cost, profit or contract model",
    "steps": [
        "Enter expected average hashrate in EH/s.",
        "Choose the production period and check starting difficulty.",
        "Set your own easier and harder difficulty scenarios.",
        "Compare production; the spread is not a loss."
    ],
    "inputHints": [
        {
            "label": "Hashrate",
            "means": "Your fleet’s expected average hashrate. One EH/s equals 1,000,000 TH/s.",
            "whereToFind": "Pool records; account for future changes without deducting downtime already included in your average.",
            "typical": "0.01–30 EH/s is the supported input range."
        },
        {
            "label": "How far ahead",
            "means": "The comparison period, using approximately two weeks per modelled epoch.",
            "whereToFind": "Choose the period you want to compare; actual epoch dates can differ.",
            "typical": "1–13 modelled epochs, approximately 2–26 weeks."
        },
        {
            "label": "Expected fees",
            "means": "Average transaction fees per block, added to the fixed 3.125 BTC subsidy.",
            "whereToFind": "Use pool or block data to inform your own assumption.",
            "typical": "0.05 BTC per block is an illustrative sample."
        },
        {
            "label": "Bitcoin price",
            "means": "Converts the spread to USD. It changes no BTC result.",
            "whereToFind": "Choose a scenario price. This page supplies no live price or price prediction.",
            "typical": "$20,000–$200,000; the default is illustrative."
        },
        {
            "label": "Best case: difficulty falls by",
            "means": "A lower difficulty applied from the start of the whole modelled period.",
            "whereToFind": "Choose a sensitivity assumption; this sample is not a forecast.",
            "typical": "0–15% lower difficulty; default 2.4% is illustrative."
        },
        {
            "label": "Worst case: difficulty rises by",
            "means": "A higher difficulty applied from the start of the whole modelled period.",
            "whereToFind": "Choose a change for the whole period. The scenario does not adjust automatically when you extend it.",
            "typical": "0–15% higher difficulty; default 7% is illustrative."
        }
    ],
    "resultHints": [
        {
            "figure": "Best case vs worst case",
            "hint": "The difference between two production scenarios. It includes upside and downside; it is not a loss."
        },
        {
            "figure": "Worst case vs today",
            "hint": "How much less BTC the harder case produces than the unchanged-difficulty case. Excludes operating costs, contract payout and trade recommendations."
        },
        {
            "figure": "Production at current difficulty",
            "hint": "Expected BTC production at your starting difficulty, before pool fees. Do not deduct downtime again if your hashrate already includes it."
        },
        {
            "figure": "Network hashrate",
            "hint": "Implied by your starting difficulty, assuming ten-minute blocks. It is not a live measurement of mining activity."
        }
    ],
    "presets": [
        {
            "name": "0.20 EH/s sample",
            "note": "One modelled epoch; illustrative −1% and +3% difficulty scenarios.",
            "values": {
                "eh": 0.2,
                "epochs": 1,
                "diffT": 127.48,
                "low": -1,
                "high": 3,
                "fees": 0.05,
                "price": 60000
            }
        },
        {
            "name": "0.80 EH/s sample",
            "note": "Four modelled epochs with illustrative −4% and +12% difficulty scenarios.",
            "values": {
                "eh": 0.8,
                "epochs": 4,
                "diffT": 127.48,
                "low": -4,
                "high": 12,
                "fees": 0.05,
                "price": 64000
            }
        },
        {
            "name": "5 EH/s sample",
            "note": "Thirteen modelled epochs. +15% is a slider limit, not maximum risk.",
            "values": {
                "eh": 5,
                "epochs": 13,
                "diffT": 127.48,
                "low": -5,
                "high": 15,
                "fees": 0.05,
                "price": 64000
            }
        }
    ],
    "watchOut": [
        "The spread between scenarios is not a loss. Compare the harder case with unchanged difficulty separately.",
        "Defaults are illustrative, not live or forecast inputs. Set scenarios for the whole horizon.",
        "Each scenario applies its difficulty from the start. A gradual path produces different results.",
        "The model fixes subsidy, hashrate and target block timing. It excludes subsidy changes, pool fees and operating costs."
    ]
},
  "fleet-payback": {
    "blurb": "Estimate when a fleet could recover its initial cost under three monthly difficulty-growth assumptions. Results depend on your inputs, with no guaranteed return.",
    "useIf": "you own machines and want to compare when their costs could be recovered",
    "notFor": "fee-only hosting income, bought hashrate or a complete investment valuation",
    "steps": [
        "Check starting difficulty and the modelled horizon.",
        "Enter fleet, efficiency, power and outlay figures for the same scenario.",
        "Choose your BTC price and difficulty-growth scenarios.",
        "Compare final balances across scenarios and check the costs left out."
    ],
    "inputHints": [
        {
            "label": "Fleet hashrate",
            "means": "Combined fleet hashrate in TH/s.",
            "whereToFind": "A consistent fleet specification or operating average. Record how you treat downtime.",
            "typical": "Sample 1,000 TH/s; supported input 100–20,000 TH/s."
        },
        {
            "label": "Efficiency",
            "means": "Joules per terahash. It determines power demand alongside hashrate.",
            "whereToFind": "Measurements or specifications for the same operating mode as your hashrate.",
            "typical": "Sample 15 J/TH; supported input 12–40 J/TH."
        },
        {
            "label": "All-in power cost",
            "means": "The cost assigned to each modelled kWh. Other costs are not automatically added.",
            "whereToFind": "Your billing assumptions. Record any approximation used to fold another cost into this rate.",
            "typical": "Sample $0.045/kWh; supported input $0.02–$0.15/kWh."
        },
        {
            "label": "What you paid up front",
            "means": "The initial amount to recover. Changing fleet hashrate does not change this amount.",
            "whereToFind": "Use your invoices or a clearly stated example amount. This page does not check equipment prices.",
            "typical": "Sample $20,000; supported input $5,000–$2,000,000."
        },
        {
            "label": "Bitcoin price",
            "means": "A constant USD price for all modelled BTC revenue.",
            "whereToFind": "Choose and document a scenario price; this page supplies no price forecast.",
            "typical": "Sample $90,000; supported input $20,000–$200,000."
        },
        {
            "label": "Difficulty growth guess",
            "means": "A monthly growth rate applied repeatedly. The first increase comes before production in month one.",
            "whereToFind": "Choose a sensitivity assumption. The sample is not a forecast.",
            "typical": "Sample 1.5% monthly; central input supports 0–8%."
        }
    ],
    "resultHints": [
        {
            "figure": "Payback",
            "hint": "The first month the central scenario recovers the initial outlay after power costs. Costs outside your inputs are excluded."
        },
        {
            "figure": "Monthly difficulty growth",
            "hint": "Lower is your input minus two percentage points, floored at zero. Higher is your input plus three percentage points. These are assumptions."
        },
        {
            "figure": "Cash after 48 months",
            "hint": "Revenue minus power cost and initial outlay in the model. A negative balance does not tell you whether payback could happen later."
        },
        {
            "figure": "Power cost per day",
            "hint": "Hashrate × efficiency ÷ 1,000 × 24 × power rate. The model holds it constant."
        }
    ],
    "presets": [
        {
            "name": "Lower-rate sample",
            "note": "Illustrative 1,000 TH/s, $15,000 outlay and $0.035/kWh.",
            "values": {
                "th": 1000,
                "jPerTh": 12.5,
                "power": 0.035,
                "capex": 15000,
                "price": 90000,
                "growth": 1.5
            }
        },
        {
            "name": "Advertised-rate sample",
            "note": "Illustrative 1,200 TH/s, $18,000 outlay and $0.065/kWh.",
            "values": {
                "th": 1200,
                "jPerTh": 12.5,
                "power": 0.065,
                "capex": 18000,
                "price": 90000,
                "growth": 1.5
            }
        },
        {
            "name": "Adjusted-rate sample",
            "note": "Same illustrative fleet with $0.078/kWh as its cost assumption.",
            "values": {
                "th": 1200,
                "jPerTh": 12.5,
                "power": 0.078,
                "capex": 18000,
                "price": 90000,
                "growth": 1.5
            }
        }
    ],
    "watchOut": [
        "The subsidy stays fixed at 3.125 BTC. A horizon crossing a halving needs a different model.",
        "The model does not validate whether fleet size, equipment cost and power assumptions are consistent.",
        "No payback within the modelled horizon does not establish what happens after it.",
        "Transaction fees, pool fees, downtime, repairs, tax, financing and resale value are not separate inputs."
    ]
},

}

export const microFor = (slug: string): ToolMicro | undefined => TOOL_MICRO[slug]

export const hintFor = (slug: string, label: string) =>
  TOOL_MICRO[slug]?.inputHints.find((h) => h.label === label)

export const resultHintFor = (slug: string, figure: string) =>
  TOOL_MICRO[slug]?.resultHints.find((h) => h.figure === figure)?.hint

export const presetsFor = (slug: string) => TOOL_MICRO[slug]?.presets ?? []
