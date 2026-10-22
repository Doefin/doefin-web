export type V3ResearchSection = { heading: string; paragraphs: string[] }
export const v3ContentReviewedAt = '2026-10-19'
export const v3Reports = [{
  "slug": "observed-difficulty-adjustments",
  "title": "What changed across 25 observed retargets?",
  "summary": "A reproducible analysis of a frozen mempool.space network-data capture, with public findings, CSV, source payload and version metadata. Observed changes are not forecasting performance.",
  "publishedAt": "2026-10-22",
  "sections": [
    {
      "heading": "A defined window, not a forecast backtest",
      "paragraphs": [
        "The capture contains 25 consecutive observed difficulty changes between 2025-11-12 and 2026-10-16. There were 11 increases and 14 decreases. Mean absolute observed change was 3.75%; the minimum was -11.16% and maximum 14.73%.",
        "These describe difficulty adjustments in this historical window. They do not measure forecast error, calibrated uncertainty, mining profit or a trading return. The capture is a small descriptive analysis, not evidence of a forecasting advantage."
      ]
    },
    {
      "heading": "Reproduce the arithmetic",
      "paragraphs": [
        "The source is the mempool.space one-year difficulty-adjustment endpoint, captured on 22 October 2026. Sort the 26 supplied boundaries by block height and check consecutive boundaries are 2,016 blocks apart. Exclude the earliest because the preceding difficulty is outside this capture. For each remaining boundary, compute 100 \u00d7 (new difficulty / previous difficulty \u2212 1). Ignore the provider\u2019s rounded adjustment ratio.",
        "The mean absolute change is the arithmetic mean of the 25 absolute percentage changes. The retained values use the provider\u2019s difficulty precision; display rounding is separate. The manifest includes SHA-256 digests for the source bytes and CSV/JSON distributions, making later changes detectable against this version."
      ]
    },
    {
      "heading": "Inspect provenance and limitations",
      "paragraphs": [
        "The capture includes exact source response bytes and matching boundary-block metadata for the first and last retained observations. Those checks use the same provider, so they are consistency checks rather than verification by an independent Bitcoin node. The rolling endpoint window fixes the inclusion rule; it is not a selection of profitable periods.",
        "All findings and downloads are available without email. Version 1.0.0 has a stable dataset identifier and a citation manifest. No DOI has been registered or deposited. Updating the dataset requires a new version; local digests do not establish an external publication timestamp or immutable hosting."
      ]
    },
    {
      "heading": "Keep forecasts separate from observations",
      "paragraphs": [
        "The prospective forecast archive currently has zero published records. The dated forecast examples and arithmetic scoreboard elsewhere remain clearly labelled synthetic. Historical observed adjustments cannot be counted as previously published predictions.",
        "Before scoring a provider, preserve its prediction, input height, target, model version, stated interval and time-stamped original capture. Compare the same lead-time cohorts and retain missing providers. Original publication before an outcome or market listing requires separate independently verifiable receipts; the prototype cannot manufacture those after the fact."
      ]
    }
  ]
}, {
  slug: 'difficulty-forecast-accuracy-2026',
  title: 'Comparing difficulty forecasts',
  summary: 'A worked approach to comparing forecasts and outcomes, using a synthetic dataset rather than measured estimator performance.',
  publishedAt: '2026-10-19',
  sections: [
    { heading: 'Compare the same question', paragraphs: ['A fair comparison starts with the same target block, difficulty-change definition and forecast time. Comparing an early-epoch forecast with a later forecast gives the later one information the earlier one did not have.', 'Record the forecast as it was issued, the input block height, source, model version and outcome definition. Preserve failed and missing forecasts in the evaluation record rather than selecting only successful predictions.'] },
    { heading: 'Measure error and uncertainty separately', paragraphs: ['Absolute error is the distance between a forecast and its outcome. Mean absolute error averages that distance over the selected observations. It describes that evaluation set; it does not establish how a model will perform in another period.', 'An interval needs a separate check: how often did outcomes fall inside the stated range, and how wide was it? Wide intervals can cover many outcomes without being useful. Calibration needs enough independent observations and an explicit evaluation window.'] },
    { heading: 'What this example establishes', paragraphs: ['The linked worked example makes the arithmetic inspectable. Its forecast/outcome pairs were authored for an educational exercise. They are not captured predictions, network observations or results for Doefin or another estimator.', 'There is no verified comparison of public forecasters on this page. It cannot support a ranking, an accuracy advantage, a volatility estimate or a claim about which forecasters publish intervals.'] },
  ] satisfies V3ResearchSection[],
}]
export const allV3Reports = () => v3Reports
export const getV3Report = (slug: string) => v3Reports.find(report => report.slug === slug)

export const v3Methodology: V3ResearchSection[] = [
  { heading: 'Start with the observable inputs', paragraphs: ['A difficulty projection can use the current difficulty, the adjustment boundary and the elapsed time between observed Bitcoin blocks. The method must say which blocks it includes and when those inputs were captured.', 'Blocks arrive irregularly. Extrapolating the pace observed so far makes an assumption about the rest of the epoch; it is not a reading of a future network value. Calendar timing is also an estimate.'] },
  { heading: 'Make the calculation reproducible', paragraphs: ['Publish the input block heights and timestamps, target adjustment height, formula, protocol constraints and rounding rules. Identify the method version so another reader can reproduce that particular output.', 'Keep the projected percentage change distinct from the observed difficulty level and from any market-implied probability. They answer different questions.'] },
  { heading: 'Validate any uncertainty interval', paragraphs: ['An uncertainty range needs a documented construction method and an evaluation against outcomes. State the fitting period, forecast timing and held-out evaluation window; report interval width together with observed coverage.', 'The ranges displayed in this website’s examples are authored illustrations. They have not been fitted or calibrated, and no claimed coverage level or probability of a direction change should be inferred from them.'] },
  { heading: 'Read the status of the evidence', paragraphs: ['This page explains the information required to evaluate a forecast. It does not document a verified running forecast service, publish a measured accuracy history or promise an immutable archive.', 'The observed-adjustment report and public API publish captured network data separately from forecasts. Use the synthetic forecast report to reproduce error arithmetic; a measured forecast comparison still requires original timestamped predictions, matched lead times, outcomes and corrections.'] },
]

export const v3AboutSections: V3ResearchSection[] = [
  { heading: 'A market and a place to understand it', paragraphs: ['Doefin’s product is a market on Bitcoin mining difficulty. This website introduces the product for mining operators, funds and trading desks. The documentation explains its mechanics, operating steps and limitations.', 'The trading application is separate. Its current market specification, available liquidity and transaction confirmations are the information to review before acting.'] },
  { heading: 'Research you can inspect', paragraphs: ['The research pages demonstrate a format with an explanation, assumptions and an inspectable dataset. The observed-adjustment report uses a frozen public network-data capture with inspectable provenance. Forecast examples remain synthetic; neither establishes forecasting performance or a historical prediction track record.', 'Doefin operates a product linked to the same underlying discussed in its research. Readers should evaluate methods, inputs and conflicts of interest alongside any future performance claims.'] },
  { heading: 'Information for an organisational review', paragraphs: ['Ask the team for the current legal entity, contractual terms, access requirements and any authorisation relevant to your organisation and jurisdiction. Company registration alone does not establish regulatory authorisation.', 'This website does not provide a verified regulatory register, deployment registry or audit certification. The technical-review guide lists the evidence to request and match to the actual deployment.'] },
]
