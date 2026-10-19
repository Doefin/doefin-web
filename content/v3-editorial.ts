export type V3EditorialArticle = {
  kind: 'blog' | 'academy'
  slug: string
  title: string
  summary: string
  tags: string[]
  sections: { heading: string; paragraphs: string[] }[]
}

const articles: V3EditorialArticle[] = [
  { kind: 'blog', slug: 'what-a-static-growth-assumption-costs-you', title: 'Testing a difficulty-growth assumption', summary: 'Compare production and payback across assumptions instead of treating one growth rate as a forecast.', tags: ['difficulty', 'mining economics'], sections: [
    { heading: 'State the assumption', paragraphs: ['A fixed difficulty-growth rate is an input to a scenario. It is not evidence of what the network will do. Label its time period and keep it separate from measured historical data or a dated forecast.'] },
    { heading: 'Compare the result, not only the input', paragraphs: ['Run the same fleet assumptions with different difficulty paths. Compare the resulting production and payback alongside power cost, uptime, capital cost and Bitcoin price. Holding the other inputs constant helps show which change drives the difference.'] },
    { heading: 'Keep the decision proportional to the evidence', paragraphs: ['A simplified calculator exposes sensitivity; it does not determine whether a position is suitable or economical. That assessment also needs timing, transaction costs, available liquidity, operational constraints and the decision-maker’s objectives. This article provides no measured threshold at which an operation should hedge.'] },
  ] },
  { kind: 'blog', slug: 'reading-a-hashrate-chart-honestly', title: 'Reading a hashrate chart', summary: 'Check the observation window and uncertainty before interpreting a change in estimated network hashrate.', tags: ['hashrate', 'methodology'], sections: [
    { heading: 'An estimate from observable inputs', paragraphs: ['Network hashrate is inferred from difficulty and block timing, rather than read from a register of mining machines. The reported value depends on the chosen observation window and calculation.'] },
    { heading: 'Compare like with like', paragraphs: ['Short and long windows can produce different estimates because blocks arrive irregularly. Before comparing two charts, check the timestamps, units, averaging window and difficulty inputs. A chart alone does not establish that mining capacity has changed.'] },
    { heading: 'Ask how uncertainty was estimated', paragraphs: ['An error band should have a stated construction method and assumptions. This guide does not report measured error-band widths or classify a recent network movement as noise. Use the methodology and source observations to assess the particular chart.'] },
  ] },
  { kind: 'academy', slug: 'how-difficulty-adjustment-works', title: 'How Bitcoin difficulty adjustment works', summary: 'Difficulty adjusts the work needed to find a valid block. Understand its role in production and observation timing.', tags: ['difficulty'], sections: [
    { heading: 'The network’s feedback mechanism', paragraphs: ['Bitcoin periodically adjusts mining difficulty using the elapsed time between blocks in the preceding adjustment period. Faster block production generally leads to higher difficulty; slower production generally leads to lower difficulty, subject to the protocol’s rules.'] },
    { heading: 'Why timing is an estimate', paragraphs: ['Individual blocks arrive irregularly. A target block height is specific, but the calendar date when it will arrive is estimated. A difficulty forecast projects the adjustment before the observation is complete.'] },
    { heading: 'What changes for a miner', paragraphs: ['For a fixed hashrate and time window, higher difficulty lowers expected block production. Actual production also varies with block discovery, uptime and pool arrangements. Revenue further depends on rewards, fees and the Bitcoin price.'] },
    { heading: 'Read a market separately', paragraphs: ['A difficulty market uses a specified threshold and observation block. The market’s binary payout differs from the continuous change in a fleet’s expected production. Review both before relating a position to an operational exposure.'] },
  ] },
  { kind: 'academy', slug: 'what-hashprice-means', title: 'What hashprice measures', summary: 'Read expected mining revenue per unit of hashrate and time, with the denomination and assumptions visible.', tags: ['mining economics', 'hashrate'], sections: [
    { heading: 'Revenue per unit of work capacity', paragraphs: ['Hashprice expresses mining revenue per unit of hashrate over a stated time period. It can be denominated in Bitcoin or converted into a currency such as US dollars. Always check those units before comparing figures.'] },
    { heading: 'Check the inputs', paragraphs: ['The calculation depends on difficulty, block rewards and transaction fees. A currency-denominated version also depends on its Bitcoin price source. Different observation windows, averaging choices and price timestamps can produce different published values.'] },
    { heading: 'Keep revenue distinct from profit', paragraphs: ['Hashprice describes revenue, not an operation’s margin. Compare it with the relevant power, hosting, maintenance and other costs using compatible units. Fleet efficiency and uptime also affect the outcome.'] },
    { heading: 'Do not assume a constant fee share', paragraphs: ['Transaction-fee revenue varies. A claim about its share of mining rewards needs a stated observation period and source. This guide makes no measured claim about the current share or the causes of differences between particular publishers.'] },
  ] },
  { kind: 'academy', slug: 'why-forecasts-need-error-bars', title: 'Why difficulty forecasts need uncertainty', summary: 'Assess a point forecast, its uncertainty range and the evidence for its accuracy as separate questions.', tags: ['difficulty', 'methodology'], sections: [
    { heading: 'A projection is not an outcome', paragraphs: ['A point forecast estimates a future adjustment using information available at its issue time. Remaining blocks can change the observed pace and therefore the projection. The issue time matters when comparing forecasts.'] },
    { heading: 'A range needs a method', paragraphs: ['A stated range should identify its assumptions, construction and intended coverage. A theoretical interval and an empirically fitted interval each need evaluation; neither is validated by its label alone.'] },
    { heading: 'Evaluate accuracy and calibration', paragraphs: ['Point error measures the distance between a forecast and an outcome. Interval coverage measures how often outcomes fell inside a published band across an evaluation set. Also inspect interval width, lead time, missing observations and changes to the method.'] },
    { heading: 'Look for a reproducible record', paragraphs: ['Use original forecast captures, source outcomes and an explicit evaluation window. The sample data on this website demonstrates calculations only. It does not establish a calibrated interval, an accuracy ranking or a general claim about competing forecasters.'] },
  ] },
]

export const allV3Editorial = (kind: V3EditorialArticle['kind']) => articles.filter(article => article.kind === kind)
export const getV3Editorial = (kind: V3EditorialArticle['kind'], slug: string) => articles.find(article => article.kind === kind && article.slug === slug)
export const allV3EditorialTags = () => [...new Set(articles.filter(article => article.kind === 'blog').flatMap(article => article.tags))]
