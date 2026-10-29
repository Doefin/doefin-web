---
name: doefin-brand
description: Doefin's visual identity and brand facts. Load before designing or building anything for Doefin, such as screens, pages, social images, decks or documents, or when you need the logos, colours, type, tokens, templates or the brand rules in one file. For writing or editing text, use the doefin-voice skill, which carries the CEO's voice and thinking.
---

# Doefin brand

Everything is in this folder, so the skill works on its own:

- `reference/brand-context.md`: every writing and visual rule in one file. Read the visual section before you design.
- `scripts/check_copy.py` with `rules.json`: the copy checker, for any words on a screen or image.
- `reference/links.md`: the brand book page, the editable social, document and deck templates, and the tone check.

The full repository (logos, fonts, design tokens) is `doefin-brand`; this folder is built from it.

## Procedure

1. Read `reference/brand-context.md`: the visual rules, and the channel you are designing for.
2. For any words in the design, follow the doefin-voice skill (or `brand/matteo/thinking.md` in the repository). Run `python3 scripts/check_copy.py <file> --channel=<web|app|social|email|deck|doc>` on them.
3. Use the tokens (`dist/tokens.css`, the Tailwind preset), never a hard-coded hex value. Use the logo files as they are.
4. Anything public that includes a new product claim, settlement or collateral wording, a financial example, a performance claim, or legal or access language goes to Matteo before it is published.

## Facts to get right

- Doefin is registered in Port Louis, Mauritius. Never a UK company.
- One line: "Trade and hedge Bitcoin hashrate exposure through markets on mining difficulty." Not "hashrate derivatives" or "prediction market".
- Professional investors only. The disclaimer: "Doefin is for professional investors only. You can lose the full amount paid for a position. Nothing here is investment advice."
