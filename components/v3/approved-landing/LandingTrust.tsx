import Image from 'next/image'
import styles from './LandingTrust.module.css'

const investors = [
  { name: 'Further', file: 'further.webp', width: 377, height: 65 },
  { name: 'Tether', file: 'tether.webp', width: 441, height: 136 },
  { name: 'Fulgur Ventures', file: 'fulgur-ventures.webp', width: 107, height: 41 },
  { name: 'Axiom', file: 'axiom.webp', width: 388, height: 129 },
  { name: 'Barefoot Mining', file: 'barefoot-mining.webp', width: 512, height: 91 },
]

const testimonials = [
  {
    quote: 'The product is simple and intuitive. I can see the market, take a view on network hashrate and trade in a few clicks.',
    name: 'Kevin Hojnik',
    role: 'Head of BD at NiceHash',
  },
  {
    quote: 'As a miner, I think about network difficulty every day. This tool gives me a way to hedge and trade that risk instead of just accepting it.',
    name: 'Robert Luft',
    role: 'Founder of Potentia Digital',
  },
]

export function LandingTrust() {
  return (
    <section id="trust" className={styles.section} aria-labelledby="trust-investors-heading">
      <h2 id="trust-investors-heading" className={styles.heading}>Backed by investors</h2>
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

      <h3 className={styles.subheading}>What users say</h3>
      <div className={styles.quotes}>
        {testimonials.map(({ quote, name, role }) => (
          <figure key={name} className={styles.quote}>
            <blockquote><p>“{quote}”</p></blockquote>
            <figcaption>
              <strong>{name}</strong>
              <span>{role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
