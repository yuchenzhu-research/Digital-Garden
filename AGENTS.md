# Codex Project Configuration
Project: Digital Garden | Bibliotheca Vitae
Type: Next.js + Tauri (Desktop App)

## Read First: Project Constitution
**Before starting any work, read [`CONSTITUTION.md`](CONSTITUTION.md) in full.** It is the highest-level governance document for this repository, covering project invariants, architecture guardrails, known risks, and anti-patterns. This file (`AGENTS.md`) provides agent-specific configuration; `CONSTITUTION.md` provides the project-wide rules that every contributor — human or agent — must follow.

## Default Reading Order
- 1. Read `CONSTITUTION.md`
- 2. Read `AGENTS.md`
- 3. Read the task-specific documents listed in ## Specialist Documents
- 4. If your tool auto-loads a tool-specific shim such as `CLAUDE.md`, treat it as an overlay on top of `AGENTS.md`, not a parallel rulebook

## Document Responsibilities
- `CONSTITUTION.md` = project constitution, invariants, quality gates, risk register, anti-patterns
- `AGENTS.md` = shared cross-agent operating handbook for this repository
- `CLAUDE.md` = thin Claude compatibility shim that inherits `AGENTS.md`
- `README*.md` = product-facing onboarding and installation guidance
- `docs/*.md` = specialist references for architecture, testing, release, design, and local tooling

## Repo Boundaries
- **Product source**: `src/`, `src-tauri/`, `public/`
- **Root docs**: `README*.md`, `CHANGELOG.md`, `DEVLOG.md`, `LICENSE`
- **Long-form docs**: `docs/`
- **Local-only agent assets**: `.agents/`, `.claude/`, `.Codex/`, `.agent/` (tooling only; not product source)
- **Build outputs**: `.next/`, `out/`, `node_modules/`, `src-tauri/target/` (generated artifacts; not project structure)

## 🤖 Local Agent Asset Roles
- `.agent/` is reserved for the Antigravity agent system and its local rules. Keep it.
- `.agents/skills/` is the canonical shared repo-local skill library for Codex, Claude, and similar coding agents.
- `.claude/` should stay a compatibility layer over shared skills, not a second independent source of truth.
- `.Codex/` is optional local tool state. Do not create or document product logic there.
- See `docs/LOCAL-AGENT-ASSETS.md` for the current consolidation rule.

## 🧭 Runtime Surfaces
- **Desktop Web**: full archive browsing plus local folder/browser-local persistence
- **Mobile Web**: browse plus browser-local drafts only, not a full archive-management surface
- **Tauri Desktop App**: native desktop shell for local-first archive management on disk

## 📖 Specialist Documents
- **Architecture**: `docs/ARCHITECTURE.md`
- **Guardrails**: `docs/ENGINEERING-GUARDRAILS.md`
- **Testing / CI**: `docs/TESTING-CI.md`
- **Release discipline**: `docs/RELEASE.md`
- **Project structure**: `docs/PROJECT-STRUCTURE.md`
- **Local agent assets**: `docs/LOCAL-AGENT-ASSETS.md`
- **Design system**: `docs/DESIGN-FOUNDATION.md`
- **Historical change log**: `CHANGELOG.md`, `DEVLOG.md`

## 🏗️ Architecture Guardrails
- `src/app/page.tsx` should stay an orchestration shell, not a long-lived home for storage branching, heavy motion logic, or editor internals.
- `src/components/features/` owns product sections and flows; it should not become a second service layer.
- `src/components/ui/` owns reusable UI primitives and presentation helpers; it should not choose storage modes or environment fallbacks.
- `src/components/visual/` owns decorative or motion-heavy primitives; it must not fetch archive data or hold business rules.
- `src/services/` is the local-first application boundary. Storage adapters should implement a shared contract instead of duplicating divergent behavior.
- `src-tauri/` must remain a thin native boundary for filesystem and desktop integrations. Do not move product orchestration into Rust by default.
- Prefer extending existing contracts and boundaries over adding parallel paths.

## Agent Pipeline
These rules apply to OpenAI Codex, Claude Code, Google Antigravity/Gemini-style agents, and other coding agents working in this repository.

1. **Audit first**: read the relevant source files, docs, and workflows before proposing structure changes.
2. **Respect boundaries**: do not treat this project like a SaaS app. The "backend" here is primarily local storage adapters plus the Tauri native layer.
3. **Keep changes scoped**: prefer targeted refactors over large rewrites, especially around `src/app/page.tsx`, `src/services/`, and `src-tauri/`.
4. **Validate before closing**: run the smallest relevant verification set before reporting completion.
5. **Sync docs with code**: if architecture, release expectations, or workflow behavior changes, update the corresponding docs in the same task.
6. **Do not overclaim platform support**: Desktop web supports macOS, Windows, and Linux. Desktop app release automation must match what docs claim.
7. **Release discipline**: treat Git tags as version anchors. GitHub Releases must be promoted manually from a draft workflow, not published implicitly by pushing a tag.

## 🧩 Tool-Specific Shim Rule
- Keep tool-specific entry files such as `CLAUDE.md` thin.
- They may add compatibility notes, but they must not restate or fork the full repository rules.
- If shared agent process changes, update `AGENTS.md` first and let shim files inherit it.

## 🛠️ Common Commands
- **Dev (Web)**: `npm run dev`
- **Dev (App)**: `npx tauri dev` (Opens the native Mac app window)
- **Build (App)**: `npx tauri build`
- **Lint**: `npm run lint`
- **Test**: `npm run test`
- **Build (Web)**: `npm run build`
- **Version Tag**: `git tag v0.1.0 && git push origin v0.1.0` (Creates a version anchor only)
- **Draft Release**: run the GitHub Actions `Release` workflow manually with an existing `v*` tag

## 🚨 Guidelines
- **Local-First**: Prioritize saving data to local storage/fs.
- **System Integration**: Use Tauri APIs to access the file system.
- **Docs Placement**: Keep multilingual `README*.md` at the repo root; place longer internal documentation in `docs/`.
- **Docs Assets**: Store documentation-only images and screenshots in `docs/assets/`; keep `public/` for runtime assets only.
- **Testing Baseline**: `npm run lint`, `npm run test`, and `npm run build` are the minimum checks for frontend/documentation changes. Rust or workflow changes may require extra validation.
- **Source of Truth**: Use `docs/ARCHITECTURE.md`, `docs/ENGINEERING-GUARDRAILS.md`, `docs/TESTING-CI.md`, `docs/RELEASE.md`, `docs/PROJECT-STRUCTURE.md`, `docs/LOCAL-AGENT-ASSETS.md`, and `docs/DESIGN-FOUNDATION.md` as the living engineering references for this repo.
