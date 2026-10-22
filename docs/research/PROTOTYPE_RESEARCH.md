# Research prototype and evidence boundary

The prototype has three separate surfaces: 25 observed network changes from a frozen public-source capture, existing synthetic forecast/epoch examples, and an empty prospective forecast archive. Never add these counts together. A real observed dataset does not establish published forecast performance.

## Public formats

- `/v3/research/observed-difficulty-adjustments`: full findings and method.
- `/api/v3/research/v1`: version, provenance, exact source/distribution digests, citation metadata and limitations.
- `/api/v3/research/v1/dataset?format=csv` or `format=json`: all 25 included observations, without email or API-key gates.
- `/api/v3/research/v1/report`: printable complete HTML report.
- `/api/v3/research/v1/source`: exact captured provider response bytes, with SHA-256 response header.
- `/api/v3/research/v1/forecasts`: prospective-publication status. No records are currently supplied.

These are frozen v1 research formats, not live market-data endpoints. Email previews can link to them without restricting findings. DOI metadata is prepared for a later deposit; no DOI is invented, registered or submitted.

## Source capture and reproduction

`content/research-archive/v1.json` retains the mempool.space one-year response captured 22 October 2026, exact raw-response SHA-256, source URL/time, all derived rows and matching first/last boundary-block metadata captures. Data fields are documented by the publisher's route implementation: <https://github.com/mempool/mempool/blob/master/backend/src/api/mining/mining-routes.ts> (`$getDifficultyAdjustments`: time, height, difficulty, adjustment). Only the difficulty ratio between successive heights is used; the provider's rounded adjustment field is ignored.

Run with a Node runtime supporting TypeScript stripping:

```sh
node --experimental-strip-types --no-warnings scripts/check-research-archive.mjs
```

Checks reproduce every row from the retained raw bytes, consecutive 2,016-block boundaries, date/digest consistency, boundary-block consistency and all descriptive counts. The observations are captured from one provider; this is not independent full-node verification. Summary statistics give equal weight to included adjustments. They describe the captured sample only. Bitcoin mainnet retarget protocol reference: <https://github.com/bitcoin/bitcoin/blob/master/src/pow.cpp>.

## Future forecast capture, without backdating

This workflow is preparation, not a running publication service. It performs no external writes or submissions. To stage a future forecast locally:

```sh
node --experimental-strip-types --no-warnings scripts/stage-research-forecast.mjs 'PROVIDER' 'METHOD_VERSION' 'PREDICTED_CHANGE_PCT' 'HTTPS_SOURCE_CAPTURE'
```

The command fetches the current public tip height, derives the next adjustment target, assigns the current UTC time, validates bounds and writes an exclusive-create hash-linked JSON draft under `work/research-staging/`. It does not accept a custom publication timestamp or append drafts to the website dataset. Earlier draft edits invalidate the chain. Preserve original input captures and every provider's original prediction/interval/model version. Review provenance before publication. Publication still needs a real deployed record, independent timestamp receipt and evidence it preceded both the outcome and any relevant market listing; a local timestamp or hash cannot establish those facts. Hosting remains editable unless a separate preservation system is deployed.

For each retarget, capture the same named providers at matched forecast lead times. Keep an explicit missing-provider record; do not select only good forecasts. Once an outcome is observed, `evaluateForecasts` validates the record chain, rejects forecasts issued after their target outcome, and produces absolute error, interval inclusion and width or an explicit awaiting-outcome state. Its results are labelled arithmetic-only; it does not pretend timing verification or output a competitive aggregate ranking. Compare providers only after timing/source receipt review and matching cohorts. Do not aggregate observations into a synthetic accuracy claim.

## Version and correction policy

Do not overwrite v1 with refreshed provider data. A future capture must use a new dataset and API version, preserve its original bytes and correction reason, and retain the old distributions/digests. Material forecast corrections append new identified records and retain the originals. CI should run the provenance/evaluator checks before publication. The current local checks are tamper detection against retained digests, not immutable publication proof.

No scheduler, mail delivery, live collector, DOI deposit, forecasts on behalf of providers, competitor capture, domain publication or regulatory approval has been configured by this prototype work.
