import styles from './HeroVisual.module.css'

export function HeroVisual() {
  return (
    <figure className={styles.figure} aria-labelledby="doefin-rule-caption" data-hero-rule>
      <figcaption className={styles.caption} id="doefin-rule-caption">
        <span>Illustrative market rule</span>
        <span className={styles.unit}>T = trillion</span>
      </figcaption>

      <div className={styles.diagram}>
        {/* Labels remain HTML; the vector describes only their connections. */}
        <svg className={styles.desktopVector} viewBox="0 0 440 268" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="doefin-rule-plane" x1="176" y1="85" x2="280" y2="216" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3475FE" stopOpacity="0.13" />
              <stop offset="1" stopColor="#7147FF" stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id="doefin-rule-block" x1="45" y1="88" x2="92" y2="133" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3475FE" stopOpacity="0.38" />
              <stop offset="1" stopColor="#5B73E8" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* The observed block feeds one comparison, which has two branches. */}
          <path d="m68 76 30 17v35l-30 17-30-17V93l30-17Z" fill="#3475FE" fillOpacity="0.035" stroke="#3475FE" strokeOpacity="0.14" />
          <path d="m68 86 21 12v25l-21 12-21-12V98l21-12Z" fill="url(#doefin-rule-block)" />
          <g className={styles.observationStroke} stroke="#8AB5FF" strokeWidth="1.2" strokeLinejoin="round">
            <path d="m68 86 21 12v25l-21 12-21-12V98l21-12Z" />
            <path d="m47 98 21 12 21-12m-21 12v25m-10-43 21 12" strokeOpacity="0.65" />
          </g>
          <path d="M98 110h30c9 0 14 5 14 14v4c0 9 5 14 14 14h15m-5-4 5 4-5 4" stroke="#7795D4" strokeOpacity="0.65" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

          <g stroke="#5B73E8" strokeOpacity="0.14">
            <path d="m232 70 72 72-72 72-72-72 72-72Z" />
            <path d="m232 60 82 82-82 82-82-82 82-82Z" />
            <path d="m177 203 55 32 55-32M185 215l47 27 47-27" />
          </g>
          <path d="m232 82 60 60-60 60-60-60 60-60Z" fill="url(#doefin-rule-plane)" stroke="#5B73E8" strokeOpacity="0.6" />
          <path className={styles.thresholdStroke} d="M191 162h82" stroke="#CCEAFB" strokeWidth="1.3" strokeDasharray="3 4" />
          <circle cx="232" cy="162" r="3" fill="#CCEAFB" fillOpacity="0.75" />

          <path d="M292 142h10c8 0 12-4 12-12V91c0-8 4-12 12-12h9" stroke="#5E91FF" strokeOpacity="0.57" strokeWidth="1.2" />
          <path d="M292 142h10c8 0 12 4 12 12v39c0 8 4 12 12 12h9" stroke="#9B82F1" strokeOpacity="0.57" strokeWidth="1.2" />
          <path className={styles.branchTrace} d="M292 142h10c8 0 12-4 12-12V91c0-8 4-12 12-12h9" pathLength="1" stroke="#94BCFF" strokeWidth="1.5" />
          <path className={styles.branchTrace} d="M292 142h10c8 0 12 4 12 12v39c0 8 4 12 12 12h9" pathLength="1" stroke="#B5A3F5" strokeWidth="1.5" />
          <circle cx="335" cy="79" r="3" fill="#5E91FF" />
          <circle cx="335" cy="205" r="3" fill="#9B82F1" />
        </svg>

        {/* Mobile uses a short horizontal comparison, then a shared lower fork. */}
        <svg className={styles.mobileVector} viewBox="0 0 320 170" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
          <path d="M14 78h89M15 83h65" stroke="#3475FE" strokeOpacity="0.14" />
          <path className={styles.observationStroke} d="M20 73h95" stroke="#8AB5FF" strokeWidth="1.2" />
          <path d="M126 52h37m-5-4 5 4-5 4" stroke="#7795D4" strokeOpacity="0.75" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M182 78h118M200 83h98" stroke="#7147FF" strokeOpacity="0.14" />
          <path className={styles.thresholdStroke} d="M191 73h97" stroke="#CCEAFB" strokeWidth="1.3" strokeDasharray="3 4" />
          <circle cx="240" cy="73" r="2.5" fill="#CCEAFB" />
          <path d="M240 79v10c0 7-4 11-11 11H91c-7 0-11 4-11 11v6" stroke="#5E91FF" strokeOpacity="0.57" strokeWidth="1.2" />
          <path d="M240 79v38" stroke="#9B82F1" strokeOpacity="0.57" strokeWidth="1.2" />
          <path className={styles.branchTrace} d="M240 79v10c0 7-4 11-11 11H91c-7 0-11 4-11 11v6" pathLength="1" stroke="#94BCFF" strokeWidth="1.5" />
          <path className={styles.branchTrace} d="M240 79v38" pathLength="1" stroke="#B5A3F5" strokeWidth="1.5" />
          <circle cx="80" cy="117" r="2.5" fill="#5E91FF" />
          <circle cx="240" cy="117" r="2.5" fill="#9B82F1" />
        </svg>

        <p className={styles.observation}>
          <span className={styles.label}>At Bitcoin block</span>
          <strong className={styles.value}>979,776</strong>
        </p>
        <p className={styles.comparison}>
          <span className={styles.label}>Difficulty at or above</span>
          <strong className={styles.value}>137.2T?</strong>
        </p>
        <dl className={styles.outcomes}>
          <div className={styles.above}>
            <dt>At or above</dt>
            <dd>Yes wins</dd>
          </div>
          <div className={styles.below}>
            <dt>Below</dt>
            <dd>No wins</dd>
          </div>
        </dl>
      </div>
    </figure>
  )
}
