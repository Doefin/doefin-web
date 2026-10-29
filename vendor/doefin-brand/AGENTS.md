# Doefin brand rules for AI agents

Follow these rules whenever you write or design anything for Doefin: website or app copy and screens, social posts, emails, newsletters, decks, documents, glossary entries and research. Paths below are relative to this repository's root.

## What to read

- Writing anything: `brand/matteo/thinking.md` first. It is a model of how Matteo Spinosa, the CEO, reasons when he writes. Then `brand/voice.md` and `brand/compliance.md`, the matching file in `brand/channels/` and the matching part of `brand/content-types.md`.
- Examples: `brand/matteo/edits.md` holds Matteo's own rewrites of our drafts, before and after. Read the ones closest to the job. `brand/voice-samples.md` holds his posts.
- Designing or building anything visual: `brand/visual.md`, with the values in `dist/tokens.css` or `dist/tailwind-preset.cjs`.
- No time for the files: `dist/brand-context.md` holds all of them in one file.
- An open question: `brand/decisions.md` gives the default to use until it is settled.

## Agents and skills

- `agents/doefin-voice-writer.md` writes new copy, `agents/doefin-voice-editor.md` reviews or rewrites existing copy, and `agents/doefin-voice-learner.md` records Matteo's edits and updates the model. They are Claude Code subagents; for any other tool, use the text under the front matter as a system prompt.
- `skills/doefin-voice/` is the same procedure as a self-contained Agent Skill. `skills/doefin-brand/` covers the visual side.
- Whenever Matteo edits or comments on copy, run the learner, or follow "Learn" in `skills/doefin-voice/SKILL.md`. That is how the model improves.

## Facts you must get right

- Doefin is registered in Port Louis, Mauritius. Never describe it as a UK company.
- In one line: "Trade and hedge Bitcoin hashrate exposure through markets on mining difficulty." Never "hashrate derivatives" or "prediction market".
- Hashrate is the exposure; difficulty decides the contract.
- Doefin is for professional investors only. Never address retail readers.
- The disclaimer, word for word (the current default; Matteo's footer drops "only", an open question in `brand/decisions.md`): "Doefin is for professional investors only. You can lose the full amount paid for a position. Nothing here is investment advice."
- Matteo reviews these before they are published: new product claims, changes to settlement or collateral wording, financial examples (a price, cost, payout or profit for a position), performance claims, and legal or access language. You cannot sign them off: say they need his review. Everything else uses the agreed wording. No compliance approver is named yet (`brand/decisions.md`).

## How Doefin writes, in short

- Think it through first: who is speaking, the exposure and whose it is, the one exact number, and, when the piece is about Doefin, the action and its limit.
- The first line is plain: a number, a claim, or the reader's question.
- Short sentences, one idea each. Split anything over 30 words.
- Real numbers with their unit, date, source and qualifier (expected, at the same hashrate, all else equal). Do the arithmetic.
- State the limit next to any claim about Doefin. On the website, tell the reader what to do, with a verb. Say each thing once. Never remove a risk line.
- Own opinions ("I think") and keep them apart from company facts.
- No contractions. British spelling. Sentence case. 140.58T. Yes and No in sentence case. "Shares", explained once.
- No em dashes, no hashtags. Emoji and exclamation marks only on social, when they fit.
- None of the generated-copy tells listed in `brand/voice.md`: no "seamless", "empower", "unlock", "in today's", "it's not just X, it's Y" and the rest.
- No promises ("guaranteed profit", "risk-free", "protect all revenues", "native yield"), no real or past returns, nothing "AI-powered".

## Check every draft

Run the checker on anything you write, with its channel, then fix what it reports:

```
python3 tools/check_copy.py draft.md --channel=social   # web, app, social, email, deck or doc
```

- `CUT`: generated-sounding phrasing. Rewrite the sentence; do not just swap the word.
- `CHECK`: compliance-sensitive. Keep it only if it is true and needed, and list it for Matteo.
- `STYLE`: house style. Fix it unless it sits inside a quote.

The checker reads phrasing only. Check facts and numbers yourself.

## Building screens and pages

- Load `dist/tokens.css` once. Use the `--df-*` variables, the `.df-*` type classes, or the Tailwind preset (`df-*` colours, `rounded-df-*`, `text-df-*`). Never hard-code a hex value.
- Themes switch with `data-theme="dark"` or `data-theme="light"` on a parent. Dark is the default.
- Logos come from `assets/logos/` as they are. Never redraw, recolour or stretch them.
- Manrope only, from `assets/fonts/` or Google Fonts. Every number uses tabular figures.
- One primary button (`action`) per view; the app button says "Enter app". `up` and `down` mean gain and loss on money, nothing else. Orange is never decoration.
- Every chart has its numbers in a caption, with the source and the date.

## Changing this repository

- `tokens/tokens.json` is the only source for colours, type, spacing and radii. Edit it, then run `python3 scripts/build.py`. Never edit `dist/` or the copies inside `skills/` by hand (each `SKILL.md` is the exception: it is written by hand).
- Writing rules live in `brand/`, Matteo's model in `brand/matteo/`, checker rules in `tools/rules.json`. Rebuild after changing any of them.
- Record Matteo's edits with `python3 tools/add_edit.py`, never by retyping them from memory.
- Run the checker over any `brand/` file you change. Lines that list banned phrases on purpose will be flagged; that is expected.
- Record every settled question in `brand/decisions.md` with its date, and add a line to `CHANGELOG.md`.
- Update the brand book page in `links.md` to match. This repository is the source of truth.
