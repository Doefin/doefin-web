import Image from 'next/image'
import { Arrow } from '../Arrow'
import styles from './LandingTeam.module.css'

const team = [
  {
    name: 'Matteo Spinosa',
    role: 'Founder and CEO',
    description: '18 years of institutional and TradFi in tier 1 banks. Finance Degree at Bocconi University (Milan).',
    portrait: 'matteo-spinosa.webp',
  },
  {
    name: 'Reza Jahankohan',
    role: 'Software engineer',
    description: 'Experienced software engineer with over 10 years of expertise, including 5 in blockchain; strong background in backend development across industries such as gaming, fintech, security, and AI.',
    portrait: 'reza-jahankohan.webp',
  },
  {
    name: 'Fardin Vahdat',
    role: 'Frontend engineer',
    description: '8+ years building Web3 interfaces. Focuses on wallet and smart contract integrations for DeFi, with an emphasis on performance and security.',
    portrait: 'fardin-vahdat.webp',
  },
  {
    name: 'Eamonn Gashier',
    role: 'Derivatives consultant',
    description: 'Following 15 years in Derivatives trading started career in DeFi: Founder of Block Scholes. Member of the UCL Centre for Blockchchain Technologies.',
    portrait: 'eamonn-gashier.webp',
  },
  {
    name: 'Raffaella Tenconi',
    role: 'Regulatory and policy adviser',
    description: 'Member of the Bretton Woods Committee in the Digital Finance working group, 21 years experience as economist. Msc Global Market Economics at The London School of Economics.',
    portrait: 'raffaella-tenconi.webp',
  },
  {
    name: 'Block Scholes',
    role: 'Technology consultant',
    description: 'Institutional-grade analytics, data & research platform.',
    portrait: 'block-scholes.webp',
  },
  {
    name: 'Ataf Ahmed',
    role: 'Adviser',
    description: 'CEO of Graphene Investments, a Web3, blockchain & crypto focused company. Experience in private equity and asset management. PhD from the University of Cambridge.',
    portrait: 'ataf-ahmed.webp',
  },
  {
    name: 'Dariia Vasylieva',
    role: 'Adviser',
    description: 'Founder of FD Capital & GetVision. Co-Founder EWA Accelerator. Ex COO/CIO First Stage Labs (TON)',
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
