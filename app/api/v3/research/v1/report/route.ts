import { researchReportHtml } from '@/lib/research-data'
export const dynamic = 'force-static'
export function GET() { return new Response(researchReportHtml(), { headers: { 'X-Robots-Tag': 'noindex, nofollow', 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'" } }) }
