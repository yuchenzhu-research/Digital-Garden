# Testing and CI

## Goal

Bibliotheca Vitae should not rely on release builds as its primary form of validation.

This repo now treats CI as a lightweight engineering gate for:

- linting
- documentation and workflow guardrails
- web build regressions
- basic Rust formatting checks for the Tauri layer

## Baseline Commands

These commands are the default validation pipeline for repository-level work:

```bash
npm run lint
npm run test
npm run build
```

For Rust/Tauri-touching changes, also run:

```bash
cargo fmt --check --manifest-path src-tauri/Cargo.toml
```

## What `npm run test` Guards Today

The current test suite is intentionally small and focused on repository guardrails:

- required engineering docs exist
- agent guidance references the shared engineering pipeline
- CI workflow runs lint, test, and build
- release docs do not overclaim Linux desktop app automation
- Tauri package metadata does not stay at placeholder defaults

This is a starting point, not the final test strategy.

## Next Testing Priorities

The next layers to add should be:

1. storage adapter contract tests
2. import/export smoke tests
3. page-level orchestration smoke tests
4. Tauri command payload tests where practical

## CI Responsibilities

`.github/workflows/ci.yml` should be the main engineering guard workflow.

It is responsible for:

- cross-platform lint and repository tests
- web build verification
- Rust formatting checks

`.github/workflows/release.yml` remains a delivery workflow. It is not a substitute for CI.
