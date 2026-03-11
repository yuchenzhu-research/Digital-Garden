/**
 * Services Index
 * Unified export point for all storage services
 */

// Main exports
export {
  getRepository,
  getAdapterInfo,
  getStorageModeInfo,
  isRunningInTauri,
  isRunningInWeb,
  saveEntry,
  getEntries,
  getEntry,
  updateEntry,
  deleteEntry,
  uploadImage,
  exportData,
  importData,
  exportToFile,
  importFromFile,
  hasUserEntries,
  getUserEntryCount,
  getStorageLocation,
  default as entryService,
} from './entryService';

// Adapters
export { WebStorageAdapter } from './web-storage';
export { NativeStorageAdapter } from './native-storage';

// Repository interface
export type {
  StorageRepository,
  Entry,
  SavedEntry,
  EntrySummary,
  SaveResult,
  ImageUploadResult,
} from './storage-repository';

export type {
  StorageMode,
  StorageModeInfo,
  FileExportResult,
  FileImportOptions,
  FileImportResult,
} from './entryService';
