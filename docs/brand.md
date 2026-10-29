# The Doefin brand in this repository

The company brand (how Doefin writes, what it can't say, colours, type, logos) lives in its own repository, github.com/Doefin/doefin-brand. This site carries a pinned copy of it in `vendor/doefin-brand/`.

## What is where

| Path | What it is |
|---|---|
| `vendor/doefin-brand/` | The pinned brand release. Never edit by hand. |
| `vendor/doefin-brand/brand-lock.json` | Version, commit and a checksum for every vendored file. |
| `vendor/doefin-brand/AGENTS.md` | The brand rules for agents. `CLAUDE.md` imports it and `AGENTS.md` points to it. |
| `vendor/doefin-brand/brand/` | Voice, compliance, channels, content types, visual rules, decisions. |
| `vendor/doefin-brand/dist/tokens.css` | The `--df-*` variables and `.df-*` type classes. Imported at the top of `app/globals.css`. |
| `vendor/doefin-brand/dist/tailwind-preset.cjs` | The `df-*` Tailwind classes. Loaded as a preset in `tailwind.config.ts`. |
| `vendor/doefin-brand/assets/` | Logos, social headers, the Manrope font, template pictures. |
| `.claude/skills/doefin-brand` | A link to the brand skill, so Claude sessions here load it on their own. |
| `scripts/check-brand.mjs` | The guard behind `npm run check:brand`. |
| `scripts/brand-sync.mjs` | The updater behind `npm run brand:sync`. |
| `.github/workflows/brand.yml` | Runs the guard on every pull request. |

## Why a vendored copy and not a git submodule

Vercel builds this repository from GitHub and cannot fetch a private submodule from another repository. A submodule would break every deployment. A committed copy builds anywhere, and the lock file still ties it to one exact brand release.

## The checks

```
npm run check:brand                                   # the default, also run in CI
npm run check:brand -- --all                          # every string in app/, components/, content/, lib/ and studio/schemaTypes (report only)
npm run check:brand -- --base=http://127.0.0.1:3039   # after build + start: every page, Sanity content included (report only; --strict fails on CUT)
```

The default run does two things:

1. It checks every vendored file against `brand-lock.json`, and fails if anything was edited, added or deleted by hand.
2. It reads the prose in the lines added since `origin/main` (JSX text and sentence-like strings, not class lists or paths), and fails on any `CUT` item. `CHECK` items are listed for the compliance approver but don't fail. `STYLE` items are notes.

The rules come from `vendor/doefin-brand/tools/rules.json`, the same rules as the brand book's Copy check and the brand repository's Python checker. The checker reads phrasing only, so facts, numbers and tone still need a person.

Sanity content is written in the Studio, not in this repository, so only the `--base` run sees it. Run it before a release, and send what it finds to whoever edits that page in Sanity.

## Updating the brand

1. Change the rule, token or asset in the brand repository, then rebuild and tag a release there (see its `README.md`).
2. Here, run `npm run brand:sync -- v0.2.0` (you need read access to the private repository). To try an unreleased change, use `npm run brand:sync -- --from=../doefin-brand`. Don't merge a local sync.
3. Run `npm run check:brand` and `npm run build`, review the diff, and commit `vendor/doefin-brand/` in one commit.

## Site tokens and brand tokens

The site keeps its own Tailwind tokens. The brand's tokens are also available, so new work can use either. Where they differ, the brand is the newer decision.

| Site token | Brand token (`df-*` class, `--df-*` variable) | Note |
|---|---|---|
| `ink` | `df-ink`, `df-bg` | Page ground |
| `surface` | `df-surface` | Cards and panels |
| `surfaceAlt` | `df-surface-alt` | |
| `active` | `df-selected` | Put `text`, not muted text, on it |
| `body` | `df-text` | |
| `subtle` | `df-text-muted` | The brand's one secondary-text grey |
| `muted` (#838EA7) | `df-text-muted` | The brand retires it. Below 4.5:1 on `active` |
| `brand` | `df-blue` | The one accent: large text, highlights, the main chart line |
| `brandAction` (#2C63D6) | `df-action` (#2C63D8) | Same role. The values differ by 2 in the blue channel. |
| `brandDeep`, `chart`, `highlight` | `df-blue` | Retired by the brand |
| `up`, `down`, `caution` | `df-up`, `df-down`, `df-caution` | Money and warnings only. Orange is never decoration. |
| `rounded-panel`, `rounded-header` | `rounded-df-panel`, `rounded-df-header` | Same values |

The brand also defines a light theme (`data-theme="light"`) for documents and print. The site stays dark.

Moving the site fully onto the brand tokens is a separate piece of work. Don't mix it into unrelated changes.
