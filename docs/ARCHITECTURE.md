# Architecture

## Product Surfaces

Bibliotheca Vitae currently has three runtime surfaces:

1. Desktop web in a browser
2. Mobile web in a browser
3. Desktop app through Tauri

The product model is local-first across all three:

- Desktop web prefers `Folder Mode`, which writes archive entries as native `.json` files into a user-selected directory.
- Desktop app uses the Tauri native layer to read and write the archive on disk.
- Mobile web acts as `Browse + Local Drafts`, with drafts stored only in the current browser.

## Runtime Layers

### 1. App shell

`src/app/`

- `layout.tsx` defines the document shell and metadata.
- `page.tsx` is the main orchestration layer for the archive, editor, detail view, storage mode state, and mobile behavior.

### 2. UI layers

`src/components/`

- `features/` holds product-level components such as the hero, archive detail view, editor, settings, and list sections.
- `ui/` holds reusable presentation pieces such as backup management panels and lower-level interface elements.
- `visual/` holds decorative and motion-heavy visual components.

### 3. Domain and static content

`src/lib/`

- `types.ts` contains shared domain types used outside storage adapters.
- `data.ts` contains curated built-in archive content that is always read-only.
- geometry and helper utilities live here when they are not environment-specific.

### 4. Environment and interaction helpers

`src/hooks/`
`src/utils/`
`src/types/`

- hooks manage client-only behavior such as autosave, keyboard shortcuts, device detection, and window interaction.
- `utils/env.ts` is the environment boundary for web vs Tauri vs mobile checks.
- `types/` contains platform-specific declaration files for browser and Tauri APIs.

### 5. Persistence and storage abstraction

`src/services/`

This is the real core of the app.

- `storage-repository.ts` defines the storage contract.
- `entryService.ts` selects the active adapter and exposes the app-facing storage API.
- `web-storage.ts` is the browser-local fallback adapter.
- `web-fs-storage.ts` is the browser folder adapter based on the File System Access API.
- `native-storage.ts` is the Tauri adapter.
- `portable-images.ts` and `mobile-draft.ts` support backup portability and mobile-local drafts.

The runtime data flow is:

`page.tsx` -> `entryService.ts` -> active storage adapter -> browser storage or native file system

## Native Boundary

`src-tauri/`

- `src-tauri/src/commands.rs` exposes native file system commands to the frontend.
- `src-tauri/src/lib.rs` wires those commands into the Tauri app.
- `icons/`, `capabilities/`, and `gen/` are desktop-app support files.

The Tauri layer is intentionally thin. Product behavior still lives primarily in the shared React app, while Rust handles disk access and desktop integration.

## Content Model

There are two content classes in the app:

1. Built-in curated entries from `src/lib/data.ts`
2. User-created archive entries from the active storage adapter

Only user-created entries are editable. Built-in entries remain read-only.

## Draft Model

- Desktop web and desktop app use the repository draft API.
- Mobile web uses IndexedDB-backed local drafts through `mobile-draft.ts`.

This keeps mobile capture lightweight without pretending that mobile is the full archive-management surface.

## Repo Boundaries

Only these directories should be treated as product architecture:

- `src/`
- `src-tauri/`
- `public/` for runtime static assets only
- `docs/`
- root `README*.md`

These directories are local tooling or generated artifacts, not architecture:

- `.agents/`
- `.claude/`
- `.agent/`
- `.Codex/`
- `.next/`
- `node_modules/`
- `out/`
- `src-tauri/target/`

If you see `AGENTS.md`, `README`, or other familiar files inside `node_modules/` or `src-tauri/target/`, they are vendor or build-output files and should be ignored when reasoning about the project.

Documentation-only screenshots and diagrams should live under `docs/assets/`, not inside `public/`.
