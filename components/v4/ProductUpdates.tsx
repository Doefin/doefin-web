import { V4Image } from './V4Image';
import { useState } from 'react';
import { ArrowRight, ArrowUpRight, CheckCircle, EnvelopeSimple, GearSix, Lightning } from '@phosphor-icons/react';

export function ProductUpdates() {
  const [previewed, setPreviewed] = useState(false);
  return <section className="updates updates-redesign section" id="product-updates" aria-labelledby="updates-title">
    <div className="container updates-grid">
      <div className="updates-copy">
        <p className="eyebrow"><EnvelopeSimple size={16} aria-hidden="true" />Stay informed</p>
        <h2 id="updates-title">Get Doefin<br /><span>product updates.</span></h2>
        <p className="updates-description">New features and app improvements, delivered to your inbox.</p>
        <ul className="updates-topics" aria-label="What the updates cover">
          <li><Lightning size={18} aria-hidden="true" />New features</li>
          <li><GearSix size={18} aria-hidden="true" />App improvements</li>
        </ul>
        <form className="updates-form" onSubmit={event => { event.preventDefault(); setPreviewed(true); }}>
          <label htmlFor="email">Email address</label>
          <div className="email-row">
            <input id="email" name="email" type="email" autoComplete="off" placeholder="you@example.com" required aria-describedby="email-preview-note" onChange={() => setPreviewed(false)} />
            <button className="button primary" type="submit">{previewed ? 'Preview complete' : 'Preview subscription'}{previewed ? <CheckCircle size={19} aria-hidden="true" /> : <ArrowRight size={19} aria-hidden="true" />}</button>
          </div>
          <a className="privacy-link" href="/v3/privacy">Privacy policy<ArrowUpRight size={12} aria-hidden="true" /></a>
          <p className={`preview-message ${previewed ? 'is-previewed' : ''}`} id="email-preview-note" role="status">{previewed ? 'Preview complete. No email was submitted or saved.' : 'Form preview only. No email is submitted or saved.'}</p>
        </form>
      </div>
      <figure className="updates-art"><V4Image src="/v4/assets/product-updates-envelope.png" width="1254" height="1254" alt="An open cobalt glass envelope with a Product updates message." loading="lazy" /></figure>
    </div>
  </section>;
}
