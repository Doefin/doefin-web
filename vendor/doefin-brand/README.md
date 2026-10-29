# Doefin brand

Doefin's brand in plain files: how we write, what we can't say, how we look, and the logos, colours, fonts and templates that go with it. Any person, any AI model and any project can use it. Nothing here depends on one tool.

This repository is the source of truth. The visual pages on claude.ai (`links.md`) mirror it.

## What's inside

| Path | What it is | Who reads it |
|---|---|---|
| `AGENTS.md` | The rules in short, plus what to read for each job | Any AI agent (Codex, Cursor, Copilot and others read it on their own) |
| `CLAUDE.md` | Imports `AGENTS.md` for Claude Code | Claude |
| `brand/voice.md` | How we write, with the CEO's lines and the phrases that sound generated | Everyone who writes |
| `brand/voice-samples.md` | Matteo's own posts, as a reference | Writers and models |
| `brand/compliance.md` | What we can't say, the disclaimer, who approves | Everyone who publishes |
| `brand/content-types.md` | Rules for slides, posts, newsletter, glossary, research, docs, emails, app text | Writers and models |
| `brand/channels/` | Website, X and LinkedIn, email, decks, documents, each with its template picture | Writers and designers |
| `brand/visual.md` | Logo, colour, type, layout, charts, icons, images | Designers and developers |
| `brand/decisions.md` | What is settled, what is open, and the default until it is settled | Everyone |
| `tokens/tokens.json` | The single source for colours, type, spacing and radii | Developers |
| `dist/` | Built files: `tokens.css`, `tailwind-preset.cjs`, `tokens.dtcg.json`, `brand-context.md` | Projects and chat tools |
| `assets/` | Logos, social headers, the Manrope font, template pictures | Everyone |
| `tools/check_copy.py` | The copy checker | Writers, models, CI |
| `prompts/` | A system prompt and task prompts for any chat assistant | Content work in ChatGPT, Gemini, Claude |
| `skills/doefin-brand/` | The same rules as a self-contained Agent Skill | Claude and other tools that load skills |

## Use it in a coding project

Add it as a Git submodule, so every project reads the same version:

```
git submodule add <repo-url> vendor/doefin-brand
```

Then:

- Styles: load `vendor/doefin-brand/dist/tokens.css` once, and use the `--df-*` variables and `.df-*` type classes. With Tailwind, add the preset:
  ```js
  // tailwind.config.js
  module.exports = { presets: [require('./vendor/doefin-brand/dist/tailwind-preset.cjs')] }
  ```
  Colours become `bg-df-bg`, `text-df-text`, `bg-df-action` and so on. Themes switch with `data-theme="dark"` or `"light"`.
- Logos and the font: use the files in `vendor/doefin-brand/assets/` as they are.
- AI agents: add one line to the project's own `AGENTS.md`: `Doefin brand rules: follow vendor/doefin-brand/AGENTS.md.` In the project's `CLAUDE.md`, add `@vendor/doefin-brand/AGENTS.md`.
- CI, optional: run `python3 vendor/doefin-brand/tools/check_copy.py` over content files, and fail the build on `CUT` items.

For JavaScript projects there is also `package.json`, so the repository can be installed straight from Git (`npm install git+ssh://<repo-url>`) and imported as `@doefin/brand/tokens.css` or `@doefin/brand/tailwind-preset`.

## Use it for content

- In a repository or folder of content: add the submodule as above, and point your agent at `AGENTS.md`.
- In ChatGPT, Gemini, a Claude Project or any assistant: paste `prompts/system-prompt.md` as its instructions and upload `dist/brand-context.md` as its knowledge file. Then use the briefs in `prompts/tasks/` for posts, newsletters, glossary entries, deck outlines, website copy and partner emails.
- In Claude Code on any machine: link the skill once, and it loads whenever you write for Doefin:
  ```
  ln -s <path-to>/doefin-brand/skills/doefin-brand ~/.claude/skills/doefin-brand
  ```
- To check any draft by hand: `python3 tools/check_copy.py draft.md`, or paste it into the Copy check on the brand book page.

## Change it

1. Edit the source: `brand/*.md` for rules, `tokens/tokens.json` for visual values, `tools/rules.json` for the checker.
2. Run `python3 scripts/build.py`. It rebuilds `dist/` and the skill. Never edit those by hand.
3. Record any settled question in `brand/decisions.md`, add a line to `CHANGELOG.md` and raise `VERSION`.
4. Tag the release (`git tag v0.2.0`). Projects update with `git submodule update --remote`.
5. Update the brand book page so it matches.

Needs Python 3 only. No packages to install.
