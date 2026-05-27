/**
 * Storage Repository Interface
 * Unified interface for data persistence across Web and Tauri environments
 */

// ============================================================================
// Entry Types
// ============================================================================

/**
 * Core entry interface used throughout the application
 * Represents a single archive entry (artifact/memory)
 */
export interface Entry {
  id?: string;
  title: string;
  figure: string;
  moment: string;
  narrative: string;
  keywords: string[];
  imageUrl?: string;           // URL or path to image
  imageBase64?: string;        // Base64 for local backup
  dateCreated: string;
  dateModified?: string;
}

/**
 * Entry with generated ID (used after saving)
 */
export interface SavedEntry extends Entry {
  id: string;
  savedPath?: string;          // File path (Tauri) or key (Web)
}

/**
 * Lightweight entry for lists/grid views
 */
export interface EntrySummary {
  id: string;
  title: string;
  figure: string;
  imageUrl?: string;
  dateCreated: string;
  keywords: string[];
}

/**
 * Result of a save operation
 */
export interface SaveResult {
  success: boolean;
  entryId?: string;
  savedPath?: string;
  error?: string;
}

/**
 * Result of an image upload operation
 */
export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Draft entry containing partial entry data
 */
export type DraftEntry = Partial<Entry>;

// ============================================================================
// Repository Interface
// ============================================================================

/**
 * StorageRepository defines the contract for data persistence operations.
 * Implement this interface for different environments (Web/Tauri).
 */
export interface StorageRepository {
  /**
   * Save a new entry to storage
   * @param entry - The entry data to save
   * @returns SaveResult containing success status and details
   */
  saveEntry(entry: Entry): Promise<SaveResult>;

  /**
   * Get a single entry by ID
   * @param id - The entry ID
   * @returns The entry or null if not found
   */
  getEntry(id: string): Promise<Entry | null>;

  /**
   * Get all entries
   * @returns Array of all entries
   */
  getEntries(): Promise<Entry[]>;

  /**
   * Get entries as summaries (lighter weight for lists)
   * @returns Array of entry summaries
   */
  getEntrySummaries(): Promise<EntrySummary[]>;

  /**
   * Update an existing entry
   * @param id - The entry ID
   * @param data - The updated entry data
   * @returns SaveResult
   */
  updateEntry(id: string, data: Partial<Entry>): Promise<SaveResult>;

  /**
   * Delete an entry
   * @param id - The entry ID
   * @returns void if successful
   */
  deleteEntry(id: string): Promise<void>;

  /**
   * Upload/draw an image file and get its URL/path
   * @param file - The image file or data
   * @returns ImageUploadResult with the image URL/path
   */
  uploadImage(file: File | Blob | string): Promise<ImageUploadResult>;

  /**
   * Export all entries as a JSON array
   * @returns JSON string of all entries
   */
  exportData(): Promise<string>;

  /**
   * Import entries from a JSON array
   * @param json - JSON string of entries
   * @returns void if successful
   */
  importData(json: string): Promise<void>;

  /**
   * Get the storage location/path
   * @returns The storage path or identifier
   */
  getStorageLocation(): Promise<string>;

  /**
   * Save a draft entry
   * @param draft - Partial entry data to save as draft
   */
  saveDraft(draft: DraftEntry): Promise<void>;

  /**
   * Get the current draft entry
   * @returns The draft entry or null if none exists
   */
  getDraft(): Promise<DraftEntry | null>;

  /**
   * Clear the current draft entry
   */
  clearDraft(): Promise<void>;

  /**
   * Save search index JSON
   */
  saveSearchIndex(json: string): Promise<void>;

  /**
   * Load search index JSON
   */
  loadSearchIndex(): Promise<string | null>;
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Custom error class for storage operations
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public code: string,
    public cause?: unknown
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

// ============================================================================
// Repository Factory Type
// ============================================================================

/**
 * Function type for creating repository instances
 */
export type RepositoryFactory = () => StorageRepository;

// ============================================================================
// Adapter Metadata
// ============================================================================

/**
 * Metadata about a storage adapter
 */
export interface AdapterMetadata {
  name: string;
  version: string;
  environment: 'tauri' | 'web';
  capabilities: string[];
}

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
      'saveDraft',
      'getDraft',
      'clearDraft',
    ],
  };
};