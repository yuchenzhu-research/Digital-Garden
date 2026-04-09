# Engineering Guardrails

## Purpose

This document defines the engineering guardrails for Bibliotheca Vitae.

It is written for human contributors and coding agents alike, including OpenAI Codex, Claude Code, Google Antigravity/Gemini-style agents, and similar autonomous coding tools.

The goal is not to freeze the architecture. The goal is to keep the project evolving without collapsing back into large orchestration files, duplicated storage paths, or docs that drift away from reality.

## Current Runtime Truth

Bibliotheca Vitae currently operates across three runtime surfaces:

1. Desktop web
2. Mobile web
3. Tauri desktop app

The project is local-first on every surface.

- Desktop web supports archive management through Folder Mode or browser-local fallback.
- Mobile web is intentionally reduced to browse plus local drafts in the current browser.
- Tauri desktop app is the native shell for full local archive management on disk.

Do not redesign the project as a cloud-first product unless that scope is explicitly approved.

## Layer Boundaries

### App shell

`src/app/`

- `src/app/page.tsx` is the current top-level page shell and should stay thin over time.
- `page.tsx` should remain a page composer and orchestration shell.
- Keep long-lived storage branching, editor internals, and motion choreography out of the page component when they can live in dedicated hooks or modules.

### Product features

`src/components/features/`

- Feature components own user-facing flows such as hero, detail, editor, and settings.
- Feature components may call service-layer actions through stable interfaces.
- Feature components should not become the environment switchboard for web, mobile, and Tauri.

### Reusable UI

`src/components/ui/`

- UI components should stay reusable and presentation-focused.
- UI components should not pick storage adapters, trigger global reloads as policy, or encode fallback rules.

### Visual layer

`src/components/visual/`

- Visual components own background systems, decorative motion, and 3D treatments.
- They should not fetch archive data, choose storage modes, or hold product rules.
- Motion belongs in reusable primitives and section choreography, not scattered inline across unrelated components.

### Local-first services

`src/services/`

- `storage-repository.ts` is the contract boundary.
- `entryService.ts` is the facade, not a second application shell.
- Web Local, Web Folder, Tauri Native, and Mobile Draft paths should remain explicit and contract-driven.
- Prefer extending shared contracts over adding one-off special cases.

### Native boundary

`src-tauri/`

- The Rust layer should remain a thin native boundary for filesystem access, desktop integration, and operating-system-specific behavior.
- Avoid moving product orchestration or page-level policy into Tauri commands unless the browser boundary truly cannot support it.

## Agent Delivery Pipeline

Every coding task should move through this pipeline:

1. Audit the relevant files, workflows, and docs.
2. Confirm the runtime surface and layer being changed.
3. Make the smallest change set that resolves the problem without creating a parallel architecture.
4. Validate with the smallest relevant command set.
5. Update docs when code behavior, architecture assumptions, or release expectations changed.
6. Report concrete outcomes and unresolved risks.

## Local Agent Asset Discipline

Local tool folders such as `.agent/`, `.agents/`, `.claude/`, and `.Codex/` are collaboration tooling only.

- `.agent/` is reserved for Antigravity-specific local rules.
- `.agents/skills/` is the shared repo-local skill source.
- `.claude/` should behave as a compatibility layer over shared skills instead of drifting into a second skill library.
- These folders are not product architecture and should not be described as runtime application structure.

See `docs/LOCAL-AGENT-ASSETS.md` for the canonical split.

## Required Validation Baseline

For most frontend, docs, and workflow changes, the minimum validation set is:

- `npm run lint`
- `npm run test`
- `npm run build`

For Tauri and Rust changes, add targeted validation when practical, for example:

- `cargo fmt --check --manifest-path src-tauri/Cargo.toml`

If a relevant validation step cannot be run, state that explicitly.

## Release Discipline

Do not claim platform support beyond what the repo can currently validate.

Current communication rule:

- Desktop web: macOS, Windows, Linux
- Desktop app releases: macOS and Windows are documented in the current release workflow
- Linux desktop app release automation is not yet documented as active in the current workflow and must be treated as unconfirmed until that changes

If release automation changes, update `README.md`, `README_zh-CN.md`, `docs/RELEASE.md`, and the workflow in the same scope.
