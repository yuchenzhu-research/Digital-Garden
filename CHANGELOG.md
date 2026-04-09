# CHANGELOG

> Human-readable release notes for the project.  
> This file does not try to mirror every commit. It summarizes the changes that matter to users, collaborators, and maintainers.

---

## [Unreleased]

### Added
- Added `.github/workflows/desktop-smoke.yml` to give the Tauri shell a dedicated macOS / Windows / Linux smoke-build workflow instead of relying only on repo-level CI checks.
- Added `docs/LOCAL-AGENT-ASSETS.md` to define the local-only agent directory split:
  - `.agent/` for Antigravity rules
  - `.agents/skills/` as the canonical shared repo-local skill library
  - `.claude/` as a compatibility layer instead of a second source of truth
- Added `docs/DESIGN-FOUNDATION.md` to prepare visual-system work before committing to a final UI style direction.
- Added semantic visual and motion foundation tokens to `src/app/globals.css`, including canvas, surface, ink, accent, line, scrim, and timing roles.
- Added the first-stage homepage orchestration consolidation:
  - Added `src/hooks/useHomePageController.ts`
  - Added homepage section components under `src/components/features/home/`
- Added the first EntryEditor state consolidation batch:
  - Added `src/hooks/useEntryEditorFormState.ts`
  - Added `src/hooks/useEntryEditorDraftBridge.ts`
- Added the `src/components/features/editor/` section component directory to hold the image stage, hero, sidebar, body, and floating actions.
- Added `src/hooks/useSettingsPanelController.ts` to centralize environment gating, Folder Mode connection, and panel state.
- Added `src/hooks/useDataManagementController.ts` to centralize import/export actions, state refresh, and status message lifecycle.
- Added `src/services/storage-runtime.ts` to centralize repository runtime selection, storage mode, and the lazy proxy.
- Added `src/services/storage-backups.ts` to centralize backup payloads, filename generation, and entry parsing.
- Added `tests/services-guardrails.test.mjs` to guard the service facade and backup contract structure.
- Added `tests/controller-guardrails.test.mjs` to lock the extracted homepage/editor/settings/data shell-controller boundaries.
- Added `tests/storage-backups.test.mjs` to verify backup helper behavior, not just source structure.
- Starting from 2026-04-09, all new release notes and work logs should continue accumulating in this section.

### Changed
- `release.yml` no longer auto-creates releases from pushed tags. Releases now require a manual workflow dispatch with an existing `v*` tag and always start as draft releases.
- `AGENTS.md`, `CLAUDE.md`, `docs/RELEASE.md`, and `docs/TESTING-CI.md` now distinguish version tags, draft releases, desktop smoke validation, and release publishing more explicitly.
- `AGENTS.md`, `CLAUDE.md`, `docs/PROJECT-STRUCTURE.md`, and `docs/ENGINEERING-GUARDRAILS.md` now treat `.agent/` as the Antigravity-specific local config, `.agents/skills/` as the canonical shared skill source, and `.claude/` as a compatibility layer.
- `src/app/globals.css` now starts from semantic design-system primitives instead of only hardcoded “Alet-style” naming, while keeping the current warm editorial baseline visually intact.
- `src/app/page.tsx` was further thinned down from a large page that mixed state and long JSX blocks into a shell that mostly composes a controller and sections.
- `src/components/features/EntryEditor.tsx` no longer keeps draft loading, autosave, close-time persistence, and field coordination inline in the main component body. It now trends back toward a render shell plus publish actions.
- `src/components/features/EntryEditor.tsx` was further reduced from a giant JSX file into an editor shell that mainly handles wiring and publish behavior.
- `src/components/features/SettingsPanel.tsx` no longer holds storage mode checks, Folder Mode connection flow, and reload policy directly.
- `src/components/ui/DataManagement.tsx` no longer holds import/export orchestration, storage refresh, and status timeout lifecycle directly.
- `src/services/entryService.ts` was reduced from a mixed runtime factory + backup utility + facade + proxy file into a thinner facade centered on file operations.
- `src/services/native-storage.ts`, `src/services/web-storage.ts`, and `src/services/web-fs-storage.ts` now share a single backup entry parsing contract.
- `npm run test` now runs the Node test runner with `--experimental-strip-types`, which allows lightweight pure TypeScript utility tests without introducing a new framework.
- `.github/workflows/ci.yml` and `docs/TESTING-CI.md` now reflect the expanded controller/service/backup guardrail suite instead of describing the tests as docs-only checks.

### Fixed
- Fixed the new desktop smoke workflow command, which incorrectly used `tauri build --bundles none` even though Tauri 2 expects `--no-bundle` for bundle-free smoke builds.
- Fixed the stale `src-tauri/Cargo.lock` package version entry so local Tauri verification matches the current `3.0.0` desktop shell metadata.
- Fixed the release policy ambiguity where pushing a `v*` tag implicitly created a release, which made it too easy to treat tags and published releases as the same thing.
- Fixed the lack of a dedicated cross-platform desktop smoke workflow, which left Linux/macOS/Windows desktop-shell confidence too dependent on inference.
- Fixed the local tooling ambiguity where `.agents/` and `.claude/` looked like parallel repo structures instead of local-only agent assets with different responsibilities.
- Fixed the lack of a neutral UI-preparation layer, where future visual exploration would otherwise have started directly from component-level hardcoded colors and motion timings.
- Fixed the continued growth of the homepage shell file, where page-level orchestration and concrete section rendering were still mixed together.
- Fixed the continued single-file buildup in the editor, where form state, draft bridging, and render structure all lived in one component.
- Fixed the way settings/data UI components were directly coupled to storage strategy and mutation lifecycle.
- Fixed the duplicated repository selection logic inside `entryService`, which kept inflating the facade.
- Fixed the mismatch where adapters accepted backup payloads inconsistently and only the service layer silently normalized them.
- Fixed the lack of guardrails around controller extraction, which would have made it easy to push orchestration back into page and UI shells.
- Fixed the previous gap where backup helper functions were only guarded structurally and not checked for actual payload behavior.

### Removed
- Removed large inline homepage section implementations from `src/app/page.tsx` and moved them into dedicated feature sections.
- Removed the inline mobile draft / desktop draft adapter bridge from `src/components/features/EntryEditor.tsx`.
- Removed most inline storage orchestration from `src/components/features/SettingsPanel.tsx` and `src/components/ui/DataManagement.tsx`.
- Removed duplicate adapter instantiation paths and the local backup parser from `src/services/entryService.ts`.
- Removed the noisy `MODULE_TYPELESS_PACKAGE_JSON` warning from the default test command so CI logs stay focused on actual failures.

### Compatibility Impact
- None.

### Migration Notes
- If you want a rollback point only, create and push a tag without running the release workflow.
- If you want release artifacts, run the `Release` workflow manually with an existing `v*` tag, review the generated draft release, and publish it manually in GitHub.
- If local agent tooling changes further, keep `.agent/` for Antigravity-only rules and keep shared skills converged under `.agents/skills/`.
- If the visual direction changes later, start by extending the semantic foundation in `docs/DESIGN-FOUNDATION.md` and `src/app/globals.css` before rewriting feature components.
- If homepage work continues, do not move section details and page control logic back into `page.tsx`.
- If the editor keeps evolving, do not move autosave / discard / close / hydrate logic back into the `EntryEditor.tsx` body.
- If settings or data tooling grows further, prefer the corresponding controller hook instead of pushing storage branches back into UI components.
- If storage adapters or the backup contract expand further, prefer `storage-runtime.ts` and `storage-backups.ts` instead of scattering mode checks and parsers across files again.
- If test coverage expands further, prefer lightweight contract/smoke guards first before introducing a heavier frontend test runner.
- History before 2026-04-09 has been compressed into the “Historical Baseline” section below. New release notes should continue from this section.

---

## [2026-04-09: Engineering Guardrails, CI Baseline, and Agent Collaboration Constraints] - 2026-04-09

### Added
- Added `docs/ENGINEERING-GUARDRAILS.md` to formally define the engineering boundaries for App Shell, UI, Visual, Services, and the Tauri native boundary.
- Added `docs/TESTING-CI.md` to define default verification commands, CI responsibilities, and the direction for future test expansion.
- Added `docs/RELEASE.md` to separate Desktop Web support from Desktop App support so release messaging no longer stays ambiguous.
- Added `.github/workflows/ci.yml` to establish a minimal daily guardrail pipeline with lint, guardrail tests, web build, and Rust formatting checks.
- Added `tests/guardrails.test.mjs` to provide lightweight regression protection for key engineering docs, platform claims, and Tauri metadata.
- Added `CHANGELOG.md` and `DEVLOG.md` as the formal engineering log entry points, with ongoing updates starting from 2026-04-09.

### Changed
- `AGENTS.md` and `CLAUDE.md` were upgraded into formal collaboration entry points instead of remaining generic command notes.
- `README.md` and `README_zh-CN.md` now explicitly distinguish Linux desktop web support from unconfirmed Linux desktop app release automation.
- `package.json` gained `test` and `check` scripts so `lint + test + build` becomes the default verification baseline.
- `src-tauri/Cargo.toml` was updated from placeholder metadata to real project metadata.
- `docs/PROJECT-STRUCTURE.md` now includes changelog/devlog and the new engineering guardrail docs as part of the formal documentation structure.

### Fixed
- Fixed the lack of a regular CI workflow, where the project effectively relied on the release workflow as the main source of truth.
- Fixed the lack of formal engineering log files at the repo root, which made staged evolution hard to trace.
- Fixed README wording around Linux support that could be misread as meaning Linux desktop app publishing was already automated.
- Fixed the Tauri Rust package metadata still exposing template-level placeholder values.

### Removed
- Removed the previous state where structure and collaboration rules existed mostly as verbal conventions instead of explicit docs and tests.

### Compatibility Impact
- This round did not change runtime behavior or the user data model. It mainly affects engineering collaboration, release messaging, and maintenance constraints.
- Desktop Web support messaging for macOS / Windows / Linux remains intact, but Desktop App release wording is now intentionally stricter.

### Migration Notes
- Future engineering work should follow `AGENTS.md`, `CLAUDE.md`, `docs/ENGINEERING-GUARDRAILS.md`, `docs/TESTING-CI.md`, and `docs/RELEASE.md` first.
- New release entries should continue accumulating under `Unreleased`; detailed day-to-day work should go into `DEVLOG.md`.

---

## [Historical Baseline: Project Start through 2026-04-08] - 2026-04-08

### Added
- The project gradually evolved from early static Markdown / exhibition experiments into Bibliotheca Vitae as a Digital Garden product.
- Established a frontend foundation based on Next.js 16 App Router, React 19, Tailwind CSS v4, Framer Motion, GSAP, Lenis, and React Three Fiber.
- Built the core experience around the horizontal archive rail, detail overlay, visual-first editor, search/filtering, personal entry editing, and local image + backup import/export workflows.
- Added the Tauri v2 desktop shell, local file system access, global shortcuts, tray support, and desktop window visuals.
- Added multiple storage modes: Browser Local, Folder Mode, Tauri Native, and Mobile Local Drafts.
- Added multilingual READMEs, architecture docs, project structure docs, and a longer-term blueprint.

### Changed
- The project gradually converged from earlier `Bibliotheca Markdown Museum / Bibliotheca Academica` directions into the current local-first `Bibliotheca Vitae` digital garden.
- The stack evolved from Astro/content-collection phases into a Next.js SPA and then into a shared Web + Tauri desktop application architecture.
- Product framing evolved from a static exhibition page into a browsable, appendable, editable, backup-capable local archive system.
- Project structure moved from a more cluttered root layout toward the current `src/`, `src-tauri/`, `docs/`, and multilingual README layering.
- The project converged on the `v3.0.0` desktop MVP architecture milestone on 2026-03-23.

### Fixed
- Fixed key issues around image focus, card layout, scroll triggers, detail overlay scroll locking, editor overlay integration, Tauri invoke result handling, WebFS typing and production build behavior, and Folder Mode image rendering.
- Fixed a range of engineering issues around doc boundaries, naming drift, README language alignment, runtime/lint hygiene, and mixing static assets with documentation assets.
- Fixed the local backup + embedded image loop so export/import behaves more consistently across storage modes.

### Removed
- Removed most of the major structure left over from the Astro era and older naming phases.
- Gradually reduced the influence of legacy naming, older visual drafts, and a more tangled root-level layout.

### Compatibility Impact
- Desktop Web has consistently targeted macOS / Windows / Linux, but as of 2026-04-08 Desktop App release capability was still explicitly documented mainly for macOS / Windows.
- Mobile remains a constrained runtime focused on browsing and local drafts, not a full desktop publishing workflow.

### Migration Notes
- Future evolution should continue along the `src/services/` contract and adapter boundaries instead of moving complexity back into page-level code.
- Visual system work, release messaging, engineering guardrails, and multilingual READMEs should stay aligned so the repo does not drift back into “code says one thing, docs say another, workflow says a third.”
