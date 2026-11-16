import Image from 'next/image'
import styles from './LandingTeam.module.css'

const team = [
  { name: 'Matteo Spinosa', role: 'Founder and CEO', portrait: 'matteo-spinosa.webp' },
  { name: 'Reza Jahankohan', role: 'Software engineer', portrait: 'reza-jahankohan.webp' },
  { name: 'Fardin Vahdat', role: 'Frontend engineer', portrait: 'fardin-vahdat.webp' },
  { name: 'Dusan Sekulic', role: 'Backend developer', initials: 'DS' },
]

export function LandingTeam() {
  return (
    <section className={`team-section ${styles.section}`} id="team" aria-labelledby="team-title">
      <h2 className={styles.heading} id="team-title">Meet the team</h2>
      <ul className={styles.grid} role="list">
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
          </li>
        ))}
      </ul>
    </section>
  )
}
