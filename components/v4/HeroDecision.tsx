import { V4Image } from './V4Image';
export function HeroDecision() {
  return <figure className="hero-art hero-decision" aria-labelledby="hero-decision-title">
    <div className="decision-heading">
      <p className="decision-kicker">One block. Two outcomes.</p>
      <p className="decision-block">At block <strong>979,776</strong></p>
      <h2 id="hero-decision-title">Difficulty at least <span>137.2 T?</span></h2>
    </div>
    <V4Image src="/v4/assets/hero-decision.png" width="1661" height="947" alt="One Bitcoin observation block connects to a green YES token and a coral NO token." fetchPriority="high" />
    <figcaption className="decision-outcomes">
      <div><span>At or above 137.2 T</span><strong>YES wins</strong></div>
      <div><span>Below 137.2 T</span><strong>NO wins</strong></div>
    </figcaption>
    <p className="decision-note">Illustrative market rule · T = trillion</p>
  </figure>;
}
