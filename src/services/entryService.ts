/**
 * Entry Service Factory
 * Creates and exports a singleton repository instance based on the environment
 */

import type { DraftEntry, StorageRepository } from './storage-repository';
import {
  createArchiveBackupFilename,
  createArchiveBackupPayload,
  parseBackupEntries,
} from './storage-backups';
import {
  createLazyRepositoryProxy,
  getRepository,
  getStorageModeInfo,
} from './storage-runtime';

export interface FileExportResult {
  success: boolean;
  filename?: string;
  error?: string;
}

export interface FileImportOptions {
  merge?: boolean;
  onProgress?: (count: number) => void;
}

export interface FileImportResult {
  success: boolean;
  importedCount?: number;
  error?: string;
}

const downloadJsonFile = (filename: string, json: string) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('File download is only available in browser environments');
  }

  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ============================================================================
// Convenience Methods (Delegates to Repository)
// ============================================================================

/**
 * Save an entry
 */
export const saveEntry = async (entry: Parameters<StorageRepository['saveEntry']>[0]) => {
  const repo = getRepository();
  return repo.saveEntry(entry);
};

/**
 * Get all entries
 */
export const getEntries = async (): Promise<ReturnType<StorageRepository['getEntries']>> => {
  const repo = getRepository();
  return repo.getEntries();
};

/**
 * Get a single entry by ID
 */
export const getEntry = async (id: string) => {
  const repo = getRepository();
  return repo.getEntry(id);
};

/**
 * Update an entry
 */
export const updateEntry = async (
  id: string,
  data: Parameters<StorageRepository['updateEntry']>[1]
) => {
  const repo = getRepository();
  return repo.updateEntry(id, data);
};

/**
 * Delete an entry
 */
export const deleteEntry = async (id: string) => {
  const repo = getRepository();
  return repo.deleteEntry(id);
};

/**
 * Upload an image
 */
export const uploadImage = async (
  file: Parameters<StorageRepository['uploadImage']>[0]
) => {
  const repo = getRepository();
  return repo.uploadImage(file);
};

/**
 * Export all data
 */
export const exportData = async (): Promise<string> => {
  const repo = getRepository();
  return repo.exportData();
};

/**
 * Import data
 */
export const importData = async (json: string) => {
  const repo = getRepository();
  return repo.importData(json);
};

/**
 * Get the storage location
 */
export const getStorageLocation = async (): Promise<string> => {
  const repo = getRepository();
  return repo.getStorageLocation();
};

export const exportToFile = async (): Promise<FileExportResult> => {
  try {
    const mode = getStorageModeInfo();
    const exported = await exportData();
    const entries = parseBackupEntries(JSON.parse(exported));
    const filename = createArchiveBackupFilename();
    const payload = createArchiveBackupPayload({
      entries,
      storageMode: mode.kind,
    });

    downloadJsonFile(filename, JSON.stringify(payload, null, 2));

    return { success: true, filename };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export backup',
    };
  }
};

export const importFromFile = async (
  file: File,
  options: FileImportOptions = {}
): Promise<FileImportResult> => {
  if (options.merge === false) {
    return {
      success: false,
      error: 'Replacing the active archive is not supported yet.',
    };
  }

  try {
    const previousCount = await getUserEntryCount();
    const text = await file.text();
    const parsed = JSON.parse(text);
    const entries = parseBackupEntries(parsed);

    await importData(JSON.stringify(entries));

    const nextCount = await getUserEntryCount();
    const importedCount = Math.max(0, nextCount - previousCount);
    options.onProgress?.(importedCount);

    return {
      success: true,
      importedCount,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to import backup',
    };
  }
};

export const hasUserEntries = async (): Promise<boolean> => {
  const count = await getUserEntryCount();
  return count > 0;
};

export const getUserEntryCount = async (): Promise<number> => {
  const entries = await getEntries();
  return entries.length;
};

// ============================================================================
// Draft Operations
// ============================================================================

/**
 * Save a draft entry
 */
export const saveDraft = async (draft: DraftEntry): Promise<void> => {
  const repo = getRepository();
  return repo.saveDraft(draft);
};

/**
 * Get the current draft entry
 */
export const getDraft = async (): Promise<DraftEntry | null> => {
  const repo = getRepository();
  return repo.getDraft();
};

/**
 * Clear the current draft entry
 */
export const clearDraft = async (): Promise<void> => {
  const repo = getRepository();
  return repo.clearDraft();
};

// ============================================================================
// Default Export (Lazy Factory with Proxy)
// ============================================================================

/**
 * Default export - a lazy-loading proxy that safely handles SSR scenarios
 * Uses a Proxy to intercept method calls and lazy-initialize the repository
 */
const createLazyEntryService = (): StorageRepository => {
  return createLazyRepositoryProxy();
};

const entryService: StorageRepository = createLazyEntryService();

export default entryService;

// ============================================================================
// Named Exports for Tree Shaking
// ============================================================================

export { WebStorageAdapter } from './web-storage';
export { NativeStorageAdapter } from './native-storage';
export { WebFSStorageAdapter } from './web-fs-storage';
export {
  getWebFS,
  getRepository,
  getAdapterInfo,
  getStorageModeInfo,
  isRunningInTauri,
  isRunningInWeb,
  type StorageMode,
  type StorageModeInfo,
} from './storage-runtime';

export {
  type StorageRepository,
  type Entry,
  type SavedEntry,
  type EntrySummary,
  type SaveResult,
  type ImageUploadResult,
  type AdapterMetadata,
  type DraftEntry,
} from './storage-repository';
