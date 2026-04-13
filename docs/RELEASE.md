# Release Status

## Current Release Truth

Bibliotheca Vitae has two different support stories that should not be conflated:

1. Desktop web runtime support
2. Desktop app smoke validation
3. Desktop app release automation

## Tag vs Release

These are different things in this repository:

- **Git tag**: a version anchor for a commit. Tags are useful for rollback, comparison, and milestone checkpoints.
- **GitHub Release**: a release record with attached artifacts and release notes.
- **Draft Release**: a non-published GitHub Release. Maintainers can inspect assets and notes first, then decide whether to publish it.

Current policy:

1. Create and push a tag when you want a stable version anchor.
2. Tags do **not** publish releases automatically.
3. Run the `Release` workflow manually with an existing `v*` tag when you want release artifacts.
4. The workflow creates or updates a **draft release** for review.
5. Publish the draft manually in GitHub only after the artifacts and notes look correct.

### Desktop web

The web runtime targets desktop browsers on:

- macOS
- Windows
- Linux

### Desktop app smoke validation

The repository now reserves a dedicated desktop smoke workflow for:

- macOS
- Windows
- Linux

This is validation coverage, not a statement that all three operating systems are currently published as desktop app artifacts.

### Desktop app release automation

The current GitHub release workflow documents desktop app builds for:

- macOS
- Windows

Linux desktop app release automation is **not currently documented as active** in `.github/workflows/release.yml`.

Until that changes, do not imply that Linux desktop app artifacts are published alongside macOS and Windows releases.

## Release References

- Desktop smoke workflow: `.github/workflows/desktop-smoke.yml`
- Workflow: `.github/workflows/release.yml`
- Product metadata: `src-tauri/tauri.conf.json`
- Rust package metadata: `src-tauri/Cargo.toml`
- User-facing install notes: `README.md`, `README_zh-CN.md`
