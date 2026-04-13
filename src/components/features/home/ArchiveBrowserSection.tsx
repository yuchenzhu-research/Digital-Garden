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
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-decorative text-muted-foreground/60 block mb-3">
              Complete Collection
            </span>
            <h2 className="font-epic-serif text-4xl md:text-5xl text-foreground font-light">
              Browse Archive
            </h2>
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
        <div className="mb-6 flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Showing {documents.length} of {allDocumentsCount} entries
          </span>
          <button
            onClick={onClearFilters}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
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
              className="aspect-square overflow-hidden rounded-lg cursor-pointer group relative"
              onClick={() => onDocumentSelect(document.id)}
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
                className="h-full w-full border-none"
                focalPoint={document.focalPoint}
                onClick={() => {}}
              />
              {isUserDocument(document) && (
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/80 backdrop-blur-sm rounded text-[10px] uppercase tracking-wider text-foreground z-10">
                  Personal
                </span>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-4">No entries match your search.</p>
          <button
            onClick={onClearFilters}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
