/**
 * Web File System Storage Adapter
 * Implement StorageRepository using modern HTML5 File System Access API
 * Allows true native local file read/write natively in Chrome/Edge.
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
import { get, set, del } from 'idb-keyval';

const DIRECTORY_HANDLE_KEY = 'bibliotheca_fs_handle';
const DRAFT_FILE_NAME = '.draft.json';
type JsonRecord = Record<string, unknown>;

// Helper to generate UUID-like IDs
const generateId = (): string => {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

const sanitizeFilename = (title: string): string => {
    return title
        .replace(/[^a-zA-Z0-9\-\_]/g, '_')
        .substring(0, 30) || 'untitled';
};

/**
 * Ensures a directory existence or creates it
 */
async function ensureDirectory(parentHandle: FileSystemDirectoryHandle, name: string): Promise<FileSystemDirectoryHandle> {
    return await parentHandle.getDirectoryHandle(name, { create: true });
}

const isJsonRecord = (value: unknown): value is JsonRecord => {
    return typeof value === 'object' && value !== null;
};

const parseJsonRecord = (text: string): JsonRecord | null => {
    const parsed: unknown = JSON.parse(text);
    return isJsonRecord(parsed) ? parsed : null;
};

const getString = (record: JsonRecord, ...keys: string[]): string | undefined => {
    for (const key of keys) {
        const value = record[key];
        if (typeof value === 'string') {
            return value;
        }
    }

    return undefined;
};

const getStringArray = (record: JsonRecord, key: string): string[] => {
    const value = record[key];

    if (!Array.isArray(value)) {
        return [];
    }

    return value.filter((item): item is string => typeof item === 'string');
};

const toEntry = (record: JsonRecord): Entry => ({
    id: getString(record, 'id'),
    title: getString(record, 'title') ?? '',
    figure: getString(record, 'figure') ?? '',
    moment: getString(record, 'moment') ?? '',
    narrative: getString(record, 'narrative') ?? '',
    keywords: getStringArray(record, 'keywords'),
    dateCreated: getString(record, 'date_created', 'dateCreated') ?? '',
    dateModified: getString(record, 'date_modified', 'dateModified'),
    imageUrl: getString(record, 'image_url', 'imageUrl'),
});

export class WebFSStorageAdapter implements StorageRepository {
    private metadata = getAdapterMetadata('web');
    private rootHandle: FileSystemDirectoryHandle | null = null;
    private isInitialized = false;

    constructor() { }

    // ==========================================================================
    // Initialization & Permission Management
    // ==========================================================================

    /**
     * Tries to restore the previously granted directory handle from IndexedDB.
     * If it requires re-permission, it will attempt to request it automatically
     * if the browser allows (or it throws error needing user gesture).
     */
    async initialize(requestPermissionSilence = true): Promise<boolean> {
        if (this.isInitialized && this.rootHandle) return true;

        try {
            const storedHandle = await get<FileSystemDirectoryHandle>(DIRECTORY_HANDLE_KEY);
            if (storedHandle) {
                // Verify permission
                const options = { mode: 'readwrite' as const };
                if (await storedHandle.queryPermission(options) === 'granted') {
                    this.rootHandle = storedHandle;
                    this.isInitialized = true;
                    return true;
                }

                // Try silently requesting permission if we have the handle
                if (requestPermissionSilence) {
                    const state = await storedHandle.requestPermission(options);
                    if (state === 'granted') {
                        this.rootHandle = storedHandle;
                        this.isInitialized = true;
                        return true;
                    }
                }
            }
        } catch (e) {
            console.warn("Could not restore directory handle from IndexedDB", e);
        }
        return false;
    }

    /**
     * Prompts the user to select a directory (MUST be called inside a User Gesture like onClick)
     */
    async requestDirectoryAccess(): Promise<boolean> {
        try {
            if (!window.showDirectoryPicker) {
                throw new Error('Your browser does not support the File System Access API.');
            }
            const handle = await window.showDirectoryPicker({
                id: 'bibliotheca_archive',
                mode: 'readwrite'
            });
            await set(DIRECTORY_HANDLE_KEY, handle);
            this.rootHandle = handle;
            this.isInitialized = true;

            // Ensure 'images' directory exists immediately
            await ensureDirectory(this.rootHandle!, 'images');

            return true;
        } catch (err) {
            console.error("Directory access denied or error:", err);
            return false;
        }
    }

    async disconnect(): Promise<void> {
        await del(DIRECTORY_HANDLE_KEY);
        this.rootHandle = null;
        this.isInitialized = false;
    }

    isReady(): boolean {
        return this.isInitialized && this.rootHandle !== null;
    }

    private requireHandle(): FileSystemDirectoryHandle {
        if (!this.rootHandle) {
            throw new Error('Storage not connected to local directory. Please authorize access first.');
        }
        return this.rootHandle;
    }

    // ==========================================================================
    // Entry Operations
    // ==========================================================================

    async saveEntry(entry: Entry): Promise<SaveResult> {
        try {
            const dirHandle = this.requireHandle();
            const id = entry.id || generateId();

            const payload: SavedEntry = {
                ...entry,
                id,
                dateModified: new Date().toISOString(),
            };

            // Exclude base64 from being written if we have imageUrl
            const payloadToSave = { ...payload };
            delete payloadToSave.imageBase64;

            const timestamp = new Date().toISOString().replace(/[:\.]/g, '-');
            const filename = `${sanitizeFilename(entry.title)}_${timestamp}.json`;

            const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(JSON.stringify(payloadToSave, null, 2));
            await writable.close();

            return {
                success: true,
                entryId: id,
                savedPath: filename,
            };
        } catch (error) {
            console.error('File System Access save error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    async getEntry(id: string): Promise<Entry | null> {
        const entries = await this.getEntries();
        return entries.find((e) => (e as SavedEntry).id === id) || null;
    }

    async getEntries(): Promise<Entry[]> {
        try {
            if (!this.isReady()) return [];
            const dirHandle = this.requireHandle();
            const entries: Entry[] = [];

            // Iterate async over folder
            for await (const [name, handle] of dirHandle.entries()) {
                if (handle.kind === 'file' && name.endsWith('.json') && name !== DRAFT_FILE_NAME) {
                    try {
                        const file = await handle.getFile();
                        const text = await file.text();
                        const data = parseJsonRecord(text);

                        if (data) {
                            entries.push(toEntry(data));
                        }
                    } catch (error) {
                        console.warn(`Could not parse JSON file: ${name}`, error);
                    }
                }
            }

            // Sort newest created first
            return entries.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
        } catch (error) {
            console.error('File System Access read entries failed:', error);
            return [];
        }
    }

    async getEntrySummaries(): Promise<EntrySummary[]> {
        const entries = await this.getEntries();
        return entries.map((entry) => ({
            id: (entry as SavedEntry).id || generateId(),
            title: entry.title,
            figure: entry.figure,
            imageUrl: entry.imageUrl,
            dateCreated: entry.dateCreated,
            keywords: entry.keywords,
        }));
    }

    async updateEntry(id: string, data: Partial<Entry>): Promise<SaveResult> {
        try {
            const dirHandle = this.requireHandle();

            // Need to find which file corresponds to this ID
            let targetFileHandle: FileSystemFileHandle | null = null;
            let existingData: JsonRecord | null = null;
            let targetName: string = '';

            for await (const [name, handle] of dirHandle.entries()) {
                if (handle.kind === 'file' && name.endsWith('.json') && name !== DRAFT_FILE_NAME) {
                    const file = await handle.getFile();
                    const text = await file.text();
                    try {
                        const parsed = parseJsonRecord(text);
                        if (parsed && getString(parsed, 'id') === id) {
                            targetFileHandle = handle;
                            existingData = parsed;
                            targetName = name;
                            break;
                        }
                    } catch { /* ignore parse error internally */ }
                }
            }

            if (!targetFileHandle || !existingData) {
                return { success: false, error: 'Entry not found' };
            }

            // Merge data
            const updatedData = {
                ...existingData,
                ...data,
                dateModified: new Date().toISOString()
            };

            // Re-map camelCases to what we actually use in the payload
            if (data.imageUrl !== undefined) updatedData.imageUrl = data.imageUrl;

            const writable = await targetFileHandle.createWritable();
            await writable.write(JSON.stringify(updatedData, null, 2));
            await writable.close();

            return {
                success: true,
                entryId: id,
                savedPath: targetName,
            };

        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    async deleteEntry(id: string): Promise<void> {
        try {
            const dirHandle = this.requireHandle();
            // Need to find which file corresponds to this ID, plus possibly image
            for await (const [name, handle] of dirHandle.entries()) {
                if (handle.kind === 'file' && name.endsWith('.json') && name !== DRAFT_FILE_NAME) {
                    const file = await handle.getFile();
                    const text = await file.text();
                    try {
                        const parsed = parseJsonRecord(text);
                        if (parsed && getString(parsed, 'id') === id) {
                            // Delete JSON file
                            await dirHandle.removeEntry(name);

                            // Attempt to delete associated image
                            const imageUrl = getString(parsed, 'imageUrl', 'image_url');
                            if (imageUrl) {
                                try {
                                    const imgDirHandle = await dirHandle.getDirectoryHandle('images');
                                    const imgName = imageUrl.split('/').pop();
                                    if (imgName) {
                                        await imgDirHandle.removeEntry(imgName);
                                    }
                                } catch { /* ignore image delete fail */ }
                            }
                            return;
                        }
                    } catch { }
                }
            }
        } catch (error) {
            console.error("Failed to delete entry", error);
        }
    }

    // ==========================================================================
    // Image Operations
    // ==========================================================================

    async uploadImage(file: File | Blob | string): Promise<ImageUploadResult> {
        try {
            const dirHandle = this.requireHandle();

            if (typeof file === 'string') {
                return { success: true, url: file };
            }

            // Ensure images directory exists
            const imgDirHandle = await ensureDirectory(dirHandle, 'images');

            // Generate filename
            const ext = file instanceof File ? file.name.split('.').pop() || 'png' : 'png';
            const filename = `${uuid_v4()}.${ext}`;

            const fileHandle = await imgDirHandle.getFileHandle(filename, { create: true });
            const writable = await fileHandle.createWritable();

            // Write Blob/File directly
            await writable.write(file);
            await writable.close();

            return {
                success: true,
                url: `images/${filename}`
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to save image',
            };
        }
    }

    /**
     * Resolve an image URL so an <img> tag can render it
     */
    async resolveImageUrl(url: string | undefined): Promise<string | undefined> {
        if (!url) return undefined;
        if (url.startsWith('blob:') || url.startsWith('http') || url.startsWith('data:')) {
            return url;
        }

        try {
            const dirHandle = this.requireHandle();
            if (url.startsWith('images/')) {
                const parts = url.split('/');
                const imgName = parts[parts.length - 1];
                const imgDirHandle = await dirHandle.getDirectoryHandle('images');
                const fileHandle = await imgDirHandle.getFileHandle(imgName);
                const file = await fileHandle.getFile();
                // Return an Object URL representation of the secure file access
                return URL.createObjectURL(file);
            }
            return url;
        } catch {
            return url;
        }
    }

    // ==========================================================================
    // Import/Export Operations (Stubs for native file mapping)
    // ==========================================================================

    async exportData(): Promise<string> {
        const entries = await this.getEntries();
        return JSON.stringify(entries, null, 2);
    }

    async importData(json: string): Promise<void> {
        const entries: unknown = JSON.parse(json);
        if (Array.isArray(entries)) {
            for (const entry of entries) {
                if (isJsonRecord(entry)) {
                    await this.saveEntry(toEntry(entry));
                }
            }
        }
    }

    async getStorageLocation(): Promise<string> {
        return this.rootHandle ? `Local Folder: ${this.rootHandle.name}` : 'Not Connected';
    }

    // ==========================================================================
    // Draft Operations
    // ==========================================================================

    async saveDraft(draft: DraftEntry): Promise<void> {
        if (!this.isReady()) return;
        try {
            const dirHandle = this.requireHandle();
            const fileHandle = await dirHandle.getFileHandle(DRAFT_FILE_NAME, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(JSON.stringify(draft));
            await writable.close();
        } catch (error) {
            console.warn('Failed to save draft:', error);
        }
    }

    async getDraft(): Promise<DraftEntry | null> {
        if (!this.isReady()) return null;
        try {
            const dirHandle = this.requireHandle();
            const fileHandle = await dirHandle.getFileHandle(DRAFT_FILE_NAME);
            const file = await fileHandle.getFile();
            const text = await file.text();
            return JSON.parse(text) as DraftEntry;
        } catch {
            return null;
        }
    }

    async clearDraft(): Promise<void> {
        if (!this.isReady()) return;
        try {
            const dirHandle = this.requireHandle();
            await dirHandle.removeEntry(DRAFT_FILE_NAME);
        } catch {
            // Ignore
        }
    }

    getMetadata() {
        return this.metadata;
    }
}

function uuid_v4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const createWebFSStorage = (): WebFSStorageAdapter => {
    return new WebFSStorageAdapter();
};
