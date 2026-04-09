import { isTauri } from '@/utils/env';
import { NativeStorageAdapter } from './native-storage';
import { WebFSStorageAdapter } from './web-fs-storage';
import { WebStorageAdapter } from './web-storage';
import type { AdapterMetadata, StorageRepository } from './storage-repository';

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

let repositoryInstance: StorageRepository | null = null;
let currentStorageMode: StorageMode | null = null;

const sharedWebFS = new WebFSStorageAdapter();
let sharedWebLocal: WebStorageAdapter | null = null;

const resetRepositoryRuntime = () => {
  repositoryInstance = null;
  currentStorageMode = null;
};

if (typeof window !== 'undefined' && !isTauri()) {
  sharedWebFS.initialize(true).then((ready) => {
    if (ready) {
      console.log('WebFSStorage automatically re-connected via IndexedDB.');
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

const createRepositoryForMode = (mode: StorageMode): StorageRepository => {
  switch (mode) {
    case 'tauri':
      return new NativeStorageAdapter();
    case 'web-fs':
      return sharedWebFS;
    case 'web-local':
    default:
      if (!sharedWebLocal) {
        sharedWebLocal = new WebStorageAdapter();
      }

      return sharedWebLocal;
  }
};

export const getRepository = (): StorageRepository => {
  if (typeof window === 'undefined') {
    throw new Error('Storage service is only available in browser environments');
  }

  const storageMode = getStorageMode();
  if (repositoryInstance && currentStorageMode === storageMode) {
    return repositoryInstance;
  }

  repositoryInstance = createRepositoryForMode(storageMode);
  currentStorageMode = storageMode;

  return repositoryInstance;
};

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
