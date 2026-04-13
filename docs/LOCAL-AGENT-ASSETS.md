# Local Agent Assets

## Purpose

This repository has multiple local-only agent folders because different coding tools expect different conventions.

These folders are not product source and should not be treated as part of the app architecture.

The goal of this document is to keep them understandable and prevent duplicated local skill bundles from drifting apart.

## Canonical Roles

### `.agent/`

- Keep this directory.
- It is reserved for the Antigravity agent system and its local rules.
- In this repo, `.agent/` is the only local agent directory with a clearly separate responsibility.

### `.agents/skills/`

- Treat this as the canonical shared repo-local skill library.
- Put shared skill bundles here when they should be reusable by Codex, Claude, or similar coding agents.
- If a skill exists in `.agents/skills/`, avoid maintaining a separate edited copy somewhere else.

### `.claude/`

- Treat this as a compatibility layer, not an independent source of truth.
- If Claude needs a `.claude/skills/...` path, it should point back to the shared content in `.agents/skills/` whenever practical.
- Do not let `.claude/skills/` silently fork from `.agents/skills/` unless a tool-specific reason is explicitly documented.

### `.Codex/`

- Optional local tool state only.
- Do not put product logic, repo structure, or durable engineering rules here.
- If the directory does not exist, do not create it just for symmetry.

## Consolidation Rule

Current preferred local layout:

1. Keep Antigravity-specific rules in `.agent/`
2. Keep shared repo-local skills in `.agents/skills/`
3. Let `.claude/` mirror or alias shared skills instead of duplicating them
4. Treat `.Codex/` as optional local state

## What To Avoid

- Do not commit local skill caches or local tool state as product files.
- Do not store the same skill bundle in `.agents/skills/` and `.claude/skills/` with different content unless the difference is intentional and documented.
- Do not describe these local folders as runtime application directories in README or architecture docs.

## Repository Impact

- These directories are ignored by Git and are local-only by design.
- The tracked source of truth for collaborators is:
  - `AGENTS.md`
  - `CLAUDE.md`
  - `docs/PROJECT-STRUCTURE.md`
  - this document
