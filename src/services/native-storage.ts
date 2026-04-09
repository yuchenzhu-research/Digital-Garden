/**
 * Native Storage Adapter
 * Implements StorageRepository using Tauri APIs for native desktop app
 * Uses dynamic imports to avoid bundling issues in web builds
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
import {
  bytesToDataUrl,
  getMimeTypeFromPath,
  isDataUrl,
  isManagedImagePath,
} from './portable-images';
import { parseBackupJson } from './storage-backups';

// ============================================================================
// Tauri Types (duplicated from Rust for TypeScript)
// ============================================================================

interface RustEntryPayload {
  id?: string;
  title: string;
  figure: string;
  moment: string;
  narrative: string;
  keywords: string[];
  image_base64?: string;
  image_url?: string;
  date_created: string;
  date_modified?: string;
}

interface RustSaveResult {
  success: boolean;
  entry_id?: string;
  file_path?: string;
  error?: string;
}

interface RustImageResult {
  success: boolean;
  url?: string;
  error?: string;
}

// ============================================================================
// Native Storage Adapter Class
// ============================================================================

/**
 * NativeStorageAdapter implements StorageRepository for Tauri environments
 * Uses Rust commands for file system operations
 */
export class NativeStorageAdapter implements StorageRepository {
  private metadata = getAdapterMetadata('tauri');
  private tauriCore: typeof import('@tauri-apps/api/core') | null = null;
  private tauriPath: typeof import('@tauri-apps/api/path') | null = null;
  private tauriFs: typeof import('@tauri-apps/plugin-fs') | null = null;

  // ==========================================================================
  // Lazy Tauri Loading
  // ==========================================================================

  /**
   * Initialize Tauri core module (called lazily)
   */
  private async initCore(): Promise<typeof import('@tauri-apps/api/core')> {
    if (this.tauriCore) {
      return this.tauriCore;
    }

    try {
      this.tauriCore = await import('@tauri-apps/api/core');
      return this.tauriCore;
    } catch (error) {
      throw new Error(
        `Failed to initialize Tauri Core API: ${error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  private async initPath(): Promise<typeof import('@tauri-apps/api/path')> {
    if (this.tauriPath) return this.tauriPath;
    try {
      this.tauriPath = await import('@tauri-apps/api/path');
      return this.tauriPath;
    } catch {
      throw new Error('Failed to init Tauri Path API');
    }
  }

  private async initFs(): Promise<typeof import('@tauri-apps/plugin-fs')> {
    if (this.tauriFs) return this.tauriFs;
    try {
      this.tauriFs = await import('@tauri-apps/plugin-fs');
      return this.tauriFs;
    } catch {
      throw new Error('Failed to init Tauri FS plugin');
    }
  }

  // ==========================================================================
  // Entry Operations
  // ==========================================================================

  async saveEntry(entry: Entry): Promise<SaveResult> {
    try {
      const { invoke } = await this.initCore();

      const payload: RustEntryPayload = {
        title: entry.title,
        figure: entry.figure,
        moment: entry.moment,
        narrative: entry.narrative,
        keywords: entry.keywords,
        image_base64: entry.imageBase64,
        image_url: await this.relativizeImageUrl(entry.imageUrl),
        date_created: entry.dateCreated,
        date_modified: new Date().toISOString(),
      };

      const result = await invoke<RustSaveResult | null>('save_entry', { payload });

      // Handle undefined result from invoke
      if (!result) {
        return {
          success: false,
          error: 'No response from save command',
        };
      }

      if (result.success && result.entry_id) {
        return {
          success: true,
          entryId: result.entry_id,
          savedPath: result.file_path,
        };
      }

      return {
        success: false,
        error: result.error || 'Unknown error',
      };
    } catch (error) {
      console.error('Native saveEntry error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getEntry(id: string): Promise<Entry | null> {
    try {
      const { invoke } = await this.initCore();

      const result = await invoke<RustEntryPayload | null>('get_entry', { id });

      if (!result) return null;

      return await this.rustToEntry(result);
    } catch (error) {
      console.error('Failed to get entry:', error);
      return null;
    }
  }

  async getEntries(): Promise<Entry[]> {
    try {
      const { invoke } = await this.initCore();

      const result = await invoke<RustEntryPayload[]>('get_all_entries');

      return await Promise.all(result.map((e) => this.rustToEntry(e)));
    } catch (error) {
      console.error('Failed to get entries:', error);
      return [];
    }
  }

  async getEntrySummaries(): Promise<EntrySummary[]> {
    const entries = await this.getEntries();
    return entries.map((entry) => ({
      id: (entry as SavedEntry).id || '',
      title: entry.title,
      figure: entry.figure,
      imageUrl: entry.imageUrl,
      dateCreated: entry.dateCreated,
      keywords: entry.keywords,
    }));
  }

  async updateEntry(id: string, data: Partial<Entry>): Promise<SaveResult> {
    try {
      const { invoke } = await this.initCore();
      const payload: Record<string, unknown> = { ...data };

      if (Object.prototype.hasOwnProperty.call(data, 'imageUrl')) {
        payload.imageUrl = data.imageUrl ?? null;
      }

      const result = await invoke<RustSaveResult | null>('update_entry', {
        id,
        payload,
      });

      // Handle undefined result from invoke
      if (!result) {
        return {
          success: false,
          error: 'No response from update command',
        };
      }

      return {
        success: result.success,
        entryId: result.entry_id,
        savedPath: result.file_path,
        error: result.error,
      };
    } catch (error) {
      console.error('Native updateEntry error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async deleteEntry(id: string): Promise<void> {
    try {
      const { invoke } = await this.initCore();
      await invoke('delete_entry', { id });
    } catch (error) {
      console.error('Failed to delete entry:', error);
      throw error;
    }
  }

  // ==========================================================================
  // Image Operations
  // ==========================================================================

  async uploadImage(file: File | Blob | string): Promise<ImageUploadResult> {
    try {
      const { invoke } = await this.initCore();

      if (typeof file === 'string') {
        // Already a URL/path
        return { success: true, url: file };
      }

      // Convert File/Blob to byte array to avoid base64 overhead
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      const result = await invoke<RustImageResult | null>('save_image_from_bytes', {
        bytes: Array.from(bytes), // Tauri uses Vec<u8> which accepts arrays of numbers from JS
        filename: file instanceof File ? file.name : 'image.png',
      });

      // Handle undefined result from invoke
      if (!result) {
        return {
          success: false,
          error: 'No response from image save command',
        };
      }

      if (result.success && result.url) {
        return { success: true, url: await this.resolveImageUrl(result.url) };
      }

      return {
        success: false,
        error: result.error || 'Failed to save image',
      };
    } catch (error) {
      console.error('Native uploadImage error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Convert File/Blob to base64 string
   */
  private async fileToBase64(file: File | Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix
        resolve(result.replace(/^data:image\/\w+;base64,/, ''));
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // ==========================================================================
  // Import/Export Operations
  // ==========================================================================

  private async readManagedImageAsDataUrl(relativePath: string): Promise<string | undefined> {
    if (!isManagedImagePath(relativePath)) {
      return undefined;
    }

    try {
      const fs = await this.initFs();
      const path = await this.initPath();
      const storagePath = await this.getStorageLocation();
      const absolutePath = await path.join(storagePath, relativePath);
      const bytes = await fs.readFile(absolutePath);
      return bytesToDataUrl(bytes, getMimeTypeFromPath(relativePath));
    } catch {
      return undefined;
    }
  }

  async exportData(): Promise<string> {
    const { invoke } = await this.initCore();
    const result = await invoke<RustEntryPayload[]>('get_all_entries');

    const entries: Entry[] = await Promise.all(result.map(async (payload) => ({
      id: payload.id,
      title: payload.title,
      figure: payload.figure,
      moment: payload.moment,
      narrative: payload.narrative,
      keywords: payload.keywords,
      imageBase64: payload.image_base64 ?? await this.readManagedImageAsDataUrl(payload.image_url ?? ''),
      imageUrl: payload.image_url,
      dateCreated: payload.date_created,
      dateModified: payload.date_modified,
    })));

    return JSON.stringify(entries, null, 2);
  }

  async importData(json: string): Promise<void> {
    try {
      const { invoke } = await this.initCore();
      const entries = parseBackupJson(json);
      const payload: RustEntryPayload[] = entries.map((entry) => ({
        id: entry.id,
        title: entry.title,
        figure: entry.figure,
        moment: entry.moment,
        narrative: entry.narrative,
        keywords: entry.keywords,
        image_base64: entry.imageBase64 || (isDataUrl(entry.imageUrl) ? entry.imageUrl : undefined),
        image_url: entry.imageBase64 || isDataUrl(entry.imageUrl) ? undefined : entry.imageUrl,
        date_created: entry.dateCreated,
        date_modified: entry.dateModified,
      }));

      await invoke('import_entries', {
        json: JSON.stringify(payload),
      });
    } catch (error) {
      throw new Error(
        `Failed to import data: ${error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  async getStorageLocation(): Promise<string> {
    try {
      const { invoke } = await this.initCore();
      return await invoke<string>('get_storage_path');
    } catch {
      return '~/Documents/DigitalGarden/Archive';
    }
  }

  // ==========================================================================
  // Draft Operations
  // ==========================================================================

  async saveDraft(draft: DraftEntry): Promise<void> {
    try {
      const fs = await this.initFs();
      const path = await this.initPath();
      const appDataDir = await path.appDataDir();

      // Ensure directory exists
      try {
        await fs.mkdir(appDataDir, { recursive: true });
      } catch {
        // Ignore if exists
      }

      const draftPath = await path.join(appDataDir, '.draft.json');
      await fs.writeTextFile(draftPath, JSON.stringify(draft));
    } catch (error) {
      console.warn('Native saveDraft error:', error);
    }
  }

  async getDraft(): Promise<DraftEntry | null> {
    try {
      const fs = await this.initFs();
      const path = await this.initPath();
      const appDataDir = await path.appDataDir();
      const draftPath = await path.join(appDataDir, '.draft.json');

      const exists = await fs.exists(draftPath);
      if (!exists) return null;

      const content = await fs.readTextFile(draftPath);
      return JSON.parse(content) as DraftEntry;
    } catch {
      return null;
    }
  }

  async clearDraft(): Promise<void> {
    try {
      const fs = await this.initFs();
      const path = await this.initPath();
      const appDataDir = await path.appDataDir();
      const draftPath = await path.join(appDataDir, '.draft.json');

      const exists = await fs.exists(draftPath);
      if (exists) {
        await fs.remove(draftPath);
      }
    } catch {
      // Ignore
    }
  }

  // ==========================================================================
  // Helper Methods
  // ==========================================================================

  private async resolveImageUrl(url: string | undefined): Promise<string | undefined> {
    if (!url) return undefined;
    if (url.startsWith('asset://') || url.startsWith('http') || url.startsWith('data:')) {
      return url;
    }
    try {
      const { convertFileSrc } = await this.initCore();
      const pathPlugins = await this.initPath();
      const storagePath = await this.getStorageLocation();
      const absolutePath = await pathPlugins.join(storagePath, url);
      return convertFileSrc(absolutePath);
    } catch {
      return url;
    }
  }

  private async relativizeImageUrl(url: string | undefined): Promise<string | undefined> {
    if (!url) return undefined;
    if (url.startsWith('asset://') || url.startsWith('http://localhost') || url.startsWith('https://localhost')) {
      const match = url.match(/images\/[^/]+$/);
      if (match) {
        return match[0];
      }
    }
    return url;
  }

  /**
   * Convert Rust payload to Entry type
   */
  private async rustToEntry(payload: RustEntryPayload): Promise<Entry> {
    return {
      id: payload.id,
      title: payload.title,
      figure: payload.figure,
      moment: payload.moment,
      narrative: payload.narrative,
      keywords: payload.keywords,
      imageBase64: payload.image_base64,
      imageUrl: await this.resolveImageUrl(payload.image_url),
      dateCreated: payload.date_created,
      dateModified: payload.date_modified,
    };
  }

  /**
   * Get adapter metadata
   */
  getMetadata() {
    return this.metadata;
  }
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create a NativeStorageAdapter instance
 */
export const createNativeStorage = (): NativeStorageAdapter => {
  return new NativeStorageAdapter();
};

// ============================================================================
// Default Export
// ============================================================================

export default NativeStorageAdapter;
