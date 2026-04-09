# DEVLOG

---

## 2026-04-09 / Phase 5 Preparation: Project Structure Cleanup and Visual Foundation Setup

### What changed
- Added `docs/LOCAL-AGENT-ASSETS.md` to describe the local-only agent directory model:
  - `.agent/` is reserved for Antigravity-specific rules
  - `.agents/skills/` is the canonical shared repo-local skill library
  - `.claude/` is a compatibility layer and should not drift into its own forked skill tree
  - `.Codex/` remains optional local tool state
- Updated `AGENTS.md`, `CLAUDE.md`, `docs/PROJECT-STRUCTURE.md`, and `docs/ENGINEERING-GUARDRAILS.md` so project structure and agent pipeline docs all describe the same local-tooling split.
- Added `docs/DESIGN-FOUNDATION.md` as a pre-style visual-system brief. This document intentionally does not lock the project into a final UI direction yet.
- Updated `src/app/globals.css` with semantic visual groundwork:
  - canvas / surface / ink / accent / line / scrim token families
  - motion duration and easing tokens
  - shared utility classes such as `surface-panel`, `surface-card`, `frame-hairline`, and semantic text/overlay helpers
- Updated `tests/guardrails.test.mjs` so repo-level tests now also guard:
  - the local agent asset split
  - the existence of the visual foundation doc
  - the presence of semantic visual tokens in `globals.css`

### Problems addressed
- Fixed the ambiguity around `.agent/`, `.agents/`, `.claude/`, and `.Codex/`, which previously looked like overlapping project structure instead of local-only collaboration assets.
- Fixed the lack of a documented canonical source for shared repo-local skills.
- Fixed the design-system starting point so future UI work does not need to begin from scattered hardcoded color and timing values.
- Kept visual preparation general on purpose, so a future direction can be chosen without first undoing premature component redesigns.

### Impacted areas
- `AGENTS.md`
- `CLAUDE.md`
- `docs/PROJECT-STRUCTURE.md`
- `docs/ENGINEERING-GUARDRAILS.md`
- `docs/LOCAL-AGENT-ASSETS.md`
- `docs/DESIGN-FOUNDATION.md`
- `src/app/globals.css`
- `tests/guardrails.test.mjs`
- `CHANGELOG.md`
- `DEVLOG.md`

### Risks / unfinished work
- This preparation round does not decide the final UI style. Hero, cards, overlays, and editor surfaces still keep the current baseline until a stronger art direction is chosen.
- Local filesystem cleanup inside ignored directories such as `.claude/` and `.agents/` still needs to be checked machine-locally after the tracked docs are in place.
- The new semantic utilities are largely preparatory; most feature components do not consume them yet.

### Next step
- Consolidate local ignored agent folders so `.claude/skills/` points back to shared skill sources instead of carrying duplicate copies.
- Then continue Phase 5 with non-destructive visual-system groundwork in shared components before choosing a full aesthetic direction.

## 2026-04-09 / Phase 4 Complete: Test Guardrail Expansion

### Related commits
- `84a55c7` Add controller guardrail tests
- `56d5bfe` Add storage backup behavior tests
- `c12b9cb` Align CI and docs with guardrail suite

### What changed
- Added `tests/controller-guardrails.test.mjs` to lock the boundaries created in earlier phases:
  - homepage shell must stay wired through `useHomePageController`
  - `EntryEditor.tsx` must stay layered through hooks and editor sections
  - `SettingsPanel.tsx` and `DataManagement.tsx` must keep orchestration inside controller hooks
  - extracted controller hooks must remain the owners of the moved orchestration branches
- Added `tests/storage-backups.test.mjs` with real helper-behavior checks for:
  - `createArchiveBackupFilename`
  - `createArchiveBackupPayload`
  - `parseBackupEntries`
  - `parseBackupJson`
- Updated `package.json` so `npm run test` now uses:
  - `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test`
- Updated `.github/workflows/ci.yml` so the CI step name reflects the broader guardrail/smoke scope.
- Updated `docs/TESTING-CI.md` so the documentation matches the current suite instead of describing it as docs-only repo checks.
- After this phase, `npm run test` covers 17 passing guardrail tests across:
  - repo/docs constraints
  - controller boundaries
  - service/runtime boundaries
  - backup helper behavior

### Problems addressed
- Fixed the lack of explicit tests protecting the controller/shell boundaries created in phases 1 through 3.
- Fixed the gap where backup helpers were only guarded structurally, not behaviorally.
- Fixed the mismatch between the actual test suite and the CI/testing docs.
- Reduced CI log noise by removing the typeless-package warning from the default test script.

### Impacted areas
- `tests/controller-guardrails.test.mjs`
- `tests/storage-backups.test.mjs`
- `package.json`
- `.github/workflows/ci.yml`
- `docs/TESTING-CI.md`
- `CHANGELOG.md`
- `DEVLOG.md`

### Risks / unfinished work
- The current test suite is still mostly guardrail-oriented. It does not yet exercise full adapter behavior with fixtures or UI interaction flows in a renderer.
- `storage-runtime.ts` is still primarily protected through source-aware tests, not runtime mocks.
- Visual-system work has not started yet, so there are no style-token or motion-system guardrails yet.

### Next step
- Phase 5 should begin the actual visual-system upgrade:
  - global tokens
  - typography hierarchy
  - motion primitives
  - homepage narrative rhythm
- Once the visual system starts, add lightweight visual guardrails so the new design language does not drift across pages and overlays.

---

## 2026-04-09 / Phase 3 Complete: Service Facade and Backup Contract Consolidation

### Related commits
- `60cf2b8` Extract storage runtime from entryService
- `2d3cbd0` Align adapters on shared backup contract
- `3f9df80` Add storage service guard tests

### What changed
- Added `src/services/storage-runtime.ts` to centralize:
  - `StorageMode`
  - `StorageModeInfo`
  - `getRepository`
  - shared WebFS / WebStorage runtime handling
  - the lazy repository proxy
- Reduced `src/services/entryService.ts` from 462 lines to 288 lines by removing:
  - duplicated repository instance selection logic
  - the local backup parser
  - large runtime-coupled mode branches
- Added `src/services/storage-backups.ts` to centralize:
  - `parseBackupEntries`
  - `parseBackupJson`
  - `createArchiveBackupPayload`
  - `createArchiveBackupFilename`
- Aligned backup payload handling across all three adapters:
  - `src/services/web-storage.ts`
  - `src/services/web-fs-storage.ts`
  - `src/services/native-storage.ts`
- Added `tests/services-guardrails.test.mjs` to guard these structural constraints:
  - `entryService.ts` no longer directly instantiates adapters
  - the backup parser is defined only in `storage-backups.ts`
  - all three adapters explicitly consume the shared backup contract

### Problems addressed
- Fixed the mixed responsibility problem in `entryService.ts`, which had been handling runtime factory logic, storage mode logic, backup contract logic, the lazy proxy, and the facade at the same time.
- Fixed the duplicated adapter selection logic maintained separately by `getRepository` and the default export proxy.
- Fixed the repeated backup payload parsing logic that had existed in `entryService`, `native-storage`, and elsewhere.
- Fixed the inconsistency where adapter `importData()` methods did not accept the same “entries array vs. backup payload object” shapes.

### Impacted areas
- `src/services/entryService.ts`
- `src/services/storage-runtime.ts`
- `src/services/storage-backups.ts`
- `src/services/web-storage.ts`
- `src/services/web-fs-storage.ts`
- `src/services/native-storage.ts`
- `src/services/index.ts`
- `tests/services-guardrails.test.mjs`
- `CHANGELOG.md`
- `DEVLOG.md`

### Risks / unfinished work
- `entryService.ts` still contains `exportToFile` / `importFromFile` and browser download logic. If service-layer cleanup continues, those could move into a more focused file-operations module.
- Although all three adapters now share the backup parser, there is still duplication around draft persistence, storage location semantics, and image import/export behavior.
- The new service tests are still structural guardrails, not behavior-level contract tests.

### Next step
- Phase 4 should add clearer smoke/contract guards for:
  - storage runtime behavior
  - backup contract behavior
  - page/controller smoke coverage
- If service cleanup continues beyond this phase, the highest-value targets are still `src/services/web-fs-storage.ts` and `src/services/native-storage.ts`, especially around repeated draft/image/path logic.

---

## 2026-04-09 / Phase 2 Complete: Editor and Storage-Related UI Consolidation

### Related commits
- `5b0cf31` Extract EntryEditor draft and form hooks
- `a02fec6` Split EntryEditor into section components
- `43c2d36` Extract SettingsPanel storage controller
- `e83e36c` Extract DataManagement controller hook

### What changed
- Phase 2 fully consolidated three high-risk UI areas:
  - `src/components/features/EntryEditor.tsx`
  - `src/components/features/SettingsPanel.tsx`
  - `src/components/ui/DataManagement.tsx`
- `EntryEditor` now has two layers:
  - state/draft bridge hooks:
    - `src/hooks/useEntryEditorFormState.ts`
    - `src/hooks/useEntryEditorDraftBridge.ts`
  - editor section components:
    - `src/components/features/editor/AutoResizeTextarea.tsx`
    - `src/components/features/editor/EntryEditorImageStage.tsx`
    - `src/components/features/editor/EntryEditorHero.tsx`
    - `src/components/features/editor/EntryEditorSidebar.tsx`
    - `src/components/features/editor/EntryEditorBody.tsx`
    - `src/components/features/editor/EntryEditorActions.tsx`
- `SettingsPanel` now uses `src/hooks/useSettingsPanelController.ts` to handle:
  - environment gating
  - Folder Mode connection behavior
  - connection-in-progress state and reload policy
- `DataManagement` now uses `src/hooks/useDataManagementController.ts` to handle:
  - export/import actions
  - storage state refresh
  - status message lifecycle and timeout cleanup
  - file input refs and dropdown state
- Main file sizes after the consolidation:
  - `EntryEditor.tsx`: `631 -> 250`
  - `SettingsPanel.tsx`: `138 -> 131`
  - `DataManagement.tsx`: `271 -> 181`

### Problems addressed
- Fixed the fact that `EntryEditor.tsx` held state, autosave, draft hydration, publish actions, and long render structure all at once.
- Fixed the fact that `SettingsPanel.tsx` directly held environment checks, Folder Mode connection, and page reload policy.
- Fixed the fact that `DataManagement.tsx` directly held import/export orchestration, storage refresh, and timeout lifecycle logic.
- Turned the phase-2 goal into an actual “UI components render, controller hooks orchestrate” structure, instead of simply moving helpers around.

### Impacted areas
- `src/components/features/EntryEditor.tsx`
- `src/components/features/editor/`
- `src/hooks/useEntryEditorFormState.ts`
- `src/hooks/useEntryEditorDraftBridge.ts`
- `src/components/features/SettingsPanel.tsx`
- `src/hooks/useSettingsPanelController.ts`
- `src/components/ui/DataManagement.tsx`
- `src/hooks/useDataManagementController.ts`
- `CHANGELOG.md`
- `DEVLOG.md`

### Risks / unfinished work
- `EntryEditor` is no longer a full orchestrator, but publish behavior and image upload still live in the shell component, so there is still room to tighten it further.
- `SettingsPanel` and `DataManagement` currently stop at controller extraction; they are not yet unified behind a higher-level storage surface contract.
- This phase did not add dedicated UI/controller smoke tests. Validation still relies mostly on lint, build, and repo-level guardrails.

### Next step
- Phase 3 should move into `src/services/entryService.ts` and the storage adapters so facade and contract boundaries actually line up.
- Priority review targets after this phase were `src/services/web-fs-storage.ts`, `src/services/native-storage.ts`, and `src/services/mobile-draft.ts`.

---

## 2026-04-09 / Phase 2 Batch 1: EntryEditor Draft Bridge and Form State Extraction

### Related commits
- `5b0cf31` Extract EntryEditor draft and form hooks

### What changed
- Extracted two dedicated hooks from `src/components/features/EntryEditor.tsx`:
  - `src/hooks/useEntryEditorFormState.ts`
  - `src/hooks/useEntryEditorDraftBridge.ts`
- `useEntryEditorFormState.ts` now owns:
  - title, figure, moment, narrative, keywords, and image state
  - keyword add/remove behavior
  - draft snapshot generation
- `useEntryEditorDraftBridge.ts` now owns:
  - mobile draft / desktop draft adapter selection
  - draft hydration
  - autosave
  - discard behavior
  - close-time persistence
  - `lastSaved` tracking
- `src/components/features/EntryEditor.tsx` was reduced to:
  - image upload/removal
  - publish/update calls
  - toast handling
  - editor layout and interaction rendering
- After the split, `EntryEditor.tsx` went from 631 lines down to 521 lines.

### Problems addressed
- Fixed the fact that `EntryEditor.tsx` held form state, draft storage bridging, and rendering in one place.
- Fixed the fact that mobile draft and desktop draft logic were inlined directly into the component body, which kept growing the file.
- Created a more stable state entry point for the next batch, where editor sub-sections and action layers would be split further.

### Impacted areas
- `src/components/features/EntryEditor.tsx`
- `src/hooks/useEntryEditorFormState.ts`
- `src/hooks/useEntryEditorDraftBridge.ts`
- `CHANGELOG.md`
- `DEVLOG.md`

### Risks / unfinished work
- `EntryEditor.tsx` still contained a large render structure, image upload logic, and publish behavior after this batch.
- `AutoResizeTextarea` was still inlined inside the editor file at this point.
- This batch had not yet touched `SettingsPanel.tsx` or `DataManagement.tsx`.

### Next step
- Continue splitting `EntryEditor.tsx` render sections into image stage, metadata/sidebar, narrative body, and floating actions.
- Then move into `SettingsPanel.tsx` and `DataManagement.tsx` to further tighten storage switching and refresh behavior in the UI layer.

---

## 2026-04-09 / Phase 1: Homepage Orchestration Thinning

### Related commits
- `45d7a10` Extract home page controller hook
- `d0a7c43` Extract home page sections

### What changed
- Moved the main homepage control logic out of `src/app/page.tsx` into `src/hooks/useHomePageController.ts`.
- The controller now centralizes:
  - user entry loading
  - mobile draft state refresh
  - search and category filtering
  - editor / detail overlay state
  - dimming intensity preference
  - page actions such as create/edit/delete/clearFilters
- Split three large homepage sections and the footer out of `page.tsx` into:
  - `src/components/features/home/FeaturedArchiveSection.tsx`
  - `src/components/features/home/PersonalCollectionSection.tsx`
  - `src/components/features/home/ArchiveBrowserSection.tsx`
  - `src/components/features/home/HomeFooter.tsx`
- After the split, `src/app/page.tsx` was narrowed to:
  - dynamic loading of heavier components
  - consuming the home controller
  - composing sections, overlays, and the editor

### Problems addressed
- Fixed the issue where the homepage file held a large amount of state orchestration and long section JSX at the same time.
- Fixed the missing boundary between the page shell and section rendering, which had allowed `page.tsx` to keep growing.
- Created a more stable page-layer boundary for the next phase, which moved into the editor and storage-related UI.

### Impacted areas
- `src/app/page.tsx`
- `src/hooks/useHomePageController.ts`
- `src/components/features/home/`
- `CHANGELOG.md`
- `DEVLOG.md`

### Risks / unfinished work
- This phase did not yet touch `EntryEditor.tsx`, `SettingsPanel.tsx`, or `DataManagement.tsx`.
- `useHomePageController.ts` remained fairly large; it was an intermediate consolidation point, not the final shape.
- Search/filter, personal collection, and archive browser had been split into sections, but not yet into finer-grained action/view-model layers.

### Next step
- Phase 2 should move into `EntryEditor.tsx` and storage-related UI.
- After that, `useHomePageController.ts` could continue being thinned along controller / selector / action boundaries.

---

## 2026-04-09 / Engineering Guardrails, CI Baseline, and Log System Setup

### Related commits
- `6b8b8c4` Establish engineering guardrails and CI baseline

### What changed
- Established a formal engineering guardrail doc set for the repository:
  - `docs/ENGINEERING-GUARDRAILS.md`
  - `docs/TESTING-CI.md`
  - `docs/RELEASE.md`
- Upgraded `AGENTS.md` and `CLAUDE.md` from generic command notes into formal collaboration entry points:
  - explicit runtime surfaces: Desktop Web / Mobile Web / Tauri Desktop App
  - explicit layer boundaries: App Shell / Feature / UI / Visual / Services / Tauri Native
  - explicit agent pipeline: audit first, then change, then verify, then sync docs
- Added a real day-to-day CI workflow:
  - new `.github/workflows/ci.yml`
  - minimal verification chain for `lint`, `guardrail tests`, `web build`, and `cargo fmt --check`
- Added lightweight repository guard tests:
  - new `tests/guardrails.test.mjs`
  - uses `node --test` to guard key docs, platform claims, and Tauri metadata
- Added `CHANGELOG.md` and `DEVLOG.md` at the repo root so project history is no longer scattered only across commit messages.
- Updated `README.md`, `README_zh-CN.md`, `docs/PROJECT-STRUCTURE.md`, `package.json`, and `src-tauri/Cargo.toml` so engineering constraints, release messaging, and verification commands all reflect current reality.

### Problems addressed
- Fixed the fact that the repository only had a release workflow and no regular CI guardrail.
- Fixed the fact that engineering boundaries depended mostly on verbal agreement instead of explicit docs and automated checks.
- Fixed the way Linux support wording in the README could be misread as meaning Linux desktop app releases were already automated.
- Fixed the absence of formal changelog/devlog files at the root, which made staged project history difficult to follow.
- Fixed the placeholder metadata still left in `Cargo.toml`.

### Impacted areas
- `AGENTS.md`
- `CLAUDE.md`
- `README.md`
- `README_zh-CN.md`
- `docs/PROJECT-STRUCTURE.md`
- `docs/ENGINEERING-GUARDRAILS.md`
- `docs/TESTING-CI.md`
- `docs/RELEASE.md`
- `.github/workflows/ci.yml`
- `tests/guardrails.test.mjs`
- `package.json`
- `src-tauri/Cargo.toml`
- `CHANGELOG.md`
- `DEVLOG.md`

### Risks / unfinished work
- This round established repo-level guardrails, but it did not yet move into deeper cleanup of page orchestrators, storage adapters, or Tauri commands.
- Tests were still light at this stage, focusing mainly on docs/structure/platform claims rather than `src/services/` contracts, page state orchestration, or import/export smoke coverage.
- `next/font` still depended on external font downloads in restricted network environments, so local verification had to distinguish network failure from real build failure.

### Next step
- First thin down `src/app/page.tsx` further.
- Then split `src/components/features/EntryEditor.tsx` so upload, draft handling, publish behavior, and layout state are separated.
- After that, tighten `src/services/entryService.ts`, `src/services/web-fs-storage.ts`, and `src/services/native-storage.ts` so facade and adapter boundaries stabilize further.

---

## 2026-04-08 / Historical Baseline: Project Start through Pre-Logging-System History

### Related commits
- `2026-02-12` ~ `2026-02-15`: moved from early static archive / exhibition experiments into a Next.js SPA and Digital Renaissance UI direction
- `0ba233d` feat: initialize Tauri v2 desktop app environment
- `fd45325` feat(tauri): integrate native file system, global shortcuts, and custom title bar
- `d5a9db0` feat(web): implement dual-mode storage with local file import/export
- `530a806` feat: implement native desktop visuals, system tray, global shortcuts and web file system access API parity
- `c6a899d` refactor: move source code to src/ directory
- `adb9a2c` feat: unify backup management across storage adapters
- `c9ede20` feat: add mobile local draft mode
- `5e43a07` chore: setup desktop mvp architecture and capabilities
- `176a1f5` docs: add long-term blueprint and architectural roadmap

### What changed
- The project began as a static Markdown / exhibition-style concept, went through several naming and positioning changes, and gradually converged on the current `Bibliotheca Vitae`.
- The early architecture went through Astro content-collection and static archive / academic exhibition phases, then moved into a Next.js SPA refactor on 2026-02-14.
- Between 2026-02-14 and 2026-02-15, the project concentrated on:
  - horizontal rail and card storytelling
  - detail overlays
  - editor overlays
  - visual theme and background layering
  - custom cursor and a stronger gallery-book composition style
- Starting 2026-02-16, the project entered a Tauri v2 + local storage integration phase:
  - native file system
  - global shortcuts
  - desktop title bar / window capabilities
  - web dual-mode storage
  - search, filtering, and image management
- From 2026-02-22 to 2026-03-11, the project gradually built a fuller local-first experience:
  - native desktop visuals
  - Web File System parity
  - personal entry editing
  - cross-adapter backup management
  - embedded local image backups
  - mobile local draft mode
  - architecture docs and repo-boundary docs
- On 2026-03-23, the project reached the `v3.0.0` desktop MVP architecture milestone and added the blueprint plus install/download docs.

### Problems addressed
- Fixed the instability caused by the project’s early shifting identity, naming, UI language, and stack choices, gradually converging on the current product direction.
- Fixed the earlier “exhibition only, no local archive loop” limitation by adding editing, storage, import/export, and desktop shell capabilities.
- Fixed inconsistencies around images and backups across multiple storage modes.
- Fixed gradual drift between multilingual READMEs, architecture docs, structure boundaries, and the real codebase.

### Impacted areas
- `src/app/`
- `src/components/features/`
- `src/components/ui/`
- `src/components/visual/`
- `src/services/`
- `src/lib/`
- `src-tauri/`
- `README*.md`
- `docs/`

### Risks / unfinished work
- As of 2026-04-08, there was still clear large-file pressure in page orchestration, editor state, storage facade/adapters, and Tauri commands.
- The visual experience had matured, but motion and section choreography were still not sufficiently primitive-ized.
- The Desktop Web / Mobile Web / Tauri Desktop boundaries were already documented, but engineering consolidation and test guardrails were still incomplete.

### Next step
- Starting 2026-04-09, new work should no longer extend a generic historical recap. Instead, actual engineering work should be logged above on a day-by-day basis.
