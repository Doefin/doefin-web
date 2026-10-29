---
name: doefin-voice
description: Write, rewrite or review anything for Doefin the way its CEO, Matteo Spinosa, would, and learn from his edits. Use for website and app copy, X and LinkedIn posts, emails and newsletters, decks, documents, glossary entries, research notes, help docs and tool text, and whenever Matteo has edited or commented on a draft. Carries a model of how he reasons, his own before-and-after rewrites, the house rules and a copy checker.
---

# Doefin voice

Three jobs: **write** new copy, **edit** existing copy (rewrite or review), and **learn** from Matteo's edits so the next draft needs fewer of them.

Everything is in this folder:

| File | What it is |
|---|---|
| `reference/thinking.md` | How Matteo reasons when he writes: twelve habits, the shape of each kind of writing, and the nine questions he would ask of a draft. Read it first, every time. |
| `reference/edits.md` | His rewrites of our drafts, before and after, each with what it teaches. The best examples you have. |
| `reference/samples.md` | His own posts. |
| `reference/brand-context.md` | Every rule: voice, compliance, content types, channels, decisions, visual. Search it for the channel you are writing for. |
| `scripts/check_copy.py` with `rules.json` | The copy checker. |
| `scripts/add_edit.py` | Records a new edit (the learn job). |
| `reference/links.md` | The brand book, templates and the tone check. |

Paths below are relative to this folder. The source of all of it is the doefin-brand repository (`brand/matteo/`); this folder is built from it.

## Write

1. Read `reference/thinking.md`. Then read the entries in `reference/edits.md` and `reference/samples.md` closest to the job; the table "How each kind of writing is built" in `thinking.md` points to them.
2. Before drafting, write these lines for yourself, the way Matteo thinks a piece through. They do not go in the draft.
   - **Speaker:** the company ("we") or Matteo ("I").
   - **Exposure:** what is the reader exposed to, and which reader is it (miner, or investor and desk)?
   - **Number:** the one number that carries the piece, exact, with its unit, date, source and qualifier. Do the arithmetic: a difficulty change d moves expected production by 1/(1 + d) − 1.
   - **Action,** only when the piece is about what Doefin lets people do. A market update needs none; do not invent one.
   - **Limit,** whenever there is an action or a claim about Doefin: what it will not do, or what can go wrong.
   Missing a fact? Use a placeholder like `[difficulty on 12 Nov, source]`. Never invent a number, a quote or a customer.
3. Draft in the shape for that kind of writing. Use the agreed wording word for word: the one-liner, the footer, the disclaimer, the risk line and the app button (`brand-context.md`, Decisions).
4. Save the draft and run the checker with its channel (web, app, social, email, deck or doc):
   `python3 scripts/check_copy.py draft.md --channel=social`
5. Rewrite every `CUT` line as a new sentence, not a word swap. Fix `STYLE` notes unless they sit inside a quote. Keep a `CHECK` item if it is true and needed, and list it. Never remove a risk line because the checker marked it. Run the checker again until no `CUT` is left.
6. Go through the nine questions at the end of `thinking.md`. Then read the draft as Matteo would and cut any line he would cut.
7. Hand over the draft, then:
   - **For Matteo to review**, if it contains new product claims, changes to settlement or collateral wording, financial examples (a price, cost, payout or profit for a position), performance claims, or legal or access language. Quote each line. Otherwise say "Routine, in the agreed wording."
   - The `CHECK` items.
   - The placeholders still to fill.
   - One line on which habits or edits you leaned on ("habit 4, E17").

## Edit

For existing copy: a page, a component, a content file, a doc, a deck or pasted text. Review means report only. Rewrite means make the changes.

1. Read `reference/thinking.md` and `reference/edits.md`.
2. Run the checker over the copy.
3. For each block, decide **Keep**, **Change** or **Cut**, as Matteo did in the tone check:
   - Keep what already says what it does in plain words (E28).
   - Cut what repeats something said elsewhere on the page (E24, E25), and internal intentions that leaked onto a page (E31). Flag other cuts rather than make them.
   - Change the rest, with the smallest rewrite that fixes it. Never remove a risk line.
4. Keep facts, numbers and links unless they are wrong. Never add a claim the source does not support. If you think a fact is wrong, flag it rather than guess.
5. Report a table: where, before, after, and why (a habit number from `thinking.md` or an E-number from `edits.md`).
6. Run the checker over the result.

## Learn

Do this every time Matteo edits a draft, comments on one or states a rule.

1. Get both versions: what was sent, and what he changed it to, or his comment word for word. Note where the copy appears and the date.
2. Record it in the **doefin-brand repository**, never in a vendored copy or in this folder (both are rebuilt). From the repository:
   `python3 tools/add_edit.py --where "Homepage FAQ" --before draft.txt --after his.txt`
   For a cut or a keep: `--verdict Cut --note "his words"`. Then replace the TODO under "What it teaches" with one or two lines on what he changed and what that shows about how he reasons.
3. Compare the lesson with `brand/matteo/thinking.md`:
   - It confirms a habit: add the E-number to that habit's examples.
   - It is new: add it under "Seen in his edits, not yet confirmed", with the E-number.
   - It is the third sighting of something under "not yet confirmed", or Matteo stated it as a rule: move it up into a habit, and add a dated row to `brand/decisions.md`.
   - It contradicts a settled rule: do not change the rule. Add the question to the Open table in `brand/decisions.md` and tell the user.
4. If the lesson is a word or phrase he always replaces, add a `style` rule to `tools/rules.json` and test it with `tools/check_copy.py`.
5. Run `python3 scripts/build.py`, add a line to `CHANGELOG.md`, and tell the user what was learned and what Matteo still needs to confirm. Release (raise `VERSION`, tag, push) only when the user asks.

A lesson is what the edit shows, quoted from it. Never put words in Matteo's mouth.

## Facts to get right

- Doefin is registered in Port Louis, Mauritius. Never a UK company.
- One line: "Trade and hedge Bitcoin hashrate exposure through markets on mining difficulty."
- Professional investors only. Disclaimer (current default): "Doefin is for professional investors only. You can lose the full amount paid for a position. Nothing here is investment advice."
- No contractions, anywhere.
