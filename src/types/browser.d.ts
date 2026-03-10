import type Lenis from 'lenis';

interface DirectoryPickerOptions {
  id?: string;
  mode?: 'read' | 'readwrite';
  startIn?: unknown;
}

declare global {
  interface Window {
    __LENIS__?: Lenis | null;
    showDirectoryPicker?: (options?: DirectoryPickerOptions) => Promise<FileSystemDirectoryHandle>;
  }
}

export {};
