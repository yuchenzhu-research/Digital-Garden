/**
 * Services Index
 * Unified export point for all storage services
 */

// Main exports
export {
  getRepository,
  getAdapterInfo,
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
  getStorageLocation,
  default as entryService,
} from './entryService';

// Adapters
export { WebStorageAdapter } from './web-storage';
export { NativeStorageAdapter } from './native-storage';

// File-based import/export functions (web only)
export { exportToFile, importFromFile, hasUserEntries, getUserEntryCount } from './web-storage';

// Repository interface
export type {
  StorageRepository,
  Entry,
  SavedEntry,
  EntrySummary,
  SaveResult,
  ImageUploadResult,
} from './storage-repository';