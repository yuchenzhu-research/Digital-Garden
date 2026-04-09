# Release Status

## Current Release Truth

Bibliotheca Vitae has two different support stories that should not be conflated:

1. Desktop web runtime support
2. Desktop app release automation

### Desktop web

The web runtime targets desktop browsers on:

- macOS
- Windows
- Linux

### Desktop app

The current GitHub release workflow documents desktop app builds for:

- macOS
- Windows

Linux desktop app release automation is **not currently documented as active** in `.github/workflows/release.yml`.

Until that changes, do not imply that Linux desktop app artifacts are published alongside macOS and Windows releases.

## Release References

- Workflow: `.github/workflows/release.yml`
- Product metadata: `src-tauri/tauri.conf.json`
- Rust package metadata: `src-tauri/Cargo.toml`
- User-facing install notes: `README.md`, `README_zh-CN.md`
