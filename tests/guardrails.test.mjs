import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

const read = (...segments) =>
  fs.readFileSync(path.join(rootDir, ...segments), 'utf8');

test('core engineering docs exist', () => {
  const required = [
    'AGENTS.md',
    'CLAUDE.md',
    'CHANGELOG.md',
    'DEVLOG.md',
    'docs/ARCHITECTURE.md',
    'docs/PROJECT-STRUCTURE.md',
    'docs/ENGINEERING-GUARDRAILS.md',
    'docs/LOCAL-AGENT-ASSETS.md',
    'docs/DESIGN-FOUNDATION.md',
    'docs/TESTING-CI.md',
    'docs/RELEASE.md',
    '.github/workflows/desktop-smoke.yml',
    '.github/workflows/release.yml',
  ];

  for (const file of required) {
    assert.ok(fs.existsSync(path.join(rootDir, file)), `${file} should exist`);
  }
});

test('agent docs reference the shared engineering pipeline', () => {
  for (const file of ['AGENTS.md', 'CLAUDE.md']) {
    const content = read(file);
    assert.match(content, /Engineering-GUARDRAILS|ENGINEERING-GUARDRAILS/i);
    assert.match(content, /TESTING-CI\.md/);
    assert.match(content, /Audit first/i);
    assert.match(content, /Google Antigravity|Gemini-style/i);
  }
});

test('project structure includes changelog and devlog as root docs', () => {
  const agents = read('AGENTS.md');
  const claude = read('CLAUDE.md');
  const structure = read('docs', 'PROJECT-STRUCTURE.md');

  assert.match(agents, /CHANGELOG\.md/);
  assert.match(agents, /DEVLOG\.md/);
  assert.match(claude, /CHANGELOG\.md/);
  assert.match(claude, /DEVLOG\.md/);
  assert.match(structure, /CHANGELOG\.md/);
  assert.match(structure, /DEVLOG\.md/);
});

test('agent asset docs define a canonical local tooling split', () => {
  const agents = read('AGENTS.md');
  const claude = read('CLAUDE.md');
  const structure = read('docs', 'PROJECT-STRUCTURE.md');
  const localAssets = read('docs', 'LOCAL-AGENT-ASSETS.md');

  assert.match(agents, /\.agent\//);
  assert.match(agents, /\.agents\/skills\//);
  assert.match(claude, /\.agent\//);
  assert.match(claude, /\.agents\/skills\//);
  assert.match(structure, /\.agent\//);
  assert.match(structure, /\.claude\//);
  assert.match(localAssets, /Antigravity/i);
  assert.match(localAssets, /canonical shared repo-local skill library/i);
  assert.match(localAssets, /compatibility layer/i);
});

test('engineering guardrails document the architecture boundaries', () => {
  const content = read('docs', 'ENGINEERING-GUARDRAILS.md');
  assert.match(content, /src\/app\/page\.tsx/);
  assert.match(content, /src\/components\/features\//);
  assert.match(content, /src\/components\/ui\//);
  assert.match(content, /src\/components\/visual\//);
  assert.match(content, /src\/services\//);
  assert.match(content, /src-tauri\//);
  assert.match(content, /Desktop web/i);
  assert.match(content, /Mobile web/i);
  assert.match(content, /Tauri desktop app/i);
});

test('design foundation documents semantic visual groundwork', () => {
  const doc = read('docs', 'DESIGN-FOUNDATION.md');
  const globals = read('src', 'app', 'globals.css');

  assert.match(doc, /semantic tokens/i);
  assert.match(doc, /Variant/i);
  assert.match(doc, /MotionSites/i);
  assert.match(doc, /React Bits/i);
  assert.match(doc, /Design Prompts/i);
  assert.match(globals, /--canvas-base/);
  assert.match(globals, /--surface-1/);
  assert.match(globals, /--motion-duration-base/);
  assert.match(globals, /\.surface-panel/);
});

test('release docs do not overclaim Linux desktop app automation', () => {
  const readme = read('README.md');
  const readmeZh = read('README_zh-CN.md');
  const releaseDoc = read('docs', 'RELEASE.md');
  const releaseWorkflow = read('.github', 'workflows', 'release.yml');
  const desktopSmokeWorkflow = read('.github', 'workflows', 'desktop-smoke.yml');

  assert.match(readme, /macOS and Windows/i);
  assert.match(readme, /Linux .*desktop web/i);
  assert.match(readmeZh, /macOS 和 Windows/);
  assert.match(readmeZh, /Linux .*桌面网页版/);
  assert.match(releaseDoc, /Tags do \*\*not\*\* publish releases automatically/i);
  assert.match(releaseDoc, /Draft Release/i);
  assert.match(releaseDoc, /Linux desktop app release automation is \*\*not currently documented as active\*\*/);
  assert.match(releaseDoc, /Desktop app smoke validation/i);
  assert.match(desktopSmokeWorkflow, /ubuntu-latest/);
  assert.match(desktopSmokeWorkflow, /macos-latest/);
  assert.match(desktopSmokeWorkflow, /windows-latest/);
  assert.match(desktopSmokeWorkflow, /npm run app:build -- --bundles none/);
  assert.ok(!/ubuntu-latest/.test(releaseWorkflow), 'release workflow should not silently imply Linux packaging if docs say it is unconfirmed');
  assert.ok(!/push:\s*\n\s*tags:/m.test(releaseWorkflow), 'release workflow should stay manual instead of auto-publishing from tag pushes');
  assert.match(releaseWorkflow, /workflow_dispatch:/);
  assert.match(releaseWorkflow, /inputs:\s*\n\s*tag:/m);
  assert.match(releaseWorkflow, /releaseDraft: true/);
});

test('cargo metadata is no longer placeholder content', () => {
  const cargoToml = read('src-tauri', 'Cargo.toml');
  assert.match(cargoToml, /version = "3\.0\.0"/);
  assert.match(cargoToml, /description = "Bibliotheca Vitae desktop shell"/);
  assert.match(cargoToml, /license = "MIT"/);
  assert.match(cargoToml, /repository = "https:\/\/github\.com\/yuchenzhu-research\/Digital-Garden"/);
  assert.doesNotMatch(cargoToml, /description = "A Tauri App"/);
  assert.doesNotMatch(cargoToml, /authors = \["you"\]/);
});
