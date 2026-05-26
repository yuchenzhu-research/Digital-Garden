import type { Entry } from '@/services/storage-repository';
import type { ArchiveCategory, Document } from '@/lib/types';

export const DEFAULT_USER_DOCUMENT_CATEGORY: ArchiveCategory = 'Art';

export const entryToDocument = (entry: Entry, index: number): Document => {
  const hasNarrative = Boolean(entry.narrative?.trim());
  const hasDate = Boolean(entry.dateCreated);

  return {
    id: `user-${entry.id ?? index}`,
    source: 'user',
    storageId: entry.id,
    title: entry.title,
    category: DEFAULT_USER_DOCUMENT_CATEGORY,
    description: hasNarrative
      ? `${entry.narrative.substring(0, 100)}...`
      : 'Your personal moment',
    imageUrl: entry.imageUrl || '/archive-placeholder.svg',
    year: hasDate ? new Date(entry.dateCreated).getFullYear().toString() : 'Unknown',
    author: entry.figure || 'You',
    focalPoint: '50% 50%',
    academicContext: entry.moment || '',
    tags: entry.keywords || [],
    longDescription: entry.narrative || '',
    concepts: [],
    resources: [],
    type: 'image',
  };
};
