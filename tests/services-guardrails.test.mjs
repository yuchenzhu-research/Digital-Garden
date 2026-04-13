import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

const read = (...segments) =>
  fs.readFileSync(path.join(rootDir, ...segments), 'utf8');

test('storage runtime and backup contract modules exist', () => {
  for (const file of [
    'src/services/storage-runtime.ts',
    'src/services/storage-backups.ts',
  ]) {
    assert.ok(fs.existsSync(path.join(rootDir, file)), `${file} should exist`);
  }
});

test('entry service delegates runtime concerns instead of instantiating adapters directly', () => {
  const entryService = read('src', 'services', 'entryService.ts');

  assert.match(entryService, /createLazyRepositoryProxy/);
  assert.match(entryService, /getRepository/);
  assert.doesNotMatch(entryService, /new NativeStorageAdapter/);
  assert.doesNotMatch(entryService, /new WebFSStorageAdapter/);
  assert.doesNotMatch(entryService, /new WebStorageAdapter/);
  assert.doesNotMatch(entryService, /const parseImportedEntries =/);
});

test('shared backup contract is the single parser entry point', () => {
  const backups = read('src', 'services', 'storage-backups.ts');
  const nativeStorage = read('src', 'services', 'native-storage.ts');
  const webStorage = read('src', 'services', 'web-storage.ts');
  const webFsStorage = read('src', 'services', 'web-fs-storage.ts');

  assert.match(backups, /export const parseBackupEntries/);
  assert.match(backups, /export const parseBackupJson/);
  assert.match(backups, /createArchiveBackupPayload/);
  assert.match(nativeStorage, /parseBackupJson/);
  assert.match(webStorage, /parseBackupJson/);
  assert.match(webFsStorage, /parseBackupJson/);
  assert.doesNotMatch(nativeStorage, /const parseImportPayload =/);
});
