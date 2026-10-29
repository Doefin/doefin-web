# Doefin brand

Doefin's brand in plain files: how we write, how our CEO thinks when he writes, what we cannot say, how we look, and the logos, colours, fonts and templates that go with it. Any person, any AI model and any project can use it. Nothing here depends on one tool.

This repository is the source of truth. The visual pages on claude.ai (`links.md`) mirror it.

## What is inside

| Path | What it is | Who reads it |
|---|---|---|
| `AGENTS.md` | The rules in short, plus what to read for each job | Any AI agent (Codex, Cursor, Copilot and others read it on their own) |
| `CLAUDE.md` | Imports `AGENTS.md` for Claude Code | Claude |
| `brand/matteo/thinking.md` | How Matteo reasons when he writes: twelve habits, the shape of each kind of writing, the questions he asks of a draft | Everyone who writes, and every model |
| `brand/matteo/edits.md` | Matteo's rewrites of our drafts, before and after, with what each teaches | Writers and models, as worked examples |
| `brand/voice.md` | How we write, with the CEO's lines and the phrases that sound generated | Everyone who writes |
| `brand/voice-samples.md` | Matteo's own posts | Writers and models |
| `brand/compliance.md` | What we cannot say, the disclaimer, what goes to Matteo first | Everyone who publishes |
| `brand/content-types.md` | Rules for slides, posts, newsletter, glossary, research, docs, emails, tools and app text | Writers and models |
| `brand/channels/` | Website, X and LinkedIn, email, decks, documents, each with its template picture | Writers and designers |
| `brand/visual.md` | Logo, colour, type, layout, charts, icons, images | Designers and developers |
| `brand/decisions.md` | What is settled, what is open, and the default until it is settled | Everyone |
| `agents/` | Three Claude Code subagents: `doefin-voice-writer`, `doefin-voice-editor`, `doefin-voice-learner` | Claude Code; any model as system prompts |
| `skills/doefin-voice/` | Write, edit and learn, as a self-contained Agent Skill | Claude and other tools that load skills |
| `skills/doefin-brand/` | The visual side, as a self-contained Agent Skill | Claude and other tools that load skills |
| `tokens/tokens.json` | The single source for colours, type, spacing and radii | Developers |
| `dist/` | Built files: `tokens.css`, `tailwind-preset.cjs`, `tokens.dtcg.json`, `brand-context.md`, `matteo-edits.jsonl` | Projects, chat tools, pipelines |
| `assets/` | Logos, social headers, the Manrope font, template pictures | Everyone |
| `tools/check_copy.py` | The copy checker | Writers, models, CI |
| `tools/add_edit.py` | Records one of Matteo's edits | The learner, and anyone who receives his edits |
| `prompts/` | A system prompt and task prompts for any chat assistant | Content work in ChatGPT, Gemini, Claude |

## How the voice model learns

1. A writer or an agent drafts something, using `brand/matteo/thinking.md` and the checker.
2. Matteo edits it, or comments on it.
3. The learner records the edit (`tools/add_edit.py`), writes what it teaches, and updates `thinking.md`: a new pattern waits under "not yet confirmed" until Matteo states it or it shows up in three edits. Anything that contradicts a settled rule goes to the Open table in `brand/decisions.md` instead of changing the rule.
4. `python3 scripts/build.py` puts the new edit and lesson into every skill and into `dist/`. A release carries them to every project.

The more of his edits go in, the fewer the next draft needs. Send every one to the learner.

## Use it in a coding project

doefin-web vendors a pinned copy, because Vercel cannot fetch a private submodule: `npm run brand:sync -- v0.2.0` copies a tagged release into `vendor/doefin-brand/` and writes a checksum lock, and `npm run check:brand` fails if anyone edits the copy by hand (see doefin-web's `docs/brand.md`). Elsewhere, a submodule works as well:

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
- Claude Code agents and skills: link them into the project's `.claude/` folder so everyone who clones it has them:
  ```
  ln -s ../../vendor/doefin-brand/agents/doefin-voice-writer.md .claude/agents/doefin-voice-writer.md   # and the editor and learner
  ln -s ../../vendor/doefin-brand/skills/doefin-voice .claude/skills/doefin-voice
  ```
- CI: run `python3 vendor/doefin-brand/tools/check_copy.py` over content files, and fail the build on `CUT` items.

## Use it for content

- In a folder of content: point your agent at `AGENTS.md`.
- In ChatGPT, Gemini, a Claude Project or any assistant: paste `prompts/system-prompt.md` as its instructions and upload `dist/brand-context.md` as its knowledge file. Then use the briefs in `prompts/tasks/`: posts, newsletters, glossary entries, deck outlines, website copy, partner emails, rewrites, and learning from one of Matteo's edits.
- In Claude Code on any machine: link the skills and agents once, and they load in every project:
  ```
  ln -s <path-to>/doefin-brand/skills/doefin-voice ~/.claude/skills/doefin-voice
  ln -s <path-to>/doefin-brand/skills/doefin-brand ~/.claude/skills/doefin-brand
  for a in writer editor learner; do ln -s <path-to>/doefin-brand/agents/doefin-voice-$a.md ~/.claude/agents/; done
  ```
- To check any draft by hand: `python3 tools/check_copy.py draft.md --channel=social`, or paste it into the Copy check on the brand book page.

## Change it

1. Edit the source: `brand/*.md` for rules, `brand/matteo/` for the voice model, `tokens/tokens.json` for visual values, `tools/rules.json` for the checker.
2. Run `python3 scripts/build.py`. It rebuilds `dist/` and both skills. Never edit those by hand, apart from each `SKILL.md`.
3. Record any settled question in `brand/decisions.md`, add a line to `CHANGELOG.md` and raise `VERSION`.
4. Tag the release (`git tag v0.2.1`). Projects update with `npm run brand:sync -- v0.2.1` or `git submodule update --remote`.
5. Update the brand book page so it matches.

Needs Python 3 only. No packages to install.
