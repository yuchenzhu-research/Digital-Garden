"use client";

import { HorizontalScrollSection } from '@/components/ui/HorizontalScrollSection';
import { ImageCard } from '@/components/ui/ImageCard';
import type { Document } from '@/lib/types';

interface FeaturedArchiveSectionProps {
  documents: Document[];
  onDocumentSelect: (documentId: string) => void;
  onScrollProgressChange: (value: number) => void;
}

export function FeaturedArchiveSection({
  documents,
  onDocumentSelect,
  onScrollProgressChange,
}: FeaturedArchiveSectionProps) {
  return (
    <HorizontalScrollSection onScrollProgress={onScrollProgressChange}>
      {documents.map((document) => (
        <div
          key={document.id}
          className="flex-none w-[80vw] md:w-[60vw] lg:w-[45vw] max-w-4xl h-[65vh]"
        >
          <ImageCard
            id={document.id}
            title={document.title}
            description={document.description}
            year={document.year}
            author={document.author}
            imageUrl={document.imageUrl}
            floatingTexts={{
              topLeft: document.category,
              centerLeft: document.author.split(' ')[0],
              bottomRight: document.year,
            }}
            aspectRatio="portrait"
            className="h-full w-full shadow-2xl border-elegant rounded-sm"
            focalPoint={document.focalPoint}
            onClick={() => onDocumentSelect(document.id)}
          />
        </div>
      ))}
    </HorizontalScrollSection>
  );
}
