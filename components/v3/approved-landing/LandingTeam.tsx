import type { LandingCopy } from '@/dictionaries'
import Image from 'next/image'
import { Arrow } from '../Arrow'
import styles from './LandingTeam.module.css'

export function LandingTeam({ copy }: { copy: LandingCopy }) {
  const team = [
    {
      name: 'Matteo Spinosa',
      role: copy.founderAndCeo,
      description: copy.matteoBio,
      portrait: 'matteo-spinosa.webp',
    },
    {
      name: 'Reza Jahankohan',
      role: copy.softwareEngineer,
      description: copy.experiencedSoftwareEngineerWithOver,
      portrait: 'reza-jahankohan.webp',
    },
    {
      name: 'Fardin Vahdat',
      role: copy.frontendEngineer,
      description: copy.fardinBio,
      portrait: 'fardin-vahdat.webp',
    },
    {
      name: 'Dusan Sekulic',
      role: copy.backendDeveloper,
      description: copy.dusanBio,
      portrait: 'dusan-sekulic.jpg',
    },
    {
      name: 'Eamonn Gashier',
      role: copy.derivativesConsultant,
      description: copy.following15YearsInDerivatives,
      portrait: 'eamonn-gashier.webp',
    },
    {
      name: 'Raffaella Tenconi',
      role: copy.regulatoryAndPolicyAdviser,
      description: copy.memberOfTheBrettonWoods,
      portrait: 'raffaella-tenconi.webp',
    },
    {
      name: 'Block Scholes',
      role: copy.technologyConsultant,
      description: copy.institutionalGradeAnalyticsDataResearch,
      portrait: 'block-scholes.webp',
    },
    {
      name: 'Ataf Ahmed',
      role: copy.adviser,
      description: copy.ceoOfGrapheneInvestmentsA,
      portrait: 'ataf-ahmed.webp',
    },
    {
      name: 'Dariia Vasylieva',
      role: copy.adviser,
      description: copy.founderOfFdCapitalGetvision,
      portrait: 'dariia-vasylieva.webp',
    },
  ]
  return (
    <section className={`team-section team-carousel ${styles.section}`} id="team" aria-labelledby="team-title" aria-roledescription={copy.carousel}>
      <div className={styles.header}>
        <h2 className={styles.heading} id="team-title">{copy.meetTheTeam}</h2>
        <div className={`team-navigation ${styles.controls}`} role="group" aria-label={copy.teamCarouselControls} hidden>
          <button className={styles.control} type="button" data-team-direction="-1" aria-label={copy.previousProfile} aria-controls="team-profiles">
            <Arrow className="rotate-180" />
          </button>
          <button className={styles.control} type="button" data-team-direction="1" aria-label={copy.nextProfile} aria-controls="team-profiles">
            <Arrow />
          </button>
        </div>
      </div>
      <div className={`team-window ${styles.viewport}`} id="team-profiles" role="group" tabIndex={0} aria-label={copy.teamProfiles}>
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
