/**
 * Adapter Metadata
 * Provides information about storage adapters
 */

import type { AdapterMetadata } from './storage-repository';

/**
 * Get adapter metadata
 */
export const getAdapterMetadata = (environment: 'tauri' | 'web'): AdapterMetadata => {
  return {
    name: environment === 'tauri' ? 'NativeStorageAdapter' : 'WebStorageAdapter',
    version: '1.0.0',
    environment,
    capabilities: [
      'saveEntry',
      'getEntry',
      'getEntries',
      'updateEntry',
      'deleteEntry',
      'uploadImage',
      'exportData',
      'importData',
    ],
  };
};