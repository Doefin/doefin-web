# Research newsletter and requested-email prototype

The active user instruction is prototype only. These forms run entirely in browser memory. They make no email-provider requests, write no storage, schedule no messages and create no subscribers. The email input is cleared after a valid preview. Optional company text and preferences remain in the current component only until edited or the page is left/reloaded.

## Implemented experiences

- Homepage: existing subscribe band now describes retarget research. Four required role choices: miner, fund/desk, service provider, other.
- Research, product and publication-alert preferences are independent. Optional volunteered company and domain are explicit; no domain is inferred from the email.
- Demo consent is required. No implicit marketing consent is obtained through a one-time requested resource.
- `/v3/newsletter`: preference preview, example research issue, requested report/dataset email preview. Public printable report, CSV and provenance links remain accessible without email.
- Difficulty exposure scenario brief: email-to-self demo, validated recipient field and chosen numerical inputs, illustrative results, explicit no-send state. Discussion notes are excluded from this preview. Download and copy actions remain separate. A separate concise review export condenses the seven inputs, three production cases, model limits and approval questions; the complete export retains expanded discussion context. It is labelled condensed until printed page count is verified.
- Successful preview emits only `identification_request` with `kind` and `result: demo-preview` through the existing opt-in local QA boundary. No email, role, company, domain, input values or discussion text enter that event.

## Validation

`node scripts/check-newsletter.mjs` checks recipient format/size, four-role whitelist, independent preferences, consent, company/domain bounds, ignored unapproved fields and scenario bounds against the calculator's shared range definitions. It also checks condensed export completeness and escaping. 49 checks pass. This is pure validation testing, not a provider-delivery test.

`npm run typecheck` checks integration. Browser verification must separately cover blank/invalid fields, at least one preference, success wording, editing resets, no network/storage writes, direct report links, mobile widths and keyboard focus. No claim of live subscription or delivery follows from these checks.

## Future service activation (not part of this prototype)

A live implementation requires an approved provider account and authenticated sender, server-side validation, a distributed anti-abuse limiter, one-time identity confirmation, consent and unsubscribe records, preference management and monitored failure handling. Avoid disclosing raw submitted identity in analytics/logs. Make report/scenario delivery independent from marketing consent; keep findings public. Publication alerts require a real publication trigger, and recurring research requires editorial ownership and a release cadence. Do not relabel the current demo as live just because credentials exist.

Brevo's current DOI contract supports list IDs, configured attributes, confirmation template and redirect; confirmation request is not a confirmed subscriber. Its transactional endpoint supports fixed report links or generated attachments. These were researched only; no provider account was configured and no request was made.

Primary references reviewed 2026-10-22:

- https://developers.brevo.com/reference/create-doi-contact
- https://developers.brevo.com/reference/send-transac-email
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://upstash.com/docs/redis/features/restapi
