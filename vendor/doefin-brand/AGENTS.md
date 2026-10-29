# Doefin brand rules for AI agents

Follow these rules whenever you write or design anything for Doefin: website or app copy and screens, social posts, emails, newsletters, decks, documents, glossary entries and research. Paths below are relative to this repository's root.

## What to read

- Writing anything: `brand/voice.md` and `brand/compliance.md`, then the matching file in `brand/channels/` and the matching part of `brand/content-types.md`.
- Anything long or public: `brand/voice-samples.md` as well. It holds the CEO's own writing.
- Designing or building anything visual: `brand/visual.md`, with the values in `dist/tokens.css` or `dist/tailwind-preset.cjs`.
- No time for the files: `dist/brand-context.md` holds all of them in one file.
- An open question (spelling, button labels, the one-liner): `brand/decisions.md` gives the default to use until it is settled.

## Facts you must get right

- Doefin is registered in Port Louis, Mauritius. Never describe it as a UK company.
- In one line: "Markets for Bitcoin mining difficulty." Don't call it "hashrate derivatives" or a "prediction market".
- Doefin is for professional investors only. Never address retail readers.
- The disclaimer, word for word: "Doefin is for professional investors only. Positions involve risk. Nothing here is investment advice."
- Anything public about Doefin or its markets needs written sign-off before it goes out. No compliance approver is named yet (`brand/decisions.md`); until one is, Matteo signs off. You can't sign it off yourself: say it needs sign-off.

## How Doefin writes, in short

- The first line is plain and goes straight to the subject.
- Short sentences, one idea each. Split anything over 30 words.
- Real numbers with their unit, date and source. Mark estimates ("about", "~"). A forecast carries its range.
- Name the trade-off. Own opinions ("I think"). Give facts a source.
- British spelling. Sentence case. No em dashes, no emoji, no hashtags, no exclamation marks except in a thank-you.
- None of the generated-copy tells listed in `brand/voice.md`: no "seamless", "empower", "unlock", "in today's", "it's not just X, it's Y" and the rest.
- No return or profit figures, no promises, nothing "AI-powered".

## Check every draft

Run the checker on anything you write, then fix what it reports:

```
python3 tools/check_copy.py draft.md        # or pipe text in: ... | python3 tools/check_copy.py -
```

- `CUT`: generated-sounding phrasing. Rewrite the sentence; don't just swap the word.
- `CHECK`: compliance-sensitive. Keep it only if it is true and needed, and list it for the approver.
- `STYLE`: house style. Fix it unless it sits inside a quote.

The checker reads phrasing only. Check facts and numbers yourself.

## Building screens and pages

- Load `dist/tokens.css` once. Use the `--df-*` variables, the `.df-*` type classes, or the Tailwind preset (`df-*` colours, `rounded-df-*`, `text-df-*`). Never hard-code a hex value.
- Themes switch with `data-theme="dark"` or `data-theme="light"` on a parent. Dark is the default.
- Logos come from `assets/logos/` as they are. Never redraw, recolour or stretch them.
- Manrope only, from `assets/fonts/` or Google Fonts. Every number uses tabular figures.
- One primary button (`action`) per view. `up` and `down` mean gain and loss on money, nothing else. Orange is never decoration.
- Every chart has its numbers in a caption, with the source and the date.

## Changing this repository

- `tokens/tokens.json` is the only source for colours, type, spacing and radii. Edit it, then run `python3 scripts/build.py`. Never edit `dist/` or the copies inside `skills/` by hand.
- Writing rules live in `brand/`. Checker rules live in `tools/rules.json`. Rebuild after changing either.
- Run the checker over any `brand/` file you change. Lines that list banned phrases on purpose will be flagged; that is expected.
- Record every settled question in `brand/decisions.md` with its date, and add a line to `CHANGELOG.md`.
- Update the brand book page in `links.md` to match. This repository is the source of truth.
