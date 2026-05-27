/**
 * Web Storage Adapter
 * Implements StorageRepository using browser APIs (localStorage, fetch)
 * Used when running in standard browser environment
 */

import {
  Entry,
  SavedEntry,
  EntrySummary,
  SaveResult,
  ImageUploadResult,
  StorageRepository,
  DraftEntry,
  getAdapterMetadata,
} from './storage-repository';
import { parseBackupJson } from './storage-backups';
import { isManagedImagePath } from './portable-images';
import { generateId, toEntrySummaries } from './storage-shared';

// ============================================================================
// Storage Keys
// ============================================================================

const STORAGE_KEYS = {
  ENTRIES: 'bibliotheca_entries',
  LAST_BACKUP: 'bibliotheca_last_backup',
  DRAFT: 'bibliotheca_draft',
} as const;

// ============================================================================
// Utility Functions
// ============================================================================


/**
 * Check if running in browser
 */
const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
};

/**
 * Load entries from localStorage
 */
const loadEntries = (prefix: string = ''): Entry[] => {
  if (!isBrowser()) return [];

  try {
    const key = prefix ? `${prefix}_${STORAGE_KEYS.ENTRIES}` : STORAGE_KEYS.ENTRIES;
    const stored = localStorage.getItem(key);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    console.warn('Failed to load entries from localStorage');
    return [];
  }
};

/**
 * Save entries to localStorage
 * @returns true if successful, false if storage is full or unavailable
 */
const saveEntries = (entries: Entry[], prefix: string = ''): boolean => {
  if (!isBrowser()) return false;

  try {
    const key = prefix ? `${prefix}_${STORAGE_KEYS.ENTRIES}` : STORAGE_KEYS.ENTRIES;
    localStorage.setItem(key, JSON.stringify(entries));
    return true;
  } catch (error) {
    // QuotaExceededError or other storage errors
    console.error('Failed to save entries to localStorage:', error);
    return false;
  }
};

const normalizeImportedEntry = (entry: Entry): Entry => {
  if (entry.imageBase64 && (!entry.imageUrl || isManagedImagePath(entry.imageUrl))) {
    return {
      ...entry,
      imageUrl: entry.imageBase64,
    };
  }

  return entry;
};

// ============================================================================
// Web Storage Adapter Class
// ============================================================================

/**
 * WebStorageAdapter implements StorageRepository for browser environments
 * Uses localStorage for persistence and base64 for image handling
 */
export class WebStorageAdapter implements StorageRepository {
  private metadata = getAdapterMetadata('web');

  /**
   * Constructor
   * @param prefix - Optional prefix for storage keys (useful for multi-user)
   */
  private prefix: string;
  constructor(prefix: string = '') {
    this.prefix = prefix;
  }

  // ==========================================================================
  // Entry Operations
  // ==========================================================================

  async saveEntry(entry: Entry): Promise<SaveResult> {
    const id = entry.id || generateId();
    const now = new Date().toISOString();

    const savedEntry: SavedEntry = {
      ...entry,
      id,
      dateModified: now,
      savedPath: `${STORAGE_KEYS.ENTRIES}:${id}`,
    };

    try {
      const entries = loadEntries(this.prefix);
      entries.push(savedEntry);
      const saved = saveEntries(entries, this.prefix);

      if (!saved) {
        return {
          success: false,
          error: 'Storage full or unavailable. Please clear some space and try again.',
        };
      }

      // Also save as last backup for quick access
      if (isBrowser()) {
        const backupKey = this.prefix
          ? `${this.prefix}_${STORAGE_KEYS.LAST_BACKUP}`
          : STORAGE_KEYS.LAST_BACKUP;
        try {
          localStorage.setItem(backupKey, JSON.stringify(savedEntry));
        } catch {
          // Ignore backup save errors
        }
      }

      return {
        success: true,
        entryId: id,
        savedPath: savedEntry.savedPath,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getEntry(id: string): Promise<Entry | null> {
    const entries = loadEntries(this.prefix);
    const entry = entries.find((e) => (e as SavedEntry).id === id);
    return entry || null;
  }

  async getEntries(): Promise<Entry[]> {
    return loadEntries(this.prefix);
  }

  async getEntrySummaries(): Promise<EntrySummary[]> {
    return toEntrySummaries(loadEntries(this.prefix));
  }

  async updateEntry(id: string, data: Partial<Entry>): Promise<SaveResult> {
    try {
      const entries = loadEntries(this.prefix);
      const index = entries.findIndex((e) => (e as SavedEntry).id === id);

      if (index === -1) {
        return { success: false, error: 'Entry not found' };
      }

      entries[index] = {
        ...entries[index],
        ...data,
        dateModified: new Date().toISOString(),
      };

      saveEntries(entries, this.prefix);

      return {
        success: true,
        entryId: id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async deleteEntry(id: string): Promise<void> {
    const entries = loadEntries(this.prefix);
    const filtered = entries.filter((e) => (e as SavedEntry).id !== id);
    saveEntries(filtered, this.prefix);
  }

  // ==========================================================================
  // Image Operations
  // ==========================================================================

  async uploadImage(file: File | Blob | string): Promise<ImageUploadResult> {
    try {
      let dataUrl: string;

      if (typeof file === 'string') {
        // Already a URL/path, return as-is
        return { success: true, url: file };
      }

      // Convert File/Blob to base64 data URL
      if (file instanceof Blob) {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        dataUrl = `data:${file.type};base64,${base64}`;
      } else {
        // File object
        dataUrl = await this.fileToDataURL(file);
      }

      return { success: true, url: dataUrl };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload image',
      };
    }
  }

  /**
   * Convert File to data URL
   */
  private fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // ==========================================================================
  // Import/Export Operations
  // ==========================================================================

  async exportData(): Promise<string> {
    const entries = loadEntries(this.prefix);
    return JSON.stringify(entries, null, 2);
  }

  async importData(json: string, conflictBehavior?: string): Promise<void> {
    try {
      const entries = parseBackupJson(json);

      const existingEntries = loadEntries(this.prefix);
      const merged = [...existingEntries];

      for (const entry of entries) {
        const normalizedEntry = normalizeImportedEntry(entry as Entry);
        const entryId = normalizedEntry.id || generateId();

        const existingIndex = merged.findIndex(
          (e) => (e as SavedEntry).id === entryId
        );

        if (existingIndex !== -1) {
          if (conflictBehavior === 'overwrite') {
            merged[existingIndex] = {
              ...normalizedEntry,
              id: entryId,
              dateModified: new Date().toISOString(),
            } as SavedEntry;
          } else if (conflictBehavior === 'duplicate') {
            const newId = generateId();
            merged.push({
              ...normalizedEntry,
              id: newId,
              dateModified: new Date().toISOString(),
            } as SavedEntry);
          }
          // If skip, do nothing (skip)
        } else {
          merged.push({
            ...normalizedEntry,
            id: entryId,
          } as SavedEntry);
        }
      }

      saveEntries(merged, this.prefix);
    } catch (error) {
      throw new Error(
        `Failed to import data: ${error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  async getStorageLocation(): Promise<string> {
    return 'localStorage';
  }

  // ==========================================================================
  // Draft Operations
  // ==========================================================================

  async saveDraft(draft: DraftEntry): Promise<void> {
    if (!isBrowser()) return;
    try {
      const draftKey = this.prefix
        ? `${this.prefix}_${STORAGE_KEYS.DRAFT}`
        : STORAGE_KEYS.DRAFT;
      localStorage.setItem(draftKey, JSON.stringify(draft));
    } catch (error) {
      console.warn('Failed to save draft:', error);
    }
  }

  async getDraft(): Promise<DraftEntry | null> {
    if (!isBrowser()) return null;
    try {
      const draftKey = this.prefix
        ? `${this.prefix}_${STORAGE_KEYS.DRAFT}`
        : STORAGE_KEYS.DRAFT;
      const stored = localStorage.getItem(draftKey);
      if (!stored) return null;
      return JSON.parse(stored) as DraftEntry;
    } catch {
      return null;
    }
  }

  async clearDraft(): Promise<void> {
    if (!isBrowser()) return;
    try {
      const draftKey = this.prefix
        ? `${this.prefix}_${STORAGE_KEYS.DRAFT}`
        : STORAGE_KEYS.DRAFT;
      localStorage.removeItem(draftKey);
    } catch {
      // Ignore
    }
  }

  // ==========================================================================
  // Search Index Operations
  // ==========================================================================

  async saveSearchIndex(json: string): Promise<void> {
    if (!isBrowser()) return;
    try {
      const indexKey = this.prefix
        ? `${this.prefix}_bibliotheca_search_index`
        : 'bibliotheca_search_index';
      localStorage.setItem(indexKey, json);
    } catch (error) {
      console.warn('WebStorage saveSearchIndex error:', error);
    }
  }

  async loadSearchIndex(): Promise<string | null> {
    if (!isBrowser()) return null;
    try {
      const indexKey = this.prefix
        ? `${this.prefix}_bibliotheca_search_index`
        : 'bibliotheca_search_index';
      return localStorage.getItem(indexKey);
    } catch {
      return null;
    }
  }

  // ==========================================================================
  // Metadata
  // ==========================================================================

  getMetadata() {
    return this.metadata;
  }
}

// ============================================================================
// Default Export
// ============================================================================

export default WebStorageAdapter;
