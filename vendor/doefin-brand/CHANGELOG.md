# Changelog

## 0.2.0, 29 Oct 2026

Matteo answered the tone check. His answers are now the rules, and the repository carries a model of how he thinks.

- New one-liner: "Trade and hedge Bitcoin hashrate exposure through markets on mining difficulty." Hashrate is the exposure; difficulty decides the contract.
- His words: trade, hedge, hashrate exposure, expected BTC production, position cost and payout, "shares". "Enter app". 140.58T. No contractions anywhere.
- New risk line: "You can lose the full amount paid for a position." The website footer is his wording.
- Matteo reviews five kinds of content before they go out: new product claims, settlement or collateral wording, financial examples, performance claims, legal or access language.
- Emoji and exclamation marks are fine on social when they fit; LinkedIn up to 250 words, about 100 preferred for updates.
- Content-type rules updated with his additions: newsletter, research, tool text, partner emails, his own posts.
- `brand/decisions.md` now says who each rule comes from (Matteo, inferred, house). Where his own answers disagree (Yes and No, the homepage headline, the disclaimer's "only", which posts carry it, worked payout examples), the question is open with a default.
- `brand/matteo/thinking.md`: how Matteo reasons when he writes, each habit backed by his words or three edits, the rest marked unconfirmed. `brand/matteo/edits.md`: his 37 rewrites, before and after. `dist/matteo-edits.jsonl` for pipelines.
- Three agents (`agents/doefin-voice-writer.md`, `-editor.md`, `-learner.md`) and the `doefin-voice` skill: write, edit and learn. `tools/add_edit.py` records new edits.
- Checker: `--channel`, case-sensitive rules, and new rules for contractions, the old one-liner and disclaimer, "Open app", "coins", "retarget", "strike", "position tokens", YES/NO, "140.58 T", lower-case "bitcoin", unqualified promises and claims about named customers. The blanket "hedge" check is gone, and "not guaranteed" no longer counts as a promise.

## 0.1.1, 29 Oct 2026

- Removed Raffaella Tenconi as compliance approver: not part of Doefin. No approver is named yet; Matteo signs off until one is (`brand/decisions.md`).
- The checker flags the name if it is copied in from older documents.

## 0.1.0, 29 Oct 2026

First version, built from the Doefin Brand Book (27 Oct 2026):

- Writing rules from Matteo's own posts, the generated-copy tells, compliance rules and the disclaimer.
- Rules per channel and per content type. Content-type rules are a draft until Matteo answers the tone check.
- Refined palette (navy, Doefin Blue, one accent, flat colour), light and dark themes, Manrope, spacing and radii.
- Logos (wordmark white and ink, the D icon), X and LinkedIn headers, template pictures.
- Copy checker, system prompt, six task prompts, a self-contained Agent Skill.
- Built outputs: CSS variables, Tailwind preset, W3C tokens, one-file brand context.
