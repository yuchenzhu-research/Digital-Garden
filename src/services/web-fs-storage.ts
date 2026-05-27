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
    getAdapterMetadata,
} from './storage-repository';
import { get, set, del } from 'idb-keyval';
import {
    blobToDataUrl,
    dataUrlToBlob,
    isDataUrl,
    isManagedImagePath,
} from './portable-images';
import { parseBackupJson } from './storage-backups';
import { generateId, toEntrySummaries } from './storage-shared';

const DIRECTORY_HANDLE_KEY = 'bibliotheca_fs_handle';
const DRAFT_FILE_NAME = '.draft.json';
type JsonRecord = Record<string, unknown>;


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

const isFileHandle = (handle: FileSystemHandle): handle is FileSystemFileHandle => {
    return handle.kind === 'file';
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
    imageBase64: getString(record, 'image_base64', 'imageBase64'),
    imageUrl: getString(record, 'image_url', 'imageUrl'),
});

export class WebFSStorageAdapter implements StorageRepository {
    private metadata = getAdapterMetadata('web');
    private rootHandle: FileSystemDirectoryHandle | null = null;
    private isInitialized = false;
    private imageUrlCache = new Map<string, string>();

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
            this.clearImageUrlCache();
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
        this.clearImageUrlCache();
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

    private clearImageUrlCache(): void {
        for (const objectUrl of this.imageUrlCache.values()) {
            URL.revokeObjectURL(objectUrl);
        }

        this.imageUrlCache.clear();
    }

    private releaseCachedImageUrl(relativePath: string | undefined): void {
        if (!relativePath) {
            return;
        }

        const cached = this.imageUrlCache.get(relativePath);
        if (cached) {
            URL.revokeObjectURL(cached);
            this.imageUrlCache.delete(relativePath);
        }
    }

    private async hydrateEntry(entry: Entry): Promise<Entry> {
        if (!entry.imageUrl) {
            return entry;
        }

        return {
            ...entry,
            imageUrl: await this.resolveImageUrl(entry.imageUrl),
        };
    }

    private async readManagedImageAsDataUrl(relativePath: string): Promise<string | undefined> {
        if (!isManagedImagePath(relativePath)) {
            return undefined;
        }

        try {
            const dirHandle = this.requireHandle();
            const parts = relativePath.split('/');
            const imgName = parts[parts.length - 1];
            const imgDirHandle = await dirHandle.getDirectoryHandle('images');
            const fileHandle = await imgDirHandle.getFileHandle(imgName);
            const file = await fileHandle.getFile();
            return await blobToDataUrl(file);
        } catch {
            return undefined;
        }
    }

    private async createPortableEntry(entry: Entry): Promise<Entry> {
        if (!isManagedImagePath(entry.imageUrl)) {
            return entry;
        }

        const imageBase64 = await this.readManagedImageAsDataUrl(entry.imageUrl);
        if (!imageBase64) {
            return entry;
        }

        return {
            ...entry,
            imageBase64,
        };
    }

    private async prepareImportedEntry(entry: Entry): Promise<Entry> {
        const embeddedImage = entry.imageBase64 || (isDataUrl(entry.imageUrl) ? entry.imageUrl : undefined);

        if (!embeddedImage) {
            return {
                ...entry,
                imageBase64: undefined,
            };
        }

        try {
            const blob = await dataUrlToBlob(embeddedImage);
            const uploadResult = await this.uploadImage(blob);

            if (uploadResult.success && uploadResult.url) {
                return {
                    ...entry,
                    imageUrl: uploadResult.url,
                    imageBase64: undefined,
                };
            }
        } catch (error) {
            console.warn('Failed to materialize imported image into Folder Mode:', error);
        }

        return {
            ...entry,
            imageUrl: embeddedImage,
            imageBase64: undefined,
        };
    }

    private async readEntries(options: { resolveImages: boolean }): Promise<Entry[]> {
        if (!this.isReady()) return [];

        const dirHandle = this.requireHandle();
        const entries: Entry[] = [];

        for await (const [name, handle] of dirHandle.entries()) {
            if (isFileHandle(handle) && name.endsWith('.json') && name !== DRAFT_FILE_NAME) {
                try {
                    const file = await handle.getFile();
                    const text = await file.text();
                    const data = parseJsonRecord(text);

                    if (data) {
                        const entry = toEntry(data);
                        entries.push(options.resolveImages ? await this.hydrateEntry(entry) : entry);
                    }
                } catch (error) {
                    console.warn(`Could not parse JSON file: ${name}`, error);
                }
            }
        }

        return entries.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
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
            return await this.readEntries({ resolveImages: true });
        } catch (error) {
            console.error('File System Access read entries failed:', error);
            return [];
        }
    }

    async getEntrySummaries(): Promise<EntrySummary[]> {
        return toEntrySummaries(await this.getEntries());
    }

    async updateEntry(id: string, data: Partial<Entry>): Promise<SaveResult> {
        try {
            const dirHandle = this.requireHandle();

            // Need to find which file corresponds to this ID
            let targetFileHandle: FileSystemFileHandle | null = null;
            let existingData: JsonRecord | null = null;
            let targetName: string = '';

            for await (const [name, handle] of dirHandle.entries()) {
                if (isFileHandle(handle) && name.endsWith('.json') && name !== DRAFT_FILE_NAME) {
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

            const previousImageUrl = getString(existingData, 'imageUrl', 'image_url');

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

            if (data.imageUrl !== undefined && data.imageUrl !== previousImageUrl) {
                this.releaseCachedImageUrl(previousImageUrl);
            }

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
                if (isFileHandle(handle) && name.endsWith('.json') && name !== DRAFT_FILE_NAME) {
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
                                this.releaseCachedImageUrl(imageUrl);
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
            const filename = `${generateId()}.${ext}`;

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
                const cachedUrl = this.imageUrlCache.get(url);
                if (cachedUrl) {
                    return cachedUrl;
                }

                const parts = url.split('/');
                const imgName = parts[parts.length - 1];
                const imgDirHandle = await dirHandle.getDirectoryHandle('images');
                const fileHandle = await imgDirHandle.getFileHandle(imgName);
                const file = await fileHandle.getFile();
                // Return an Object URL representation of the secure file access
                const objectUrl = URL.createObjectURL(file);
                this.imageUrlCache.set(url, objectUrl);
                return objectUrl;
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
        const entries = await this.readEntries({ resolveImages: false });
        const portableEntries = await Promise.all(entries.map((entry) => this.createPortableEntry(entry)));
        return JSON.stringify(portableEntries, null, 2);
    }

    async importData(json: string): Promise<void> {
        const entries = parseBackupJson(json);
        for (const entry of entries) {
            const preparedEntry = await this.prepareImportedEntry(entry);
            await this.saveEntry(preparedEntry);
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

    // ==========================================================================
    // Search Index Operations
    // ==========================================================================

    async saveSearchIndex(json: string): Promise<void> {
        try {
            await set('bibliotheca_search_index', json);
        } catch (e) {
            console.warn('WebFSStorage saveSearchIndex error:', e);
        }
    }

    async loadSearchIndex(): Promise<string | null> {
        try {
            const index = await get<string>('bibliotheca_search_index');
            return index || null;
        } catch (e) {
            console.warn('WebFSStorage loadSearchIndex error:', e);
            return null;
        }
    }

    getMetadata() {
        return this.metadata;
    }
}


export const createWebFSStorage = (): WebFSStorageAdapter => {
    return new WebFSStorageAdapter();
};
