/**
 * Archive Statistics Service
 * Aggregates stats across curated documents and user entries.
 */

import { documents } from '@/lib/data';
import type { ArchiveCategory, Document } from '@/lib/types';
import { getEntries } from '@/services/entryService';
import { entryToDocument } from '@/lib/document-mappers';

export interface ArchiveStats {
  totalDocuments: number;
  curatedCount: number;
  userEntryCount: number;
  categories: Record<ArchiveCategory, number>;
  lastUpdated: string | null;
}

/**
 * Compute archive statistics from curated + user documents.
 */
export async function getArchiveStats(): Promise<ArchiveStats> {
  let userEntries: Awaited<ReturnType<typeof getEntries>> = [];

  try {
    userEntries = await getEntries();
  } catch (error) {
    console.warn('[archive-stats] Failed to load user entries:', error);
  }

  const userDocuments = userEntries.map((entry, index) => entryToDocument(entry, index));
  const allDocuments: Document[] = [...documents, ...userDocuments];

  const categories = {} as Record<ArchiveCategory, number>;
  for (const doc of allDocuments) {
    categories[doc.category] = (categories[doc.category] ?? 0) + 1;
  }

  let lastUpdated: string | null = null;
  if (userEntries.length > 0) {
    const dates = userEntries
      .map((e) => e.dateCreated)
      .filter(Boolean)
      .sort()
      .reverse();
    lastUpdated = dates[0] ?? null;
  }

  return {
    totalDocuments: allDocuments.length,
    curatedCount: documents.length,
    userEntryCount: userEntries.length,
    categories,
    lastUpdated,
  };
}
