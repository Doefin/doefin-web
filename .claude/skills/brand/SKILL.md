---
name: brand
description: The Doefin brand reference for this site — colour tokens, typography, the wordmark, radii, and the rules for using them. Load before creating or restyling any component, choosing a colour, or placing the logo, and to check whether existing markup is on-brand.
---

# Doefin brand — doefin.com

Tokens are defined once in `tailwind.config.ts`. **Never write an arbitrary hex value
in a component.** If a shade is missing, add a token.

## Colour

| Token | Value | Use |
|---|---|---|
| `ink` | `#0A0F1C` | Page ground. The deepest surface. |
| `surface` | `#1c1f2e` | Cards and panels |
| `surfaceAlt` | `#1E243C` | Alternate panel, gradients |
| `active` | `#2A3A5C` | Selected / active state |
| `body` | `#E8ECF4` | Primary text |
| `muted` | `#838EA7` | Secondary text, labels |
| `subtle` | `#99A2B5` | Long-form body copy |
| `brand` | `#3475FE` | Primary CTA, links, accents |
| `brandDeep` | `#5B73E8` | Secondary brand |
| `chart` | `#4F85F6` | Chart series |
| `up` | `#3EC875` | Positive / gain |
| `down` | `#F05122` | Negative / loss |
| `caution` | `#F0B429` | Warning, and the "illustrative data" badge |

**Semantic colour is not decoration.** `up` and `down` mean gain and loss. Do not use
them to brighten a layout.

## Typography

**Manrope**, loaded through `next/font` in the root layout and exposed as
`--font-manrope`. Weights 400–800.

- Headings: 700–800, tight tracking (`-0.02em` to `-0.035em`), `text-balance`
- Body: 400, `text-[17px]` at `leading-[1.72]` for long-form
- Labels and eyebrows: 700, uppercase, `tracking-[0.12em]`, `text-xs`
- **Every figure uses `tabular-nums`** — apply the `tabular` class. Digits must line
  up in columns.

## The wordmark

`/images/logo/logo-white.png` — a **white lockup with a transparent background,
built for dark grounds**. It is invisible on a light surface. There is no dark
variant; if you need one, ask rather than recolouring.

Use the `<Logo />` component. Header: `w-[104px]`. Footer: `w-[96px]`.

## Shape

- `rounded-panel` — 22px. Cards, panels, stat blocks.
- `rounded-header` — 30px. Large header elements.
- `rounded-lg` — 8px. Buttons, tags, inline surfaces.

Borders are `border-white/[0.07]` against dark surfaces. Hover states lift to
`border-brand/40`.

## Writing in the interface

- Sentence case for headings, not title case.
- Name things as a reader recognises them. A miner has *production* and *margin*, not
  *notional exposure*.
- Never overstate certainty. If a figure is a projection, the interval sits beside it.
- Say what a control does, then confirm it happened in the same words.

## Never

- An arbitrary hex value in a component.
- The wordmark on a light background.
- `up` / `down` colour for anything other than gain and loss.
- A chart without its numbers also present as text.
- A figure without `tabular-nums`.
