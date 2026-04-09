# Testing and CI

## Goal

Bibliotheca Vitae should not rely on release builds as its primary form of validation.

This repo now treats CI as a lightweight engineering gate for:

- linting
- documentation, controller, and service guardrails
- backup contract behavior
- web build regressions
- basic Rust formatting checks for the Tauri layer

## Baseline Commands

These commands are the default validation pipeline for repository-level work:

```bash
npm run lint
npm run test
npm run build
```

`npm run test` uses the built-in Node test runner with `--experimental-strip-types`
so lightweight tests can import pure TypeScript utility modules without adding a
separate test framework.

For Rust/Tauri-touching changes, also run:

```bash
cargo fmt --check --manifest-path src-tauri/Cargo.toml
```

## What `npm run test` Guards Today

The current test suite is still intentionally lightweight, but it now guards
more than repository metadata:

- required engineering docs exist
- agent guidance references the shared engineering pipeline
- homepage / editor / settings / data UI boundaries stay wired through
  controller hooks
- service runtime and backup contract modules remain centralized
- backup payload helpers continue to accept the supported import/export shapes
- release docs do not overclaim Linux desktop app automation
- Tauri package metadata does not stay at placeholder defaults

This is a starting point, not the final test strategy.

## Next Testing Priorities

The next layers to add should be:

1. adapter-level contract tests with fixture-driven coverage
2. import/export smoke tests that touch real adapter behavior
3. page/controller smoke tests that cover higher-level state flows
4. Tauri command payload tests where practical
5. visual system guardrails once the design-token work begins

## CI Responsibilities

`.github/workflows/ci.yml` should be the main engineering guard workflow.

It is responsible for:

- cross-platform lint and repository tests
- controller and service guardrail coverage via `npm run test`
- web build verification
- Rust formatting checks

`.github/workflows/release.yml` remains a delivery workflow. It is not a substitute for CI.
