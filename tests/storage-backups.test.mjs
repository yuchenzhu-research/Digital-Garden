import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ARCHIVE_BACKUP_VERSION,
  createArchiveBackupFilename,
  createArchiveBackupPayload,
  parseBackupEntries,
  parseBackupJson,
} from '../src/services/storage-backups.ts';

const sampleEntries = [
  {
    id: 'entry-1',
    title: 'A memory',
    figure: 'Ada Lovelace',
    moment: '1843',
    narrative: 'Notes on the Analytical Engine.',
    keywords: ['history', 'computing'],
    dateCreated: '2026-04-09T00:00:00.000Z',
  },
];

test('createArchiveBackupFilename uses the expected archive naming scheme', () => {
  const filename = createArchiveBackupFilename(new Date('2026-04-09T08:00:00.000Z'));
  assert.equal(filename, 'bibliotheca_vitae_backup_2026-04-09.json');
});

test('createArchiveBackupPayload stamps version, storage mode, and entry count', () => {
  const payload = createArchiveBackupPayload({
    entries: sampleEntries,
    exportedAt: '2026-04-09T08:00:00.000Z',
    storageMode: 'web-fs',
  });

  assert.equal(payload.version, ARCHIVE_BACKUP_VERSION);
  assert.equal(payload.exportedAt, '2026-04-09T08:00:00.000Z');
  assert.equal(payload.storageMode, 'web-fs');
  assert.equal(payload.entryCount, 1);
  assert.deepEqual(payload.entries, sampleEntries);
});

test('parseBackupEntries accepts both raw entry arrays and wrapped backup payloads', () => {
  assert.deepEqual(parseBackupEntries(sampleEntries), sampleEntries);
  assert.deepEqual(
    parseBackupEntries({
      version: ARCHIVE_BACKUP_VERSION,
      exportedAt: '2026-04-09T08:00:00.000Z',
      storageMode: 'web-local',
      entryCount: 1,
      entries: sampleEntries,
    }),
    sampleEntries
  );
});

test('parseBackupJson reads backup payload JSON and rejects invalid shapes', () => {
  const valid = JSON.stringify({
    version: ARCHIVE_BACKUP_VERSION,
    exportedAt: '2026-04-09T08:00:00.000Z',
    storageMode: 'tauri',
    entryCount: 1,
    entries: sampleEntries,
  });

  assert.deepEqual(parseBackupJson(valid), sampleEntries);
  assert.throws(
    () => parseBackupJson(JSON.stringify({ version: ARCHIVE_BACKUP_VERSION, items: [] })),
    /Invalid backup format/
  );
});
