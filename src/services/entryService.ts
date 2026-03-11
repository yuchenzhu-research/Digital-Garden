/**
 * Entry Service Factory
 * Creates and exports a singleton repository instance based on the environment
 */

import { isTauri } from '@/utils/env';
import { WebStorageAdapter } from './web-storage';
import { NativeStorageAdapter } from './native-storage';
import { WebFSStorageAdapter } from './web-fs-storage';
import type { StorageRepository, AdapterMetadata, DraftEntry, Entry } from './storage-repository';

// ============================================================================
// Singleton Instance
// ============================================================================

let repositoryInstance: StorageRepository | null = null;
let currentEnvironment: 'tauri' | 'web-fs' | 'web-local' | null = null;

// Global explicit instances for web to switch dynamically
const sharedWebFS = new WebFSStorageAdapter();
let sharedWebLocal: WebStorageAdapter | null = null;

/**
 * Initialize WebFS automatically in the background
 */
if (typeof window !== 'undefined' && !isTauri()) {
  sharedWebFS.initialize(true).then((ready) => {
    if (ready) {
      console.log('WebFSStorage automatically re-connected via IndexedDB.');
      // Force repository instance refresh
      repositoryInstance = null;
    }
  });
}

/**
 * Expose shared WebFS instance for UI to request directory access
 */
export const getWebFS = () => sharedWebFS;

export type StorageMode = 'tauri' | 'web-fs' | 'web-local';

export interface StorageModeInfo {
  kind: StorageMode;
  badge: string;
  exportLabel: string;
  importLabel: string;
  description: string;
  emptyState: string;
}

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

const getEnvironment = (): StorageMode => {
  if (typeof window === 'undefined') {
    return 'web-local';
  }

  return isTauri() ? 'tauri' : (sharedWebFS.isReady() ? 'web-fs' : 'web-local');
};

const parseImportedEntries = (value: unknown): Entry[] => {
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

/**
 * Get the singleton repository instance
 * Creates it if it doesn't exist
 */
export const getRepository = (): StorageRepository => {
  // SSR guard - no storage available on server
  if (typeof window === 'undefined') {
    throw new Error('Storage service is only available in browser environments');
  }

  // Recreate if environment changed
  const environment = getEnvironment();

  if (repositoryInstance && currentEnvironment === environment) {
    return repositoryInstance;
  }

  if (environment === 'tauri') {
    repositoryInstance = new NativeStorageAdapter();
  } else if (environment === 'web-fs') {
    repositoryInstance = sharedWebFS;
  } else {
    if (!sharedWebLocal) sharedWebLocal = new WebStorageAdapter();
    repositoryInstance = sharedWebLocal;
  }

  currentEnvironment = environment;
  return repositoryInstance;
};

/**
 * Get the current adapter's metadata
 */
export const getAdapterInfo = (): AdapterMetadata => {
  const repository = getRepository();
  if ('getMetadata' in repository) {
    return (repository as { getMetadata(): AdapterMetadata }).getMetadata();
  }
  return {
    name: isTauri() ? 'NativeStorageAdapter' : 'WebStorageAdapter',
    version: '1.0.0',
    environment: isTauri() ? 'tauri' : 'web',
    capabilities: [],
  };
};

export const getStorageModeInfo = (): StorageModeInfo => {
  const mode = getEnvironment();

  switch (mode) {
    case 'tauri':
      return {
        kind: mode,
        badge: 'Desktop App',
        exportLabel: 'Export Archive Backup',
        importLabel: 'Import Archive Backup',
        description: 'Desktop archives are stored in your Bibliotheca Vitae folder on disk.',
        emptyState: 'No archived entries yet. Create one or import a backup into the desktop archive.',
      };
    case 'web-fs':
      return {
        kind: mode,
        badge: 'Folder Mode',
        exportLabel: 'Export Archive Backup',
        importLabel: 'Import Archive Backup',
        description: 'Folder Mode reads and writes native `.json` files in your connected directory.',
        emptyState: 'No folder-connected entries yet. Create one or import a backup into this directory.',
      };
    case 'web-local':
    default:
      return {
        kind: 'web-local',
        badge: 'Browser Local',
        exportLabel: 'Export Browser Backup',
        importLabel: 'Import Browser Backup',
        description: 'Browser Local is a compatibility fallback stored inside this browser only.',
        emptyState: 'No browser-local entries yet. Create one or import a backup into this browser.',
      };
  }
};

/**
 * Check if running in Tauri environment
 */
export const isRunningInTauri = (): boolean => {
  return isTauri();
};

/**
 * Check if running in Web environment
 */
export const isRunningInWeb = (): boolean => {
  return !isTauri();
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
    const entries = parseImportedEntries(JSON.parse(exported));
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `bibliotheca_vitae_backup_${timestamp}.json`;

    const payload = {
      version: '1.1',
      exportedAt: new Date().toISOString(),
      storageMode: mode.kind,
      entryCount: entries.length,
      entries,
    };

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
    const entries = parseImportedEntries(parsed);

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
  let repository: StorageRepository | null = null;

  const ensureRepository = (): StorageRepository => {
    // SSR check
    if (typeof window === 'undefined') {
      throw new Error('Storage service is only available in browser environments');
    }
    if (!repository) {
      const environment = getEnvironment();
      if (environment === 'tauri') {
        repository = new NativeStorageAdapter();
      } else if (environment === 'web-fs') {
        repository = sharedWebFS;
      } else {
        if (!sharedWebLocal) sharedWebLocal = new WebStorageAdapter();
        repository = sharedWebLocal;
      }
    }
    return repository;
  };

  return new Proxy({} as StorageRepository, {
    get(_target, prop) {
      const repo = ensureRepository();
      const value = Reflect.get(repo as object, prop);

      if (typeof value === 'function') {
        // Return a function that first gets the repo, then calls the method
        return (...args: unknown[]) => {
          const targetRepo = ensureRepository();
          const targetValue = Reflect.get(targetRepo as object, prop);

          if (typeof targetValue !== 'function') {
            return targetValue;
          }

          return Reflect.apply(targetValue, targetRepo, args);
        };
      }

      return value;
    },
  });
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
  type StorageRepository,
  type Entry,
  type SavedEntry,
  type EntrySummary,
  type SaveResult,
  type ImageUploadResult,
  type AdapterMetadata,
  type DraftEntry,
} from './storage-repository';
