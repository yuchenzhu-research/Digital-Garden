"use client";

import { motion } from 'framer-motion';
import { FilterBar, type Category } from '@/components/ui/FilterBar';
import { ImageCard } from '@/components/ui/ImageCard';
import { isUserDocument, type Document } from '@/lib/types';

interface ArchiveBrowserSectionProps {
  allDocumentsCount: number;
  category: Category;
  documents: Document[];
  onCategoryChange: (value: Category) => void;
  onClearFilters: () => void;
  onDocumentSelect: (documentId: string) => void;
  onSearchChange: (value: string) => void;
  searchQuery: string;
}

export function ArchiveBrowserSection({
  allDocumentsCount,
  category,
  documents,
  onCategoryChange,
  onClearFilters,
  onDocumentSelect,
  onSearchChange,
  searchQuery,
}: ArchiveBrowserSectionProps) {
  const hasFilters = searchQuery.length > 0 || category !== 'all';

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mb-12 border-t border-[var(--line-subtle)] pt-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-decorative text-primary/80 block mb-3">
              Complete Collection
            </span>
            <h2 className="font-epic-serif text-4xl md:text-5xl text-foreground font-light">
              Browse Archive
            </h2>
            <p className="mt-4 max-w-2xl text-reading-soft">
              Move through the wider archive as if browsing adjacent cabinets and exhibition drawers.
            </p>
          </div>

          <FilterBar
            searchValue={searchQuery}
            onSearchChange={onSearchChange}
            categoryValue={category}
            onCategoryChange={onCategoryChange}
          />
        </div>
      </div>

      {hasFilters && (
        <div className="surface-panel mb-6 flex items-center justify-between gap-4 rounded-[24px] px-5 py-4">
          <span className="text-sm text-muted-foreground">
            Showing {documents.length} of {allDocumentsCount} entries
          </span>
          <button
            onClick={onClearFilters}
            className="text-sm text-primary transition-colors hover:text-primary/80"
          >
            Clear filters
          </button>
        </div>
      )}

      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <ImageCard
                id={document.id}
                title={document.title}
                description={document.description}
                year={document.year}
                author={document.author}
                imageUrl={document.imageUrl}
                floatingTexts={{ topLeft: document.category }}
                aspectRatio="square"
                size="small"
                className="h-full w-full"
                focalPoint={document.focalPoint}
                onClick={() => onDocumentSelect(document.id)}
              />
              {isUserDocument(document) && (
                <span className="absolute left-4 top-4 z-20 rounded-full border border-white/10 bg-black/[0.25] px-3 py-2 text-[10px] uppercase tracking-[0.26em] text-white/82 backdrop-blur-md">
                  Personal
                </span>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="surface-card rounded-[32px] py-20 text-center">
          <p className="mb-4 text-muted-foreground">No entries match your search.</p>
          <button
            onClick={onClearFilters}
            className="text-primary transition-colors hover:text-primary/80"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
