@AGENTS.md

## Claude specifics

- Writing: use the `doefin-voice-writer` agent for new copy, `doefin-voice-editor` to review or rewrite, and `doefin-voice-learner` whenever Matteo edits or comments on a draft. They live in `agents/`; link them into `~/.claude/agents/` or a project's `.claude/agents/`.
- The same procedures are packaged as the `doefin-voice` Agent Skill in `skills/doefin-voice/`, and the visual side as `skills/doefin-brand/`. Link or copy those folders into `~/.claude/skills/` (or a project's `.claude/skills/`).
- For visual work, the claude.ai pages in `links.md` (brand book, templates canvas, deck template) can be read with the Artifact tool.
