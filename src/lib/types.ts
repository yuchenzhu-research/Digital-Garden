export interface Document {
    id: string;
    title: string;
    category: "Philosophy" | "History" | "Art" | "Technology";
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
