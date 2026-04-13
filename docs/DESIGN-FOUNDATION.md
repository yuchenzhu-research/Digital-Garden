# Design Foundation

## Purpose

This document prepares the visual system without forcing a full UI style decision yet.

Bibliotheca Vitae already has a warm editorial baseline, but the current visual language is still partly component-local and partly hardcoded. The next step is not a full redesign by default. The next step is to establish a stable foundation so future style choices do not require rebuilding the entire UI layer.

## Current Baseline

The current interface already leans toward:

- warm paper-like backgrounds
- serif + sans editorial contrast
- restrained museum-like color accents
- motion as atmosphere rather than gamified interaction
- a local-first archive experience instead of a generic SaaS dashboard

This baseline should be treated as the current default, not as a permanent final style.

## Locked Constraints

These should stay stable even before the final art direction is chosen:

1. The product is a local-first digital garden, not a cloud dashboard.
2. Desktop web, mobile web, and the Tauri desktop shell must still feel like the same product family.
3. Hero, archive cards, detail overlays, editor overlays, and settings surfaces should eventually share one coherent design language.
4. Motion must stay structured and reusable, not scattered across unrelated components.
5. Visual atmosphere must not destroy readability, scanning, or maintainability.

## Pre-Style Foundation

Before choosing a stronger aesthetic direction, the design system should be prepared around semantic layers instead of one-off style labels.

### Color semantics

Prepare tokens around roles such as:

- `canvas`
- `surface`
- `ink`
- `accent`
- `line`
- `scrim`
- `glow`

This allows the project to keep the current warm editorial look or pivot toward a slightly different archive style later without renaming every utility class.

### Typography semantics

Prepare roles instead of page-specific sizes:

- display
- title
- lead
- body
- label
- meta

The current serif/sans pairing can remain, but the system should describe what each text role means before deciding whether the final style becomes more monastic, more gallery-like, or more contemporary.

### Motion semantics

Prepare shared motion categories before changing visuals:

- intro
- reveal
- hover
- overlay
- background
- scroll choreography

The goal is to avoid embedding one-off `motion.div` decisions directly inside every feature component.

### Surface semantics

Prepare shared surface roles for:

- page canvas
- floating panels
- archive cards
- overlays
- editor chrome
- detail chrome

## Candidate Style Directions

These are candidates, not commitments:

### Editorial Archive

- strongest continuity with the current build
- museum + manuscript + product polish
- warm paper, ink, hairline frames, restrained accents

### Contemporary Cabinet

- more spatial and object-driven
- richer layers and deeper framing
- stronger contrast between artifact surfaces and utility panels

### Monastic Minimal

- quieter and more severe
- less decorative texture
- stronger typography hierarchy and emptier canvases

## How To Use External References

Use external references for methodology, not mimicry:

- `Variant`: large-canvas sequencing and progressive exploration
- `MotionSites`: narrative pacing and layered motion rhythm
- `React Bits`: reusable motion primitives and effect packaging
- `Design Prompts`: style language that can be named, repeated, and critiqued

## Immediate Preparation Scope

The current preparation work should stay limited to:

1. semantic tokens in `src/app/globals.css`
2. shared naming for surfaces, lines, ink, and motion timing
3. documentation of the design foundation
4. avoiding hard commitment to a final visual direction before the product owner chooses one

## Not In Scope Yet

- a complete hero redesign
- replacing the current typography pair
- rewriting archive card layouts
- changing the Tauri shell chrome
- introducing heavier 3D or WebGL effects
- locking the project into a single reference-inspired look
