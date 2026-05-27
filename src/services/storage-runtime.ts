import { isTauri } from '@/utils/env';
import { NativeStorageAdapter } from './native-storage';
import { WebFSStorageAdapter } from './web-fs-storage';
import { WebStorageAdapter } from './web-storage';
import type { AdapterMetadata, StorageRepository, Entry, SaveResult, EntrySummary, ImageUploadResult, DraftEntry } from './storage-repository';

export type StorageMode = 'tauri' | 'web-fs' | 'web-local';

export interface StorageModeInfo {
  kind: StorageMode;
  badge: string;
  exportLabel: string;
  importLabel: string;
  description: string;
  emptyState: string;
}

const STORAGE_MODE_INFO: Record<StorageMode, StorageModeInfo> = {
  tauri: {
    kind: 'tauri',
    badge: 'Desktop App',
    exportLabel: 'Export Archive Backup',
    importLabel: 'Import Archive Backup',
    description: 'Desktop archives are stored in your Bibliotheca Vitae folder on disk.',
    emptyState: 'No archived entries yet. Create one or import a backup into the desktop archive.',
  },
  'web-fs': {
    kind: 'web-fs',
    badge: 'Folder Mode',
    exportLabel: 'Export Archive Backup',
    importLabel: 'Import Archive Backup',
    description: 'Folder Mode reads and writes native `.json` files in your connected directory.',
    emptyState: 'No folder-connected entries yet. Create one or import a backup into this directory.',
  },
  'web-local': {
    kind: 'web-local',
    badge: 'Browser Local',
    exportLabel: 'Export Browser Backup',
    importLabel: 'Import Browser Backup',
    description: 'Browser Local is a compatibility fallback stored inside this browser only.',
    emptyState: 'No browser-local entries yet. Create one or import a backup into this browser.',
  },
};

const NOOP_REPOSITORY: StorageRepository = {
  saveEntry: async () => ({ success: false, error: 'Storage not available in this environment' }),
  getEntry: async () => null,
  getEntries: async () => [],
  getEntrySummaries: async () => [],
  updateEntry: async () => ({ success: false, error: 'Storage not available in this environment' }),
  deleteEntry: async () => {},
  uploadImage: async () => ({ success: false, error: 'Storage not available in this environment' }),
  exportData: async () => '[]',
  importData: async () => {},
  getStorageLocation: async () => 'None',
  saveDraft: async () => {},
  getDraft: async () => null,
  clearDraft: async () => {},
  saveSearchIndex: async () => {},
  loadSearchIndex: async () => null,
};

const sharedWebFS = new WebFSStorageAdapter();

export class RuntimeStorageRepository implements StorageRepository {
  private nativeAdapter: NativeStorageAdapter | null = null;
  private webFSAdapter: WebFSStorageAdapter;
  private webLocalAdapter: WebStorageAdapter | null = null;

  constructor(webFS: WebFSStorageAdapter) {
    this.webFSAdapter = webFS;
  }

  public getActiveRepository(): StorageRepository {
    if (typeof window === 'undefined') {
      return NOOP_REPOSITORY;
    }

    const mode = getStorageMode();
    try {
      switch (mode) {
        case 'tauri':
          if (!this.nativeAdapter) {
            this.nativeAdapter = new NativeStorageAdapter();
          }
          return this.nativeAdapter;
        case 'web-fs':
          // If web-fs is selected but not ready, failover to web-local rather than crashing
          if (!this.webFSAdapter.isReady()) {
            return this.getFallbackRepository();
          }
          return this.webFSAdapter;
        case 'web-local':
        default:
          return this.getFallbackRepository();
      }
    } catch (e) {
      console.error(`Failed to load adapter for mode: ${mode}, falling back to web-local`, e);
      return this.getFallbackRepository();
    }
  }

  private getFallbackRepository(): StorageRepository {
    if (typeof window === 'undefined') {
      return NOOP_REPOSITORY;
    }
    if (!this.webLocalAdapter) {
      this.webLocalAdapter = new WebStorageAdapter();
    }
    return this.webLocalAdapter;
  }

  private async wrapWithFallback<T>(
    operationName: string,
    operation: (repo: StorageRepository) => Promise<T>,
    fallbackDefault: T | ((error: unknown) => T | Promise<T>)
  ): Promise<T> {
    try {
      const repo = this.getActiveRepository();
      return await operation(repo);
    } catch (error) {
      console.error(`Active storage ${operationName} failed, falling back:`, error);
      try {
        const fallbackRepo = this.getFallbackRepository();
        return await operation(fallbackRepo);
      } catch (e) {
        if (typeof fallbackDefault === 'function') {
          return await (fallbackDefault as (error: unknown) => T | Promise<T>)(e);
        }
        return fallbackDefault;
      }
    }
  }

  async saveEntry(entry: Entry): Promise<SaveResult> {
    return this.wrapWithFallback(
      'saveEntry',
      (repo) => repo.saveEntry(entry),
      (e) => ({ success: false, error: e instanceof Error ? e.message : 'Unknown error' })
    );
  }

  async getEntry(id: string): Promise<Entry | null> {
    return this.wrapWithFallback(
      'getEntry',
      (repo) => repo.getEntry(id),
      null
    );
  }

  async getEntries(): Promise<Entry[]> {
    return this.wrapWithFallback(
      'getEntries',
      (repo) => repo.getEntries(),
      []
    );
  }

  async getEntrySummaries(): Promise<EntrySummary[]> {
    return this.wrapWithFallback(
      'getEntrySummaries',
      (repo) => repo.getEntrySummaries(),
      []
    );
  }

  async updateEntry(id: string, data: Partial<Entry>): Promise<SaveResult> {
    return this.wrapWithFallback(
      'updateEntry',
      (repo) => repo.updateEntry(id, data),
      (e) => ({ success: false, error: e instanceof Error ? e.message : 'Unknown error' })
    );
  }

  async deleteEntry(id: string): Promise<void> {
    return this.wrapWithFallback(
      'deleteEntry',
      (repo) => repo.deleteEntry(id),
      undefined
    );
  }

  async uploadImage(file: File | Blob | string): Promise<ImageUploadResult> {
    return this.wrapWithFallback(
      'uploadImage',
      (repo) => repo.uploadImage(file),
      (e) => ({ success: false, error: e instanceof Error ? e.message : 'Unknown error' })
    );
  }

  async exportData(): Promise<string> {
    return this.wrapWithFallback(
      'exportData',
      (repo) => repo.exportData(),
      '[]'
    );
  }

  async importData(json: string): Promise<void> {
    return this.wrapWithFallback(
      'importData',
      (repo) => repo.importData(json),
      (e) => {
        throw e;
      }
    );
  }

  async getStorageLocation(): Promise<string> {
    return this.wrapWithFallback(
      'getStorageLocation',
      (repo) => repo.getStorageLocation(),
      'localStorage'
    );
  }

  async saveDraft(draft: DraftEntry): Promise<void> {
    return this.wrapWithFallback(
      'saveDraft',
      (repo) => repo.saveDraft(draft),
      undefined
    );
  }

  async getDraft(): Promise<DraftEntry | null> {
    return this.wrapWithFallback(
      'getDraft',
      (repo) => repo.getDraft(),
      null
    );
  }

  async clearDraft(): Promise<void> {
    return this.wrapWithFallback(
      'clearDraft',
      (repo) => repo.clearDraft(),
      undefined
    );
  }

  async saveSearchIndex(json: string): Promise<void> {
    return this.wrapWithFallback(
      'saveSearchIndex',
      (repo) => repo.saveSearchIndex(json),
      undefined
    );
  }

  async loadSearchIndex(): Promise<string | null> {
    return this.wrapWithFallback(
      'loadSearchIndex',
      (repo) => repo.loadSearchIndex(),
      null
    );
  }
}

let repositoryInstance: StorageRepository | null = null;

// On Web (non-Tauri) startup, try to auto-reconnect a previously granted
// FileSystem directory handle. RuntimeStorageRepository will automatically
// pick up the new mode on the next dispatch, so no explicit reset is needed.
if (typeof window !== 'undefined' && !isTauri()) {
  sharedWebFS.initialize(true).then((ready) => {
    if (ready) {
      console.info('WebFSStorage automatically re-connected via IndexedDB.');
    }
  });
}

export const getWebFS = () => sharedWebFS;

export const getStorageMode = (): StorageMode => {
  if (typeof window === 'undefined') {
    return 'web-local';
  }

  return isTauri() ? 'tauri' : (sharedWebFS.isReady() ? 'web-fs' : 'web-local');
};

export const getRepository = (): StorageRepository => {
  if (typeof window === 'undefined') {
    return NOOP_REPOSITORY;
  }

  if (!repositoryInstance) {
    repositoryInstance = new RuntimeStorageRepository(sharedWebFS);
  }

  return repositoryInstance;
};

export const getAdapterInfo = (): AdapterMetadata => {
  if (typeof window === 'undefined') {
    return {
      name: 'NoopStorageAdapter',
      version: '1.0.0',
      environment: 'web',
      capabilities: [],
    };
  }

  const repository = getRepository();
  // Call it on active repository or fallback
  const activeRepo =
    repository instanceof RuntimeStorageRepository
      ? repository.getActiveRepository()
      : repository;

  if (activeRepo && 'getMetadata' in activeRepo) {
    return (activeRepo as { getMetadata: () => AdapterMetadata }).getMetadata();
  }

  return {
    name: isTauri() ? 'NativeStorageAdapter' : 'WebStorageAdapter',
    version: '1.0.0',
    environment: isTauri() ? 'tauri' : 'web',
    capabilities: [],
  };
};

export const getStorageModeInfo = (): StorageModeInfo => {
  return STORAGE_MODE_INFO[getStorageMode()];
};

export const isRunningInTauri = (): boolean => {
  return isTauri();
};

export const isRunningInWeb = (): boolean => {
  return !isTauri();
};

export const createLazyRepositoryProxy = (): StorageRepository => {
  return new Proxy({} as StorageRepository, {
    get(_target, prop) {
      const value = Reflect.get(getRepository() as object, prop);

      if (typeof value === 'function') {
        return (...args: unknown[]) => {
          const targetValue = Reflect.get(getRepository() as object, prop);

          if (typeof targetValue !== 'function') {
            return targetValue;
          }

          return Reflect.apply(targetValue, getRepository(), args);
        };
      }

      return value;
    },
  });
};

