# V4 landing release

V4 publishes the reviewed visual landing at `/v4`: one observation block and two outcomes in the hero, an interactive YES/NO walkthrough, illustrated mining/trading use cases, historical product capture, FAQ and product-updates preview.

## Routing and rendering

- `/v4` is a statically prerendered Next.js page with complete HTML, one primary heading and canonical `https://doefin.com/v4`.
- Like the other comparison versions, V4 is `noindex, nofollow` and is not added to the indexable sitemap.
- The existing root redirect and V1–V3 routes remain. Version navigation now includes V4. Documentation, audience guides and legal links use the existing V3 pages.
- V4 owns its header/footer and scoped CSS. Legacy Tailwind's `outline` utility is neutralized only for the V4 outline-button variant; focus-visible styling remains.
- Reviewed imagery is stored under `public/v4/assets/` and served responsively through `next/image`. The small historical JPEG remains exact. The V4 font and palette are scoped to preserve the reviewed prototype without changing existing pages.

## Interaction and content boundaries

- All four YES/NO and above/below combinations preserve the illustrative 60-unit cost, 100-unit winning payout and full losing cost; examples are not live quotes.
- Mobile navigation/Escape, reset, FAQ disclosures and historical screenshot dialog are functional.
- Newsletter is explicitly a preview. Native email validation and local confirmation work; no email delivery, API call or persistence was added.
- No authentication, wallet or trading action was added.

## Validation

- TypeScript and production build passed; `/v4` is marked static.
- Crawlability guard passed, including V4's 808 words of HTML.
- SEO checks passed across 162 rendered pages.
- Tool-content and internal-link checks passed; the link check retains ten warnings in unchanged editorial content.
- Browser checks at desktop and mobile covered the four outcomes, reset, navigation, FAQ, dialog and signup preview. Images loaded and no console errors were observed.

The integration was prepared from main `dfb91fb06295c7cd2a9cb7ef30053c8089144160`. Rollback is a normal revert of this V4 release commit; no data migration or external service configuration is involved. Deployment completion is verified separately from local checks.
