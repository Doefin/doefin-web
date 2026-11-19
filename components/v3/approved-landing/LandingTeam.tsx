import Image from 'next/image'
import { Arrow } from '../Arrow'
import styles from './LandingTeam.module.css'

const team = [
  {
    name: 'Matteo Spinosa',
    role: 'Founder and CEO',
    description: '20 years in investment banking, specialising in derivatives structuring and financing. Previously at JPMorgan, Bank of America Merrill Lynch and Nomura.',
    portrait: 'matteo-spinosa.webp',
  },
  {
    name: 'Reza Jahankohan',
    role: 'CTO',
    description: 'Software engineer with 12 years of expertise. Background in blockchain and backend development across fintech, AI and gaming.',
    portrait: 'reza-jahankohan.webp',
  },
  {
    name: 'Fardin Vahdat',
    role: 'Frontend engineer',
    description: '8+ years building Web3 interfaces. Focuses on wallet and smart contract integrations for DeFi, with an emphasis on performance and security.',
    portrait: 'fardin-vahdat.webp',
  },
  {
    name: 'Dusan Sekulic',
    role: 'Backend developer',
    description: '15+ years in software engineering, specialising in Bitcoin infrastructure, blockchain protocols and scalable backend systems.',
    portrait: 'dusan-sekulic.jpg',
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
              <Image
                alt=""
                className={styles.portrait}
                src={`/images/v3/team/${member.portrait}`}
                width={256}
                height={256}
                loading="lazy"
                unoptimized
              />
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
