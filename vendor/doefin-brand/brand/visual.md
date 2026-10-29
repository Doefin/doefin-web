# Visual identity

Colour, type and spacing values live in `tokens/tokens.json`; `dist/tokens.css` and `dist/tailwind-preset.cjs` are built from it. Token names in backticks below are those tokens.

## Logo

The wordmark is DOEFIN in slanted capitals. The inside of the D is a fin. Always use the files in `assets/logos/`. Never set the name in a font as a stand-in.

| Ground | Wordmark | File |
|---|---|---|
| `ink`, or any dark ground | White | `doefin-wordmark-white.svg` |
| `white`, light `bg`, or any light ground | Ink | `doefin-wordmark-ink.svg` |
| `blue` | White | `doefin-wordmark-white.svg` |

- Keep clear space around the wordmark equal to half its height, on every side.
- Minimum size: 80px wide on screen, 20 mm in print. Smaller than that, use the icon.
- The icon is the D on its own: white on `blue` (`doefin-icon-blue.svg`), or white on `ink` (`doefin-icon-ink.svg`). Use it wherever a square is needed: profile pictures, the app icon, the favicon.
- Don't stretch it, rotate it or straighten the slant. Don't add outlines, shadows or gradients.
- On a photo or a busy background, put the wordmark on a flat `ink` or `blue` panel.

## Colour

Most of any layout is `ink` and white. Doefin Blue (`blue`) marks the one thing to look at: the main number, the main line in a chart, one block of colour. Use `blue` for one thing per screen. Buttons, links and the faint big letter don't count.

Dark is home: the app, the website and social images. Light is for documents, decks, PDFs and print.

| Job | Tokens |
|---|---|
| Page ground | `bg` |
| Cards and panels | `surface`, `surface-alt`, edged with `line` |
| Text | `text`; `text-muted` for labels, dates and sources |
| Links | `link` |
| Primary button | `action` with `on-action` text, once per view |
| Gains and losses | `up` and `down`, always with a sign or an arrow |
| Warnings and the Illustrative badge | `caution` with `on-caution` text |
| Charts | `chart-1`, `chart-2`, `chart-context`, `chart-band` |

- `up` and `down` mean gain and loss on a position or a price. A rise in difficulty is not a gain: show it in `text` with its sign.
- Never use orange as decoration. On a trading screen it reads as a loss.
- Use flat colour. No gradients, glows or frosted-glass panels.
- Use `blue` as text only at 24px and up. Smaller links use `link`; buttons use `action`.

No longer in use: the blue-to-purple gradient and the pink and purple glows; #5B73E8, #4F85F6 and #CCEAFB (use `blue`); #838EA7 (use `text-muted`); orange eyebrows and icons (use `text-muted` or `blue`).

## Type

Manrope for everything, from Regular (400) to ExtraBold (800).

- `display` for title slides and social cards. `title-1`, `title-2` and `title-3` for headings.
- `body` in the app. `body-lg` for anything longer than a paragraph. `small` for captions, sources and the disclaimer.
- `label` for eyebrows (the small line above a heading) and column heads, set in capitals.
- `figure-xl` and `figure` for the main numbers. `mono` only for addresses and hashes.

Rules:

- Sentence case for every heading, button and title.
- Figures line up in columns. Developers set `font-variant-numeric: tabular-nums` on every number.
- Manrope has no italic, so don't press the italic button: the software will fake a slant. Use bold for emphasis, and use it rarely.
- Keep reading text narrower than `measure`.
- In Google Slides and Google Docs, choose Manrope from the font menu. In PowerPoint or Word without Manrope installed, use Arial.

## Layout and shape

- Spacing comes from the scale: `space-4` is the phone gutter, `space-6` sits inside and between cards, `space-16` sits between sections on desktop.
- Corners: `radius-panel` on cards and panels, `radius-md` on buttons and inputs, `radius-sm` on badges, `radius-pill` on gain and loss chips.
- Separate things with space first and a `line` hairline second. Only menus, popovers and tooltips get `shadow-float`.
- Page content stays inside `container`.

## The big letters

One letter of the wordmark, usually the D, can sit very large behind a layout: `blue` at 6% to 14% opacity, cropped by the edge. One letter per layout, never the whole word as a pattern. Slanted shapes use the wordmark's angle, `slant`, and no other.

## Charts

- Our series is `chart-1`. Everything else is `chart-context` grey. Use `chart-2` only when a second series needs its own colour, and label both lines on the chart.
- A forecast always shows its range as a `chart-band`, and the caption gives the range in numbers.
- Every chart has its numbers in a caption: the start, the end, the high or low, the dates and the source. A reader who can't see the chart still gets the point.
- 2px lines, hairline grid, one y-axis. No 3D and no animation on load.
- Difficulty adjustments are bars above or below zero in one colour. `up` and `down` stay for money.

## Icons

Line icons on a 24px grid, 2px stroke, round ends, no fill. Colour them `text-muted`, or `blue` for the one active item. No emoji in the app, on social or in email.

## Images

Use what is real: charts of real data, app screenshots with the date visible, photos of real people and real mining sites. No stock photos, no 3D coins, no rockets, no glowing networks, no AI-generated pictures.

## Badges

Source grades on any figure:

- Measured: read from a public source, like the Bitcoin chain or mempool.space.
- Single source: one source only, not checked against another.
- Judgement: our view. Shown with a dashed border.
- Illustrative: sample data, not live. Every made-up or placeholder number carries it, on a `caution` fill.

Gain and loss chips use `up` and `down`, always with a sign and an arrow, and only for money.
