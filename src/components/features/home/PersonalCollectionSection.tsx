"use client";

import { motion } from 'framer-motion';
import { DataManagement } from '@/components/ui/DataManagement';
import type { Entry } from '@/services/storage-repository';

interface PersonalCollectionSectionProps {
  entries: Entry[];
  hasLocalMobileDraft: boolean;
  isMobileMode: boolean;
  onDataChanged: () => Promise<void>;
  onEntrySelect: (documentId: string) => void;
}

export function PersonalCollectionSection({
  entries,
  hasLocalMobileDraft,
  isMobileMode,
  onDataChanged,
  onEntrySelect,
}: PersonalCollectionSectionProps) {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mb-12">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="text-decorative text-muted-foreground/60 block mb-3">
              Your Personal Collection
            </span>
            <h2 className="font-epic-serif text-4xl md:text-5xl text-foreground font-light">
              My Moments
            </h2>
          </div>
          {!isMobileMode && <DataManagement onDataChanged={onDataChanged} />}
        </div>
      </div>

      {entries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="aspect-[4/5] overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => onEntrySelect(`user-${entry.id || index}`)}
            >
              {entry.imageUrl ? (
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${entry.imageUrl})` }}
                />
              ) : (
                <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded text-[10px] uppercase tracking-wider text-white">
                    Personal
                  </span>
                  <span className="text-white/60 text-xs">
                    {new Date(entry.dateCreated).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-epic-serif text-2xl text-white mb-1">
                  {entry.title || 'Untitled'}
                </h3>
                <p className="font-sans text-sm text-white/70 line-clamp-2">
                  {entry.narrative?.substring(0, 100)}...
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-foreground/10 bg-card/40 px-6 py-10 text-center">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {isMobileMode && hasLocalMobileDraft ? 'Local draft ready' : 'No personal entries yet'}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            {isMobileMode
              ? (hasLocalMobileDraft
                ? 'Use the hero button to reopen the local draft stored on this device. Publish to the archive from desktop when it is ready.'
                : 'Open a local draft to start writing on this device. Formal archive publishing is available on desktop.')
              : 'Create a new moment or import an archive backup to begin building your collection.'}
          </p>
        </div>
      )}
    </section>
  );
}
