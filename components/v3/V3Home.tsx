import type { Metadata } from 'next'
import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Arrow } from '@/components/v3/Arrow'
import { LandingMotion } from '@/components/v3/LandingMotion'
import { HomeFaq } from '@/components/v3/HomeFaq'
import { seo } from '@/lib/seo'
import { getDictionary } from '@/dictionaries'
import { homeAlternates, languages, type Language } from '@/lib/languages'
import { ApprovedLanding } from '@/components/v3/approved-landing/ApprovedLanding'
import '@/components/v3/approved-landing/approved-landing.css'
import '@/components/v3/approved-landing/difficulty-impact.css'
import './home.css'

export async function homeMetadata(language: Language): Promise<Metadata> {
  const { landing: copy } = await getDictionary(language)
  const metadata = seo({
    title: copy.homeTitle,
    description: copy.homeDescription,
    path: language === 'en' ? '/' : languages[language].path,
    absoluteTitle: true,
  })
  return {
    ...metadata,
    alternates: { ...metadata.alternates, languages: homeAlternates },
    openGraph: { ...metadata.openGraph, locale: languages[language].openGraph },
    robots: { index: false, follow: false },
  }
}

export async function V3Home({ language = 'en' }: { language?: Language }) {
  const { landing: copy, faq, howItWorks } = await getDictionary(language)
  return <LandingMotion>
    <ApprovedLanding copy={copy} howItWorks={howItWorks} language={language} />

    <section id="faq" aria-labelledby="faq-title" className="v37-faq v37-section">
      <Container className="v37-faq-grid">
        <div data-reveal><p className="v37-eyebrow">{copy.commonQuestions}</p><h2 id="faq-title" className="v37-heading">{copy.questionsAbout}<br />{copy.usingDoefin}</h2><p className="v37-copy v37-faq-intro">{copy.faqIntro}</p><Link href="/docs" className="v37-link">{copy.browseTheDocs}{' '}<Arrow /></Link><Link href="/resources" data-v3-cta="resources" data-v3-placement="faq" className="v37-link">{copy.browseTheLearningResources}{' '}<Arrow /></Link><Link href="/resources#updates" data-v3-cta="contact" data-v3-placement="faq" className="v37-link">{copy.askTheTeamAQuestion}{' '}<Arrow /></Link></div>
        <div data-reveal><HomeFaq localizedQuestions={language === 'en' ? undefined : faq} /></div>
      </Container>
    </section>
  </LandingMotion>
}
