/**
 * Entry Service Factory
 * Creates and exports a singleton repository instance based on the environment
 */

import { isTauri } from '@/utils/env';
import { WebStorageAdapter } from './web-storage';
import { NativeStorageAdapter } from './native-storage';
import { WebFSStorageAdapter } from './web-fs-storage';
import type { StorageRepository, AdapterMetadata, DraftEntry } from './storage-repository';

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
  const environment: 'tauri' | 'web-fs' | 'web-local' = isTauri() ? 'tauri' : (sharedWebFS.isReady() ? 'web-fs' : 'web-local');

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
      const environment: 'tauri' | 'web-fs' | 'web-local' = isTauri() ? 'tauri' : (sharedWebFS.isReady() ? 'web-fs' : 'web-local');
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

// Re-export file-based functions for web
export { exportToFile, importFromFile, hasUserEntries, getUserEntryCount } from './web-storage';

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
