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
    'docs/ARCHITECTURE.md',
    'docs/PROJECT-STRUCTURE.md',
    'docs/ENGINEERING-GUARDRAILS.md',
    'docs/TESTING-CI.md',
    'docs/RELEASE.md',
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

test('release docs do not overclaim Linux desktop app automation', () => {
  const readme = read('README.md');
  const readmeZh = read('README_zh-CN.md');
  const releaseDoc = read('docs', 'RELEASE.md');
  const releaseWorkflow = read('.github', 'workflows', 'release.yml');

  assert.match(readme, /macOS and Windows/i);
  assert.match(readme, /Linux .*desktop web/i);
  assert.match(readmeZh, /macOS 和 Windows/);
  assert.match(readmeZh, /Linux .*桌面网页版/);
  assert.match(releaseDoc, /Linux desktop app release automation is \*\*not currently documented as active\*\*/);
  assert.ok(!/ubuntu-latest/.test(releaseWorkflow), 'release workflow should not silently imply Linux packaging if docs say it is unconfirmed');
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
