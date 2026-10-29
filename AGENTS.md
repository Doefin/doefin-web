# doefin-web: rules for AI agents

Read `CLAUDE.md` before you change anything. It holds this project's rules (crawlability, content boundaries, Sanity, tools), and they apply to every agent, not only Claude.

## Brand: required for any copy or UI change

The company brand lives in `vendor/doefin-brand/`, a pinned copy of github.com/Doefin/doefin-brand.

1. Before writing or changing any copy (pages, components, `content/`, Sanity schema descriptions, metadata, alt text), read `vendor/doefin-brand/AGENTS.md` and follow it. For a quick start, `vendor/doefin-brand/dist/brand-context.md` has every rule in one file.
2. Before changing any UI, read `vendor/doefin-brand/brand/visual.md` and `docs/brand.md`, which maps the site's Tailwind tokens to the brand's.
3. Before you finish, run `npm run check:brand`. It fails if the lines you added sound generated, or if anyone edited `vendor/doefin-brand/` by hand. Fix every `CUT` item, and list `CHECK` items in your summary for the compliance approver.
4. Never edit `vendor/doefin-brand/`. Brand changes go to the brand repository, then `npm run brand:sync -- <tag>` brings them here.

Facts you must not get wrong: Doefin is registered in Port Louis, Mauritius, never a UK company. In one line it is "Markets for Bitcoin mining difficulty." It is for professional investors only.

## Commands

```
npm run dev
npm run build && npm run typecheck
npm run check:brand                                   # brand guard for your changes
npm run check:brand -- --base=http://127.0.0.1:3039   # every page after build + start, Sanity content included
npm run check:crawlable -- --base=http://127.0.0.1:3039
```
