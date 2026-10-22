import { V4Image } from './V4Image';
export function ViewComparison() {
  return <figure className="position-view" aria-labelledby="position-view-title">
    <figcaption id="position-view-title">For the example market at block <strong>979,776</strong></figcaption>
    <V4Image src="/v4/assets/view-to-position.png" width="1586" height="992" alt="Your view maps to a position: if you expect difficulty at or above 137.2 T, the matching side is YES. If you expect difficulty below 137.2 T, the matching side is NO." loading="lazy" />
    <p className="position-view-message">A position expresses your view on the market’s question.</p>
    <p className="position-view-note">Illustrative example · Not a recommendation</p>
  </figure>;
}
