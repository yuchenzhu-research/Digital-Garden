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
};

const sharedWebFS = new WebFSStorageAdapter();

class RuntimeStorageRepository implements StorageRepository {
  private nativeAdapter: NativeStorageAdapter | null = null;
  private webFSAdapter: WebFSStorageAdapter;
  private webLocalAdapter: WebStorageAdapter | null = null;

  constructor(webFS: WebFSStorageAdapter) {
    this.webFSAdapter = webFS;
  }

  private getActiveRepository(): StorageRepository {
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

  async saveEntry(entry: Entry): Promise<SaveResult> {
    try {
      const repo = this.getActiveRepository();
      return await repo.saveEntry(entry);
    } catch (error) {
      console.error('Active storage saveEntry failed, falling back:', error);
      try {
        return await this.getFallbackRepository().saveEntry(entry);
      } catch (e) {
        return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
      }
    }
  }

  async getEntry(id: string): Promise<Entry | null> {
    try {
      const repo = this.getActiveRepository();
      return await repo.getEntry(id);
    } catch (error) {
      console.error('Active storage getEntry failed, falling back:', error);
      try {
        return await this.getFallbackRepository().getEntry(id);
      } catch {
        return null;
      }
    }
  }

  async getEntries(): Promise<Entry[]> {
    try {
      const repo = this.getActiveRepository();
      return await repo.getEntries();
    } catch (error) {
      console.error('Active storage getEntries failed, falling back:', error);
      try {
        return await this.getFallbackRepository().getEntries();
      } catch {
        return [];
      }
    }
  }

  async getEntrySummaries(): Promise<EntrySummary[]> {
    try {
      const repo = this.getActiveRepository();
      return await repo.getEntrySummaries();
    } catch (error) {
      console.error('Active storage getEntrySummaries failed, falling back:', error);
      try {
        return await this.getFallbackRepository().getEntrySummaries();
      } catch {
        return [];
      }
    }
  }

  async updateEntry(id: string, data: Partial<Entry>): Promise<SaveResult> {
    try {
      const repo = this.getActiveRepository();
      return await repo.updateEntry(id, data);
    } catch (error) {
      console.error('Active storage updateEntry failed, falling back:', error);
      try {
        return await this.getFallbackRepository().updateEntry(id, data);
      } catch (e) {
        return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
      }
    }
  }

  async deleteEntry(id: string): Promise<void> {
    try {
      const repo = this.getActiveRepository();
      await repo.deleteEntry(id);
    } catch (error) {
      console.error('Active storage deleteEntry failed, falling back:', error);
      try {
        await this.getFallbackRepository().deleteEntry(id);
      } catch {
        // Ignored
      }
    }
  }

  async uploadImage(file: File | Blob | string): Promise<ImageUploadResult> {
    try {
      const repo = this.getActiveRepository();
      return await repo.uploadImage(file);
    } catch (error) {
      console.error('Active storage uploadImage failed, falling back:', error);
      try {
        return await this.getFallbackRepository().uploadImage(file);
      } catch (e) {
        return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
      }
    }
  }

  async exportData(): Promise<string> {
    try {
      const repo = this.getActiveRepository();
      return await repo.exportData();
    } catch (error) {
      console.error('Active storage exportData failed, falling back:', error);
      try {
        return await this.getFallbackRepository().exportData();
      } catch {
        return '[]';
      }
    }
  }

  async importData(json: string): Promise<void> {
    try {
      const repo = this.getActiveRepository();
      await repo.importData(json);
    } catch (error) {
      console.error('Active storage importData failed, falling back:', error);
      try {
        await this.getFallbackRepository().importData(json);
      } catch (e) {
        throw e;
      }
    }
  }

  async getStorageLocation(): Promise<string> {
    try {
      const repo = this.getActiveRepository();
      return await repo.getStorageLocation();
    } catch (error) {
      console.error('Active storage getStorageLocation failed, falling back:', error);
      try {
        return await this.getFallbackRepository().getStorageLocation();
      } catch {
        return 'localStorage';
      }
    }
  }

  async saveDraft(draft: DraftEntry): Promise<void> {
    try {
      const repo = this.getActiveRepository();
      await repo.saveDraft(draft);
    } catch (error) {
      console.error('Active storage saveDraft failed, falling back:', error);
      try {
        await this.getFallbackRepository().saveDraft(draft);
      } catch {
        // Ignored
      }
    }
  }

  async getDraft(): Promise<DraftEntry | null> {
    try {
      const repo = this.getActiveRepository();
      return await repo.getDraft();
    } catch (error) {
      console.error('Active storage getDraft failed, falling back:', error);
      try {
        return await this.getFallbackRepository().getDraft();
      } catch {
        return null;
      }
    }
  }

  async clearDraft(): Promise<void> {
    try {
      const repo = this.getActiveRepository();
      await repo.clearDraft();
    } catch (error) {
      console.error('Active storage clearDraft failed, falling back:', error);
      try {
        await this.getFallbackRepository().clearDraft();
      } catch {
        // Ignored
      }
    }
  }
}

let repositoryInstance: StorageRepository | null = null;

const resetRepositoryRuntime = () => {
  // Reset runtime parameters, but since repositoryInstance is RuntimeStorageRepository,
  // we do not set it to null. Instead, getActiveRepository will automatically query new modes.
};

if (typeof window !== 'undefined' && !isTauri()) {
  sharedWebFS.initialize(true).then((ready) => {
    if (ready) {
      console.info('WebFSStorage automatically re-connected via IndexedDB.');
      resetRepositoryRuntime();
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
  const activeRepo = (repository as unknown as { getActiveRepository?: () => StorageRepository }).getActiveRepository?.() || repository;
  if (activeRepo && 'getMetadata' in activeRepo) {
    return (activeRepo as unknown as { getMetadata: () => AdapterMetadata }).getMetadata();
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

