export type InstitutionsReviewLink =
  | { label: string; href: string; contactSubject?: never }
  | { label: string; href?: never; contactSubject: string }

export type InstitutionsReviewCard = {
  title: string
  summary: string
  disclosureSummary: string
  disclosureParagraphs: string[]
  links: InstitutionsReviewLink[]
}

export type InstitutionsReview = {
  visible: boolean
  eyebrow: string
  heading: string
  intro: string
  riskNote: string
  cards: InstitutionsReviewCard[]
  stripHeading: string
  stripText: string
  stripLabel: string
  stripSubject: string
}
