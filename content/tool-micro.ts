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
    "blurb": "Compare an advertised hosting rate with fees and paid lost hours. The final figure is an equivalent cost, not profit.",
    "useIf": "you own hosted machines and pay booked capacity during lost hours",
    "notFor": "energy-only billing, hosting fee income or a complete profitability model",
    "steps": [
        "Check the billing agreement and your invoices.",
        "Enter the rate and separate percentage fees.",
        "Set distinct paid downtime and curtailment assumptions.",
        "Compare absolute final costs under consistent assumptions."
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
            "means": "Lost hours that remain payable, separate from curtailment.",
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
            "means": "A revenue percentage converted into an equivalent cost adjustment.",
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
            "hint": "100% minus the two distinct lost-hours assumptions. Check the period and avoid double-counting."
        },
        {
            "figure": "After lost hours",
            "hint": "Adjusted cost divided by the productive-hours fraction. It assumes booked capacity remains payable while idle."
        },
        {
            "figure": "% above the advertised rate",
            "hint": "The percentage uplift caused by your inputs. Compare absolute final costs too; this is not a provider rating."
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
    "blurb": "Compare BTC production across difficulty scenarios you choose. The sample is illustrative; costs and contract payouts are separate.",
    "useIf": "your own BTC production changes with difficulty, within the supported input range",
    "notFor": "fee-only hosting income or a complete cost, profit or contract model",
    "steps": [
        "Enter expected average hashrate in EH/s.",
        "Choose a modeled horizon and check starting difficulty.",
        "Set your own easier and harder difficulty scenarios.",
        "Compare production; the spread is not a loss."
    ],
    "inputHints": [
        {
            "label": "Hashrate",
            "means": "Expected average fleet speed. One EH/s equals 1,000,000 TH/s.",
            "whereToFind": "Pool records; account for future changes without deducting downtime already included in your average.",
            "typical": "0.01–30 EH/s is the supported input range."
        },
        {
            "label": "How far ahead",
            "means": "A fixed-duration comparison, using approximately two weeks per modeled epoch.",
            "whereToFind": "Choose the period you want to compare; actual epoch dates can differ.",
            "typical": "1–13 modeled epochs, approximately 2–26 weeks."
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
            "means": "An easier difficulty scenario applied across the whole modeled horizon.",
            "whereToFind": "Choose a sensitivity assumption; this sample is not a forecast.",
            "typical": "0–15% lower difficulty; default 2.4% is illustrative."
        },
        {
            "label": "Worst case: difficulty rises by",
            "means": "A harder difficulty scenario applied across the whole modeled horizon.",
            "whereToFind": "Choose a sensitivity assumption for your horizon. No automatic forecast adjustment.",
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
            "hint": "BTC production below the unchanged baseline in your harder scenario. No operating costs, contract payout or trade recommendation are included."
        },
        {
            "figure": "Production at current difficulty",
            "hint": "Modeled output at your starting difficulty, before pool fees. Do not deduct downtime again if your hashrate already includes it."
        },
        {
            "figure": "Network hashrate",
            "hint": "Inferred from your starting difficulty at a target ten-minute block interval. It is not a live network measurement."
        }
    ],
    "presets": [
        {
            "name": "0.20 EH/s sample",
            "note": "One modeled epoch; illustrative −1% and +3% difficulty scenarios.",
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
            "note": "Four modeled epochs with illustrative −4% and +12% difficulty scenarios.",
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
            "note": "Thirteen modeled epochs. +15% is a slider limit, not maximum risk.",
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
        "The fixed subsidy, constant hashrate and target block timing omit subsidy changes, pool fees and operating costs."
    ]
},
  "fleet-payback": {
    "blurb": "Compare simplified capital recovery under three monthly difficulty-growth assumptions. Inputs and results are conditional, with no guaranteed return.",
    "useIf": "you own machines and want a simplified capital-recovery comparison",
    "notFor": "fee-only hosting income, bought hashrate or a complete investment valuation",
    "steps": [
        "Check starting difficulty and the modeled horizon.",
        "Enter consistent fleet, efficiency, power and outlay assumptions.",
        "Choose your BTC price and difficulty-growth scenarios.",
        "Compare all rows, final balances and omitted costs."
    ],
    "inputHints": [
        {
            "label": "Fleet hashrate",
            "means": "Combined modeled fleet speed in TH/s.",
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
            "means": "The cost assigned to each modeled kWh. Other costs are not automatically added.",
            "whereToFind": "Your billing assumptions. Record any approximation used to fold another cost into this rate.",
            "typical": "Sample $0.045/kWh; supported input $0.02–$0.15/kWh."
        },
        {
            "label": "What you paid up front",
            "means": "The modeled initial outlay. It is independent of fleet hashrate.",
            "whereToFind": "Invoices or a stated scenario amount. This page does not validate equipment prices.",
            "typical": "Sample $20,000; supported input $5,000–$2,000,000."
        },
        {
            "label": "Bitcoin price",
            "means": "A constant USD price for all modeled BTC revenue.",
            "whereToFind": "Choose and document a scenario price; this page supplies no price forecast.",
            "typical": "Sample $90,000; supported input $20,000–$200,000."
        },
        {
            "label": "Difficulty growth guess",
            "means": "A compounded monthly assumption, first applied before month-one production.",
            "whereToFind": "Choose a sensitivity assumption. The sample is not a forecast.",
            "typical": "Sample 1.5% monthly; central input supports 0–8%."
        }
    ],
    "resultHints": [
        {
            "figure": "Payback",
            "hint": "The first modeled month cumulative cash reaches zero on the central path. It excludes costs not represented in inputs."
        },
        {
            "figure": "Monthly difficulty growth",
            "hint": "Lower is your input minus two points, floored at zero. Higher is your input plus three points. These are assumptions."
        },
        {
            "figure": "Cash after 48 months",
            "hint": "Modeled revenue minus power cost and initial outlay. A negative balance cannot establish whether payback ever happens later."
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
        "No payback within the modeled horizon does not establish what happens after it.",
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
