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
  conflictBehavior?: string;
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
  try {
    const repo = getRepository();
    return await repo.saveEntry(entry);
  } catch (error) {
    console.error('entryService.saveEntry failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save entry',
    };
  }
};

/**
 * Get all entries
 */
export const getEntries = async (): Promise<ReturnType<StorageRepository['getEntries']>> => {
  try {
    const repo = getRepository();
    return await repo.getEntries();
  } catch (error) {
    console.error('entryService.getEntries failed:', error);
    return [];
  }
};

/**
 * Get a single entry by ID
 */
export const getEntry = async (id: string) => {
  try {
    const repo = getRepository();
    return await repo.getEntry(id);
  } catch (error) {
    console.error('entryService.getEntry failed:', error);
    return null;
  }
};

/**
 * Update an entry
 */
export const updateEntry = async (
  id: string,
  data: Parameters<StorageRepository['updateEntry']>[1]
) => {
  try {
    const repo = getRepository();
    return await repo.updateEntry(id, data);
  } catch (error) {
    console.error('entryService.updateEntry failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update entry',
    };
  }
};

/**
 * Delete an entry
 */
export const deleteEntry = async (id: string) => {
  try {
    const repo = getRepository();
    return await repo.deleteEntry(id);
  } catch (error) {
    console.error('entryService.deleteEntry failed:', error);
  }
};

/**
 * Upload an image
 */
export const uploadImage = async (
  file: Parameters<StorageRepository['uploadImage']>[0]
) => {
  try {
    const repo = getRepository();
    return await repo.uploadImage(file);
  } catch (error) {
    console.error('entryService.uploadImage failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image',
    };
  }
};

/**
 * Export all data
 */
export const exportData = async (): Promise<string> => {
  try {
    const repo = getRepository();
    return await repo.exportData();
  } catch (error) {
    console.error('entryService.exportData failed:', error);
    return '[]';
  }
};

/**
 * Import data
 */
export const importData = async (json: string, conflictBehavior?: string) => {
  try {
    const repo = getRepository();
    return await repo.importData(json, conflictBehavior);
  } catch (error) {
    console.error('entryService.importData failed:', error);
  }
};

/**
 * Get the storage location
 */
export const getStorageLocation = async (): Promise<string> => {
  try {
    const repo = getRepository();
    return await repo.getStorageLocation();
  } catch (error) {
    console.error('entryService.getStorageLocation failed:', error);
    return 'localStorage';
  }
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

    await importData(JSON.stringify(entries), options.conflictBehavior);

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
  try {
    const repo = getRepository();
    return await repo.saveDraft(draft);
  } catch (error) {
    console.error('entryService.saveDraft failed:', error);
  }
};

/**
 * Get the current draft entry
 */
export const getDraft = async (): Promise<DraftEntry | null> => {
  try {
    const repo = getRepository();
    return await repo.getDraft();
  } catch (error) {
    console.error('entryService.getDraft failed:', error);
    return null;
  }
};

/**
 * Clear the current draft entry
 */
export const clearDraft = async (): Promise<void> => {
  try {
    const repo = getRepository();
    return await repo.clearDraft();
  } catch (error) {
    console.error('entryService.clearDraft failed:', error);
  }
};

/**
 * Save search index
 */
export const saveSearchIndex = async (json: string): Promise<void> => {
  try {
    const repo = getRepository();
    return await repo.saveSearchIndex(json);
  } catch (error) {
    console.error('entryService.saveSearchIndex failed:', error);
  }
};

/**
 * Load search index
 */
export const loadSearchIndex = async (): Promise<string | null> => {
  try {
    const repo = getRepository();
    return await repo.loadSearchIndex();
  } catch (error) {
    console.error('entryService.loadSearchIndex failed:', error);
    return null;
  }
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
