# UI Overhaul Plan

## Purpose

This document defines the current UI overhaul plan for Bibliotheca Vitae.

It is intentionally narrower and more executable than `docs/BLUEPRINT.md`.

The goal is not to redesign the product into a generic landing page. The goal is to evolve the current local-first archive product into a dark, image-led, Apple-glass archive studio without breaking the archive core.

## Product Invariants

These are the non-negotiable constraints for the overhaul:

1. The product remains a **local-first archive app**.
2. The core unit is still an archive entry / moment, not a generic media card.
3. Desktop web, mobile web, and the Tauri desktop app must remain part of the same product family.
4. The new direction is **image background first**, not video background first.
5. Apple-style glass is a **shell and chrome material**, not a full-page readability killer.
6. Long-form reading, metadata scanning, and editing must remain usable after the visual redesign.

## Target Direction

Working visual direction:

- **Dark-first**
- **Image-led atmosphere**
- **Apple new-system glass for shells and panels**
- **Night Museum / Archive Studio tone**

This means:

- black or near-black canvas
- strong background photography or archive imagery
- translucent dark panels with higher blur and edge highlights
- restrained accent colors
- typography that feels editorial, not dashboard-generic
- motion that is slow and polished, not hyperactive

## What We Are Not Building

This overhaul should not drift into any of these:

- a generic analytics dashboard
- a pure marketing landing page
- a full-video homepage architecture
- a neon cyberpunk interface
- a fully glassed UI where every surface becomes unreadable

## Recommended Document Role Split

- `docs/BLUEPRINT.md`: long-term product and architecture roadmap
- `docs/DESIGN-FOUNDATION.md`: visual principles and semantic foundations
- `docs/UI-OVERHAUL-PLAN.md`: execution plan for the current redesign

## Execution Strategy

The overhaul should be delivered in phases, with each phase producing a stable checkpoint.

Each phase below includes:

- objective
- scope
- engineering requirements
- file targets
- validation
- risk notes

---

## Phase 1: Dark Design System Foundation

### Objective

Convert the current warm editorial baseline into a dark-first semantic system without yet redesigning every screen.

### Scope

- dark canvas tokens
- text hierarchy for dark mode
- Apple-glass shell primitives
- image overlay and scrim primitives
- shared border, shadow, blur, and panel rules

### Engineering Requirements

- Keep semantic token naming instead of hardcoding screen-specific colors.
- Do not apply glass globally. Define shell-only and card-only materials separately.
- Preserve contrast and readability for long text and metadata.
- Keep the system compatible with Tailwind CSS v4 and the current `globals.css` architecture.

### File Targets

- `src/app/globals.css`
- `src/app/layout.tsx`
- `docs/DESIGN-FOUNDATION.md`

### Deliverables

- dark tokens for canvas / surface / ink / accent / line / glow / scrim
- reusable Apple-glass classes for:
  - top nav shell
  - floating toolbar
  - overlay metadata panel
  - search / input bars
- typography scale that works on dark backgrounds

### Validation

- `npm run lint`
- `npm run test`
- `npm run build`
- visual inspection in browser and desktop shell

### Risk Notes

- Overusing blur will hurt readability and performance.
- A token pass without disciplined usage can create a “dark mode theme” instead of a coherent visual system.

---

## Phase 2: Home Hero and Entry Surface

### Objective

Rebuild the homepage hero around a still image background plus Apple-glass input/action surfaces.

### Scope

- home hero
- top navigation
- main capture/search entry bar
- lower quick-action strip

### Engineering Requirements

- Replace background video ideas with image-led atmosphere.
- Use a single strong hero image, not multiple simultaneous moving layers.
- The hero must support at least one core action:
  - append a moment
  - search the archive
  - open the latest collection
- Keep the current page shell architecture; do not move orchestration back into `page.tsx`.

### File Targets

- `src/app/page.tsx`
- `src/components/features/Hero.tsx`
- `src/components/features/home/FeaturedArchiveSection.tsx`
- `src/hooks/useHomePageController.ts`

### Deliverables

- dark image-led hero
- Apple-glass nav
- main action bar with premium shell treatment
- stronger first-impression storytelling without turning the page into a generic landing site

### Validation

- desktop browser preview
- mobile browser preview
- basic Tauri desktop smoke preview

### Risk Notes

- Two separate input bars in the hero may feel redundant; prefer one main bar plus secondary quick actions.
- The homepage must still feel like an archive product, not a newsletter signup page.

---

## Phase 3: Collection Card and Showcase Language

### Objective

Upgrade archive and collection surfaces so they feel like exhibits, not generic cards.

### Scope

- image cards
- featured collection cards
- hover states
- metadata chips
- lower-left “exhibit note” glass overlays

### Engineering Requirements

- Make image cards image-led and dark-first.
- Keep metadata legible over imagery through layered scrims, not excessive blur.
- Ensure hover motion remains subtle and performant.
- Shared card language should work for both curated content and personal entries.

### File Targets

- `src/components/ui/ImageCard.tsx`
- `src/components/features/home/FeaturedArchiveSection.tsx`
- `src/components/features/home/ArchiveBrowserSection.tsx`
- `src/components/features/home/PersonalCollectionSection.tsx`

### Deliverables

- dark collection card system
- glass note panel for card overlays
- consistent entry preview rhythm across homepage and browser views

### Validation

- `npm run lint`
- `npm run test`
- interactive manual check for hover, click, and keyboard access

### Risk Notes

- If cards become too atmospheric, browsing speed will suffer.
- Collection cards and archive cards should share a system, not fork into two styles.

---

## Phase 4: Collection Detail and Archive Reading Mode

### Objective

Turn the detail experience into a museum-like reading mode.

### Scope

- collection detail layout
- archive detail overlay
- left image / right narrative split
- metadata sections
- layered glass info panels

### Engineering Requirements

- Prioritize reading quality over visual effect density.
- Use image-as-stage and panel-as-explanation rather than full-screen glass.
- Preserve clear edit/delete actions for desktop mode.
- Keep mobile behavior constrained and readable.

### File Targets

- `src/components/features/ArchiveDetailView.tsx`
- any detail-related shared components under `src/components/features/`
- relevant dark tokens in `src/app/globals.css`

### Deliverables

- dark exhibit-style detail layout
- stronger title + metadata + narrative hierarchy
- collection detail mode that feels intentionally curated

### Validation

- browser manual review
- desktop app preview
- long-text readability review

### Risk Notes

- This phase can easily over-index on aesthetics and reduce information density.
- Long-form text contrast must be tested carefully.

---

## Phase 5: Editor and Studio Shell

### Objective

Make the editor feel like a premium dark archive studio while preserving usability.

### Scope

- editor overlay shell
- editor header
- editor sidebars / metadata panels
- image stage
- action area

### Engineering Requirements

- Use Apple-glass shell selectively around editor chrome.
- Keep the main writing area calmer and more readable than the hero.
- Preserve the phase-2 structural cleanup of editor hooks and sections.
- Do not move draft logic or upload orchestration back into visual components.

### File Targets

- `src/components/features/EntryEditor.tsx`
- `src/components/features/editor/EntryEditorHero.tsx`
- `src/components/features/editor/EntryEditorSidebar.tsx`
- `src/components/features/editor/EntryEditorBody.tsx`
- `src/components/features/editor/EntryEditorActions.tsx`

### Deliverables

- dark studio editor shell
- improved hierarchy between image, metadata, and narrative
- premium but efficient writing environment

### Validation

- `npm run lint`
- `npm run test`
- manual create / edit / draft recovery flow

### Risk Notes

- This phase must not turn the editor into a landing page section.
- Productivity must stay ahead of spectacle.

---

## Phase 6: Settings, Data Management, and Utility Surfaces

### Objective

Bring the utility side of the app into the same dark system without over-styling it.

### Scope

- settings panel
- import/export surfaces
- storage mode status
- system messages
- utility dropdowns and popovers

### Engineering Requirements

- Utility panels may use glass, but should remain operational first.
- Status states and destructive actions must stay obvious.
- Keep controller logic in hooks; this phase is visual and structural polish only.

### File Targets

- `src/components/features/SettingsPanel.tsx`
- `src/components/ui/DataManagement.tsx`
- related controller hooks in `src/hooks/`

### Deliverables

- dark utility shell language
- consistent panel behavior with the rest of the app
- cleaner desktop-app feel across settings and storage tooling

### Validation

- manual import/export and settings flow review
- `npm run lint`
- `npm run test`

### Risk Notes

- Too much transparency in utility panels will hurt clarity.
- This phase should feel polished, not ornamental.

---

## Phase 7: Motion, Performance, and Cross-Surface Hardening

### Objective

Stabilize the redesign across browser, Tauri, and future marketing/demo use.

### Scope

- motion primitives
- reduced-motion support
- image loading strategy
- desktop smoke verification
- screenshot/demo readiness

### Engineering Requirements

- Favor image-led parallax and reveal motion over persistent video layers.
- Keep motion reusable and centralized where practical.
- Ensure dark overlays and glass surfaces behave well in Tauri and browser contexts.
- Recheck desktop smoke workflow after any major shell change.

### File Targets

- `src/components/visual/`
- `src/components/ui/`
- `.github/workflows/ci.yml`
- `.github/workflows/desktop-smoke.yml`
- `docs/TESTING-CI.md`

### Deliverables

- stable motion presets
- reduced-motion fallbacks
- stronger desktop confidence after visual change
- demo-ready polish for GitHub and product promotion

### Validation

- `npm run lint`
- `npm run test`
- `npm run build`
- desktop smoke workflow
- manual performance check on long scrolling and overlays

### Risk Notes

- Heavy blur plus large background images can create real desktop performance issues.
- Motion should enhance the archive narrative, not make the app feel like a concept demo.

---

## Recommended Delivery Order

Execute in this order:

1. Phase 1: Dark Design System Foundation
2. Phase 2: Home Hero and Entry Surface
3. Phase 3: Collection Card and Showcase Language
4. Phase 4: Collection Detail and Archive Reading Mode
5. Phase 5: Editor and Studio Shell
6. Phase 6: Settings, Data Management, and Utility Surfaces
7. Phase 7: Motion, Performance, and Cross-Surface Hardening

## Recommended Checkpoint Tags

If you want rollback-friendly internal milestones, prefer tags like:

- `ui-dark-foundation`
- `ui-hero-pass`
- `ui-collections-pass`
- `ui-detail-pass`
- `ui-editor-pass`
- `ui-utility-pass`
- `ui-polish-pass`

These should stay version anchors only unless you intentionally promote one to a GitHub draft release.

## Immediate Next Step

Start with **Phase 1** only.

Do not jump directly into homepage visuals before the dark token system, glass primitives, and shell constraints are stable.
