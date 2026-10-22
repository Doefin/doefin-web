/** Editorial concepts, not plotted data or forecasts. All labels remain HTML text. */
export function EditorialCover({ kind, compact = false }: { kind: 'assumptions' | 'windows' | 'general'; compact?: boolean }) {
  if (compact && kind !== 'general') return <figure aria-label={kind === 'assumptions' ? 'Concept illustration: comparing alternative difficulty assumptions' : 'Concept illustration: shorter and longer observation windows'} className="flex h-full flex-col overflow-hidden bg-gradient-to-br from-surfaceAlt to-ink px-3 py-3">
    <figcaption className="text-[10px] font-semibold uppercase tracking-[0.1em] text-highlight">Concept / {kind === 'assumptions' ? 'Alternative assumptions' : 'Observation windows'}</figcaption>
    <svg aria-hidden="true" viewBox="0 0 480 110" preserveAspectRatio="xMidYMid meet" fill="none" className="mt-2 min-h-[64px] w-full flex-1 text-chart">
      {kind === 'assumptions' ? <>
        <path d="M20 90C80 90 110 60 160 60S300 30 452 10" stroke="currentColor" strokeWidth="3" className="text-highlight" />
        <path d="M20 90C80 90 110 60 160 60S320 60 452 50" stroke="currentColor" strokeWidth="3" />
        <path d="M20 90C80 90 110 60 160 60S310 85 452 100" stroke="currentColor" strokeWidth="3" strokeDasharray="7 7" className="text-brandDeep" />
        <circle cx="160" cy="60" r="6" fill="currentColor" className="text-highlight" />
        {[10, 50, 100].map((y, i) => <circle key={y} cx="452" cy={y} r="4" fill="currentColor" className={i === 0 ? 'text-highlight' : i === 1 ? 'text-chart' : 'text-brandDeep'} />)}
      </> : <>
        <rect x="20" y="5" width="432" height="38" rx="8" stroke="currentColor" strokeOpacity="0.4" fill="currentColor" fillOpacity="0.04" />
        <rect x="298" y="5" width="154" height="38" rx="8" stroke="currentColor" fill="currentColor" fillOpacity="0.15" />
        {[42, 80, 124, 161, 204, 248, 311, 348, 392, 436].map((x, i) => <path key={x} d={`M${x} 15V33`} stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={i > 5 ? 'text-highlight' : 'text-chart'} />)}
        <path d="M298 57V68H452V57M20 83V97H452V83" stroke="currentColor" strokeWidth="1.5" />
      </>}
    </svg>
  </figure>
  if (kind === 'general') return <figure aria-label="Abstract editorial illustration" className={"flex h-full items-center justify-between gap-4 bg-gradient-to-br from-surfaceAlt to-ink " + (compact ? "p-3" : "p-5")}><div><p className="text-[10px] font-bold uppercase tracking-wider text-highlight">Doefin / Reading note</p><p className="mt-2 text-xs text-subtle">Ideas, context and assumptions.</p></div><svg aria-hidden="true" viewBox="0 0 100 100" fill="none" className={(compact ? "h-16 w-16" : "h-24 w-24") + " shrink-0 text-chart"}><path d="M28 14h50v66H28z" stroke="currentColor" strokeOpacity="0.4" /><path d="M18 24h50v66H18z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" /><path d="M28 40h30m-30 12h30m-30 12h20" stroke="currentColor" strokeWidth="2" className="text-highlight" /></svg></figure>
  const assumptions = kind === 'assumptions'
  return <figure aria-label={assumptions ? 'Concept illustration: comparing alternative difficulty assumptions' : 'Concept illustration: selecting different observation windows'} className={'relative isolate flex h-full flex-col justify-between overflow-hidden bg-gradient-to-br px-5 py-5 sm:px-7 sm:py-6 ' + (assumptions ? 'from-active/70 via-surfaceAlt to-ink' : 'from-surfaceAlt via-ink to-surface')}>
    <figcaption className="relative z-10 flex items-center justify-between gap-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-highlight"><span>{assumptions ? 'Alternative assumptions' : 'Observation windows'}</span><span className="font-normal tracking-normal text-subtle">Concept illustration</span></figcaption>
    {assumptions ? <>
      <svg aria-hidden="true" viewBox="0 0 480 250" preserveAspectRatio="none" fill="none" className="my-1 min-h-0 w-full flex-1 text-chart">
        {[50, 100, 150, 200].map(y => <path key={y} d={`M24 ${y}H456`} stroke="currentColor" strokeOpacity="0.12" />)}
        {[96, 192, 288, 384].map(x => <path key={x} d={`M${x} 25V225`} stroke="currentColor" strokeOpacity="0.1" />)}
        <path d="M28 190C88 190 105 160 153 150S220 103 260 100 340 50 452 30" stroke="currentColor" strokeWidth="3" className="text-highlight" />
        <path d="M28 190C88 190 105 160 153 150S232 139 280 127 376 111 452 95" stroke="currentColor" strokeWidth="3" className="text-chart" />
        <path d="M28 190C88 190 105 160 153 150S237 170 288 181 392 198 452 213" stroke="currentColor" strokeWidth="3" strokeDasharray="7 7" className="text-brandDeep" />
        <circle cx="153" cy="150" r="8" fill="currentColor" className="text-highlight" /><circle cx="153" cy="150" r="19" stroke="currentColor" strokeOpacity="0.3" className="text-highlight" />
        {[30, 95, 213].map((y, i) => <circle key={y} cx="452" cy={y} r="5" fill="currentColor" className={i === 0 ? 'text-highlight' : i === 1 ? 'text-chart' : 'text-brandDeep'} />)}
      </svg>
      <p className="relative text-xs leading-relaxed text-subtle">One starting point. Different paths to compare.</p>
    </> : <>
      <svg aria-hidden="true" viewBox="0 0 480 250" preserveAspectRatio="none" fill="none" className="my-1 min-h-0 w-full flex-1 text-chart">
        <rect x="34" y="52" width="412" height="64" rx="12" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.2" />
        <rect x="280" y="52" width="166" height="64" rx="12" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeOpacity="0.8" />
        {[60, 98, 143, 175, 215, 252, 294, 322, 370, 419].map((x, i) => <g key={x}><path d={`M${x} 72V96`} stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={i > 5 ? 'text-highlight' : 'text-chart/50'} /><circle cx={x} cy="84" r="3" fill="currentColor" /></g>)}
        <path d="M288 135V147H438V135M42 175V191H438V175" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M36 219H444" stroke="currentColor" strokeOpacity="0.15" />
        {[60, 98, 143, 175, 215, 252, 294, 322, 370, 419].map(x => <path key={x} d={`M${x} 214V224`} stroke="currentColor" strokeOpacity="0.35" />)}
      </svg>
      <p className="relative flex flex-wrap gap-x-5 gap-y-1 text-xs leading-relaxed text-subtle"><span><span aria-hidden className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-highlight" />Shorter window</span><span><span aria-hidden className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-chart" />Longer window</span></p>
    </>}
  </figure>
}
