import { getForecastReport } from '@/content'

export const dynamic = 'force-static'

export function GET() {
  const report = getForecastReport()
  const csv = [
    'classification,prepared_at,sample,forecast_change_pct,example_outcome_pct,absolute_error_pp',
    ...report.rows.map(row => [
      'synthetic_not_historical', report.publishedAt, row.sample, row.forecast.toFixed(1),
      row.observed.toFixed(1), Math.abs(row.observed - row.forecast).toFixed(1),
    ].join(',')),
  ].join('\r\n') + '\r\n'
  return new Response(csv, { headers: {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': 'attachment; filename="doefin-synthetic-forecast-sample.csv"',
    'X-Robots-Tag': 'noindex, nofollow',
  } })
}
