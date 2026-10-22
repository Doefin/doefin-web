import { ContentPage } from './ContentPage'

export const metadata = { title: 'Prototype privacy | Doefin', description: 'How the local Doefin prototype handles form inputs and review events.' }

export default function V3Privacy() {
  return <ContentPage title="Privacy in this prototype" summary="Forms demonstrate a journey. They do not create subscriptions or send email." eyebrow="Prototype notice" crumbs={[{ name: 'Privacy', href: '/v3/privacy' }]}>
    <div className="space-y-7 text-sm leading-relaxed text-subtle">
      <section><h2 className="text-lg font-bold text-body">Form and calculator inputs</h2><p className="mt-3">Newsletter roles, company details, email addresses, preferences and scenario notes stay in the current page state. Demo confirmation does not send them to an email provider or save them as a subscriber or lead. Calculator inputs may be encoded in a shareable scenario URL when you choose that action. Review the URL before sharing it; its recipient can read those inputs.</p></section>
      <section><h2 className="text-lg font-bold text-body">Optional local review</h2><p className="mt-3">Normal browsing does not activate visitor analytics. The internal prototype-review page can enable a local log of up to 100 allowed interaction labels in this browser tab. It excludes names, emails, organisations, wallets, calculator values, results and full URLs. It uses session storage without a visitor identifier. Stop clears it; closing the tab ends the session. A QA build can also emit these labels locally for inspection. There is no connected analytics collector.</p></section>
      <section><h2 className="text-lg font-bold text-body">Downloads and external links</h2><p className="mt-3">Downloaded briefs and datasets are saved on your device when you request them. A mail link opens your email application; sending from that application is your action. External app, data-provider and source links have their own privacy practices. Public network data requests do not include form or scenario values.</p></section>
      <section><h2 className="text-lg font-bold text-body">Before a live launch</h2><p className="mt-3">This notice describes the prototype and is not a substitute for the final policy. An operating service needs an approved provider, purposes and lawful basis, retention and deletion rules, access controls, unsubscribe handling and a contact for data requests. Those decisions must be reflected in both the implementation and the published notice before collecting personal data.</p></section>
    </div>
  </ContentPage>
}
