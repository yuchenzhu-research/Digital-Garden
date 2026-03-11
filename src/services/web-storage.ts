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
} from './storage-repository';
import { getAdapterMetadata } from './adapter-metadata';
import { isManagedImagePath } from './portable-images';

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
 * Generate a unique ID
 */
const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Check if running in browser
 */
const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
};

/**
 * Load entries from localStorage
 */
const loadEntries = (): Entry[] => {
  if (!isBrowser()) return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ENTRIES);
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
const saveEntries = (entries: Entry[]): boolean => {
  if (!isBrowser()) return false;

  try {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
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
  constructor(private prefix: string = '') { }

  // ==========================================================================
  // Entry Operations
  // ==========================================================================

  async saveEntry(entry: Entry): Promise<SaveResult> {
    const id = generateId();
    const now = new Date().toISOString();

    const savedEntry: SavedEntry = {
      ...entry,
      id,
      dateModified: now,
      savedPath: `${STORAGE_KEYS.ENTRIES}:${id}`,
    };

    try {
      const entries = loadEntries();
      entries.push(savedEntry);
      const saved = saveEntries(entries);

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
    const entries = loadEntries();
    const entry = entries.find((e) => (e as SavedEntry).id === id);
    return entry || null;
  }

  async getEntries(): Promise<Entry[]> {
    return loadEntries();
  }

  async getEntrySummaries(): Promise<EntrySummary[]> {
    const entries = loadEntries();
    return entries.map((entry) => {
      const saved = entry as SavedEntry;
      return {
        id: saved.id || generateId(),
        title: entry.title,
        figure: entry.figure,
        imageUrl: entry.imageUrl,
        dateCreated: entry.dateCreated,
        keywords: entry.keywords,
      };
    });
  }

  async updateEntry(id: string, data: Partial<Entry>): Promise<SaveResult> {
    try {
      const entries = loadEntries();
      const index = entries.findIndex((e) => (e as SavedEntry).id === id);

      if (index === -1) {
        return { success: false, error: 'Entry not found' };
      }

      entries[index] = {
        ...entries[index],
        ...data,
        dateModified: new Date().toISOString(),
      };

      saveEntries(entries);

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
    const entries = loadEntries();
    const filtered = entries.filter((e) => (e as SavedEntry).id !== id);
    saveEntries(filtered);
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
    const entries = loadEntries();
    return JSON.stringify(entries, null, 2);
  }

  async importData(json: string): Promise<void> {
    try {
      const entries = JSON.parse(json);
      if (!Array.isArray(entries)) {
        throw new Error('Invalid data format');
      }

      const existingEntries = loadEntries();
      const merged = [...existingEntries];

      for (const entry of entries) {
        const normalizedEntry = normalizeImportedEntry(entry as Entry);
        // Skip if ID already exists
        const exists = merged.some(
          (e) => (e as SavedEntry).id === (normalizedEntry as SavedEntry).id
        );
        if (!exists) {
          merged.push(normalizedEntry);
        }
      }

      saveEntries(merged);
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
  // Metadata
  // ==========================================================================

  getMetadata() {
    return this.metadata;
  }
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create a WebStorageAdapter instance
 */
export const createWebStorage = (prefix?: string): WebStorageAdapter => {
  return new WebStorageAdapter(prefix);
};

// ============================================================================
// File-based Export/Import Functions (Browser Download/Upload)
// ============================================================================

/**
 * Export all entries to a downloadable JSON file
 * Triggers browser download dialog
 */
export const exportToFile = async (): Promise<{ success: boolean; filename?: string; error?: string }> => {
  if (!isBrowser()) {
    return { success: false, error: 'Not running in browser' };
  }

  try {
    const entries = loadEntries();
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `bibliotheca_backup_${timestamp}.json`;

    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      entryCount: entries.length,
      entries,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, filename };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export',
    };
  }
};

/**
 * Import entries from an uploaded JSON file
 * @param file - The file to import
 * @param options - Import options
 * @returns Result with count of imported entries
 */
export const importFromFile = async (
  file: File,
  options: { merge?: boolean; onProgress?: (count: number) => void } = {}
): Promise<{ success: boolean; importedCount?: number; error?: string }> => {
  if (!isBrowser()) {
    return { success: false, error: 'Not running in browser' };
  }

  try {
    const text = await file.text();
    const data = JSON.parse(text);

    // Validate format
    if (!data.entries || !Array.isArray(data.entries)) {
      return { success: false, error: 'Invalid file format: missing entries array' };
    }

    const entries: Entry[] = data.entries;
    const existingEntries = loadEntries();
    let merged: Entry[];

    if (options.merge !== false) {
      // Merge with existing entries (skip duplicates)
      merged = [...existingEntries];
      for (const entry of entries) {
        const exists = merged.some(
          (e) => (e as SavedEntry).id === (entry as SavedEntry).id
        );
        if (!exists) {
          merged.push(entry);
          options.onProgress?.(merged.length - existingEntries.length);
        }
      }
    } else {
      // Replace all entries
      merged = entries;
    }

    saveEntries(merged);
    return {
      success: true,
      importedCount: merged.length - existingEntries.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to import',
    };
  }
};

/**
 * Check if any user entries exist
 */
export const hasUserEntries = (): boolean => {
  if (!isBrowser()) return false;
  const entries = loadEntries();
  return entries.length > 0;
};

/**
 * Get count of user entries
 */
export const getUserEntryCount = (): number => {
  return loadEntries().length;
};

// ============================================================================
// Default Export
// ============================================================================

export default WebStorageAdapter;
