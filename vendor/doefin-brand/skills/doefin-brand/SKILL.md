---
name: doefin-brand
description: Doefin's brand voice and visual identity. Load before writing or designing anything for Doefin, such as website or app copy, X or LinkedIn posts, emails, newsletters, decks, documents, glossary entries or social images. Carries the CEO's voice rules, the phrases that make copy sound generated, what Doefin can't say, the visual rules and a copy checker to run on every draft.
---

# Doefin brand

Everything is in this folder, so the skill works on its own:

- `reference/brand-context.md`: every writing and visual rule in one file. Read it before you draft.
- `scripts/check_copy.py` with `rules.json`: the copy checker.

- `reference/links.md`: the brand book page, the editable social, document and deck templates, and the tone check.

The full repository (logos, fonts, design tokens) is `doefin-brand`; this folder is built from it.

## Procedure

1. Read `reference/brand-context.md`. For anything long or public, read its voice samples section too.
2. Write the draft. Follow the channel and content-type rules for what you are making.
3. Save the draft to a file and run `python3 scripts/check_copy.py <file>` (paths relative to this folder), or pipe text in with `-`.
4. Rewrite every `CUT` line as a new sentence, not a word swap. Keep a `CHECK` item only if it is true and needed, and list it for the user, because anything public about Doefin or its markets needs written sign-off (Matteo's, until a compliance approver is named). Fix `STYLE` notes unless they sit inside a quote.
5. Run the checker again until no `CUT` items are left. Then read the draft as Matteo would: plain, short, numbers first.

## Facts to get right

- Doefin is registered in Port Louis, Mauritius. Never a UK company.
- "Markets for Bitcoin mining difficulty." Not "hashrate derivatives" or "prediction market".
- Professional investors only. The disclaimer: "Doefin is for professional investors only. Positions involve risk. Nothing here is investment advice."
