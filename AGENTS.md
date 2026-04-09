# Codex Project Configuration
Project: Digital Garden | Bibliotheca Vitae
Type: Next.js + Tauri (Desktop App)

## 🗂️ Repo Boundaries
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

## 🏗️ Architecture Guardrails
- `src/app/page.tsx` should stay an orchestration shell, not a long-lived home for storage branching, heavy motion logic, or editor internals.
- `src/components/features/` owns product sections and flows; it should not become a second service layer.
- `src/components/ui/` owns reusable UI primitives and presentation helpers; it should not choose storage modes or environment fallbacks.
- `src/components/visual/` owns decorative or motion-heavy primitives; it must not fetch archive data or hold business rules.
- `src/services/` is the local-first application boundary. Storage adapters should implement a shared contract instead of duplicating divergent behavior.
- `src-tauri/` must remain a thin native boundary for filesystem and desktop integrations. Do not move product orchestration into Rust by default.
- Prefer extending existing contracts and boundaries over adding parallel paths.

## 🧠 Preferred Agent Skills (Local Context)
Prefer repo-local skills when present. If they are missing, fall back to installed Codex skills and existing repo conventions.

1.  **Vercel Best Practices**: 
    - Preferred local path: `./.agents/skills/vercel-agent-skills`
    - Use this for all Next.js App Router, Server Actions, and caching logic.

2.  **Tauri Desktop Integration**:
    - Preferred local path: `./.agents/skills/tauri-action/README.md`
    - Use this when writing GitHub Actions workflows or modifying `src-tauri`.
    - Local CLI command: Use `npx tauri` (do not use global tauri).

3.  **Frontend Design System**:
    - Focus on "Renaissance Aesthetics" combined with "Apple-style Motion".
    - Library: Tailwind CSS v4 + Framer Motion.

## 🤖 Agent Pipeline
These rules apply to OpenAI Codex, Claude Code, Google Antigravity/Gemini-style agents, and other coding agents working in this repository.

1. **Audit first**: read the relevant source files, docs, and workflows before proposing structure changes.
2. **Respect boundaries**: do not treat this project like a SaaS app. The "backend" here is primarily local storage adapters plus the Tauri native layer.
3. **Keep changes scoped**: prefer targeted refactors over large rewrites, especially around `src/app/page.tsx`, `src/services/`, and `src-tauri/`.
4. **Validate before closing**: run the smallest relevant verification set before reporting completion.
5. **Sync docs with code**: if architecture, release expectations, or workflow behavior changes, update the corresponding docs in the same task.
6. **Do not overclaim platform support**: Desktop web supports macOS, Windows, and Linux. Desktop app release automation must match what docs claim.

## 🛠️ Common Commands
- **Dev (Web)**: `npm run dev`
- **Dev (App)**: `npx tauri dev` (Opens the native Mac app window)
- **Build (App)**: `npx tauri build`
- **Lint**: `npm run lint`
- **Test**: `npm run test`
- **Build (Web)**: `npm run build`
- **Release**: `git tag v0.1.0 && git push origin v0.1.0` (Triggers GitHub Action)

## 🚨 Guidelines
- **Local-First**: Prioritize saving data to local storage/fs.
- **System Integration**: Use Tauri APIs to access the file system.
- **Docs Placement**: Keep multilingual `README*.md` at the repo root; place longer internal documentation in `docs/`.
- **Docs Assets**: Store documentation-only images and screenshots in `docs/assets/`; keep `public/` for runtime assets only.
- **Testing Baseline**: `npm run lint`, `npm run test`, and `npm run build` are the minimum checks for frontend/documentation changes. Rust or workflow changes may require extra validation.
- **Source of Truth**: Use `docs/ARCHITECTURE.md`, `docs/ENGINEERING-GUARDRAILS.md`, `docs/TESTING-CI.md`, `docs/RELEASE.md`, `docs/PROJECT-STRUCTURE.md`, `docs/LOCAL-AGENT-ASSETS.md`, and `docs/DESIGN-FOUNDATION.md` as the living engineering references for this repo.
