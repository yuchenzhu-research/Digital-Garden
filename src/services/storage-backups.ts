import type { Entry } from './storage-repository';
import type { StorageMode } from './storage-runtime';

export const ARCHIVE_BACKUP_VERSION = '1.2';

export interface ArchiveBackupPayload {
  version: string;
  exportedAt: string;
  storageMode: StorageMode;
  entryCount: number;
  entries: Entry[];
}

export const parseBackupEntries = (value: unknown): Entry[] => {
  if (Array.isArray(value)) {
    return value as Entry[];
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'entries' in value &&
    Array.isArray((value as { entries?: unknown }).entries)
  ) {
    return (value as { entries: Entry[] }).entries;
  }

  throw new Error('Invalid backup format: expected an entries array.');
};

export const parseBackupJson = (json: string): Entry[] => {
  return parseBackupEntries(JSON.parse(json));
};

export const createArchiveBackupFilename = (date = new Date()): string => {
  return `bibliotheca_vitae_backup_${date.toISOString().split('T')[0]}.json`;
};

export const createArchiveBackupPayload = ({
  entries,
  exportedAt = new Date().toISOString(),
  storageMode,
  version = ARCHIVE_BACKUP_VERSION,
}: {
  entries: Entry[];
  exportedAt?: string;
  storageMode: StorageMode;
  version?: string;
}): ArchiveBackupPayload => {
  return {
    version,
    exportedAt,
    storageMode,
    entryCount: entries.length,
    entries,
  };
};
