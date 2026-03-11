export const ARCHIVE_CATEGORIES = [
    "Philosophy",
    "History",
    "Art",
    "Technology",
] as const;

export type ArchiveCategory = typeof ARCHIVE_CATEGORIES[number];
export type DocumentSource = 'curated' | 'user';

export interface Document {
    id: string;
    source?: DocumentSource;
    storageId?: string;
    title: string;
    category: ArchiveCategory;
    description: string;
    imageUrl: string;
    year: string;
    author: string;
    focalY?: number;
    imageScale?: number;
    focalPoint?: string; // e.g., "50% 20%" for centering faces
    academicContext?: string;
    tags?: string[];
    longDescription?: string;
    concepts?: {
        title: string;
        description: string;
    }[];
    resources?: {
        title: string;
        type: string;
        url?: string;
    }[];
    type?: 'image' | 'markdown';
    content?: string;
}

export const isUserDocument = (document: Pick<Document, 'source'>): boolean =>
    document.source === 'user';
