import type { LandingCopy } from '@/dictionaries'
import Image from 'next/image'
import styles from './LandingTrust.module.css'

const investors = [
  { name: 'Further', file: 'further.webp', width: 377, height: 65 },
  { name: 'Tether', file: 'tether.webp', width: 441, height: 136 },
  { name: 'Fulgur Ventures', file: 'fulgur-ventures.webp', width: 107, height: 41 },
  { name: 'Axiom', file: 'axiom.webp', width: 388, height: 129 },
  { name: 'Barefoot Mining', file: 'barefoot-mining.webp', width: 512, height: 91 },
]

export function LandingTrust({ copy }: { copy: LandingCopy }) {
  const testimonials = [
    {
      quote: copy.theProductIsSimpleAnd,
      name: 'Kevin Hojnik',
      role: copy.headOfBdAtNicehash,
    },
    {
      quote: copy.asAMinerIThink,
      name: 'Robert Luft',
      role: copy.founderOfPotentiaDigital,
    },
  ]
  return (
    <section id="trust" className={styles.section} aria-labelledby="trust-investors-heading">
      <h2 id="trust-investors-heading" className={styles.heading}>{copy.backedBy}</h2>
      <ul className={styles.logos} role="list">
        {investors.map(({ name, file, width, height }) => (
          <li key={name} className={styles.logo}>
            <Image
              src={'/images/v3/approved-landing/investors/' + file}
              alt={name}
              width={width}
              height={height}
              loading="lazy"
              unoptimized
            />
          </li>
        ))}
      </ul>

      <h3 className={styles.subheading}>{copy.whatUsersSay}</h3>
      <div className={styles.quotes}>
        {testimonials.map(({ quote, name, role }) => (
          <figure key={name} className={styles.quote}>
            <blockquote><p>“{quote}”</p></blockquote>
            <figcaption>
              <strong>{name}</strong>
              <span>{role}</span>
              {copy.translatedQuote && <small>{copy.translatedQuote}</small>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
