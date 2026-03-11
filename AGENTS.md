# Codex Project Configuration
Project: Digital Garden | Bibliotheca Vitae
Type: Next.js + Tauri (Desktop App)

## 🗂️ Repo Boundaries
- **Product source**: `src/`, `src-tauri/`, `public/`
- **Root docs**: `README*.md`, `LICENSE`
- **Long-form docs**: `docs/`
- **Local-only agent assets**: `.agents/`, `.claude/`, `.Codex/`, `.agent/` (tooling only; not product source)
- **Build outputs**: `.next/`, `out/`, `node_modules/`, `src-tauri/target/` (generated artifacts; not project structure)

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

## 🛠️ Common Commands
- **Dev (Web)**: `npm run dev`
- **Dev (App)**: `npx tauri dev` (Opens the native Mac app window)
- **Build (App)**: `npx tauri build`
- **Release**: `git tag v0.1.0 && git push origin v0.1.0` (Triggers GitHub Action)

## 🚨 Guidelines
- **Local-First**: Prioritize saving data to local storage/fs.
- **System Integration**: Use Tauri APIs to access the file system.
- **Docs Placement**: Keep multilingual `README*.md` at the repo root; place longer internal documentation in `docs/`.
- **Docs Assets**: Store documentation-only images and screenshots in `docs/assets/`; keep `public/` for runtime assets only.
