import Image from 'next/image'
import { Arrow } from '../Arrow'
import styles from './LandingTeam.module.css'

const team = [
  {
    name: 'Matteo Spinosa',
    role: 'Founder and CEO',
    description: 'Spent 18 years in institutional finance and holds a finance degree from Bocconi University.',
    portrait: 'matteo-spinosa.webp',
  },
  {
    name: 'Eamonn Gashier',
    role: 'Derivatives consultant',
    description: 'Founded Block Scholes after 15 years in derivatives trading.',
    portrait: 'eamonn-gashier.webp',
  },
  {
    name: 'Reza Jahankohan',
    role: 'Software engineer',
    description: 'Builds backend and blockchain software, with experience in fintech and security.',
    portrait: 'reza-jahankohan.webp',
  },
  {
    name: 'Dusan Sekulic',
    role: 'Backend developer',
    description: 'Develops and maintains the services behind Doefin.',
    initials: 'DS',
  },
  {
    name: 'Fardin Vahdat',
    role: 'Frontend engineer',
    description: 'Builds trading interfaces and connects them to wallets and smart contracts.',
    portrait: 'fardin-vahdat.webp',
  },
  {
    name: 'Raffaella Tenconi',
    role: 'Regulatory and policy adviser',
    description: 'Economist with experience in digital finance. Holds a master’s degree from the London School of Economics.',
    portrait: 'raffaella-tenconi.webp',
  },
  {
    name: 'Block Scholes',
    role: 'Technology consultant',
    description: 'Provides research, data and analytics for digital asset markets.',
    portrait: 'block-scholes.webp',
  },
  {
    name: 'Ataf Ahmed',
    role: 'Adviser',
    description: 'Has worked in private equity and asset management and holds a PhD from the University of Cambridge.',
    portrait: 'ataf-ahmed.webp',
  },
  {
    name: 'Dariia Vasylieva',
    role: 'Adviser',
    description: 'Founded FD Capital and GetVision. Previously COO and CIO at First Stage Labs.',
    portrait: 'dariia-vasylieva.webp',
  },
]

export function LandingTeam() {
  return (
    <section className={`team-section team-carousel ${styles.section}`} id="team" aria-labelledby="team-title" aria-roledescription="carousel">
      <div className={styles.header}>
        <h2 className={styles.heading} id="team-title">Meet the team</h2>
        <div className={`team-navigation ${styles.controls}`} role="group" aria-label="Team carousel controls" hidden>
          <button className={styles.control} type="button" data-team-direction="-1" aria-label="Previous profile" aria-controls="team-profiles">
            <Arrow className="rotate-180" />
          </button>
          <button className={styles.control} type="button" data-team-direction="1" aria-label="Next profile" aria-controls="team-profiles">
            <Arrow />
          </button>
        </div>
      </div>
      <div className={`team-window ${styles.viewport}`} id="team-profiles" role="group" tabIndex={0} aria-label="Team profiles">
        <ul className={`team-track ${styles.track}`} role="list">
          {team.map(member => (
            <li className={styles.card} key={member.name}>
              {member.portrait ? (
                <Image
                  alt=""
                  className={styles.portrait}
                  src={`/images/v3/team/${member.portrait}`}
                  width={256}
                  height={256}
                  loading="lazy"
                  unoptimized
                />
              ) : (
                <span className={styles.portrait} aria-hidden="true">{member.initials}</span>
              )}
              <div>
                <h3 className={styles.name}>{member.name}</h3>
                <p className={styles.role}>{member.role}</p>
              </div>
              <p className={styles.description}>{member.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
