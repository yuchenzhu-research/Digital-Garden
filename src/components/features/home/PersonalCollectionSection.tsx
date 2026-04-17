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
      <div className="mb-12 border-t border-[var(--line-subtle)] pt-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="text-decorative mb-3 block text-primary/80">
              Your Personal Collection
            </span>
            <h2 className="font-epic-serif text-4xl md:text-5xl text-foreground font-light">
              My Moments
            </h2>
            <p className="mt-4 max-w-2xl text-reading-soft">
              A quieter shelf for your own accessions, drafts, and archived moments.
            </p>
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
              className="surface-card relative aspect-[4/5] cursor-pointer overflow-hidden rounded-[28px] group"
              onClick={() => onEntrySelect(`user-${entry.id || index}`)}
            >
              {entry.imageUrl ? (
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${entry.imageUrl})` }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(219,184,102,0.12),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.01)_100%)]">
                  <span className="font-sans text-xs uppercase tracking-[0.28em] text-muted-foreground">No image yet</span>
                </div>
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.06)_24%,rgba(0,0,0,0.38)_60%,rgba(0,0,0,0.88)_100%)]" />
              <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/[0.25] px-3 py-2 backdrop-blur-md">
                <span className="text-[10px] uppercase tracking-[0.26em] text-white/78">
                  Personal
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="surface-panel rounded-[24px] p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-primary/[0.12] px-2 py-1 text-[10px] uppercase tracking-wider text-primary">
                      Personal
                    </span>
                    <span className="text-xs text-white/55">
                      {new Date(entry.dateCreated).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <h3 className="mb-2 font-epic-serif text-2xl text-white">
                    {entry.title || 'Untitled'}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-white/70 line-clamp-3">
                    {entry.narrative?.trim()
                      ? entry.narrative.substring(0, 120)
                      : 'A personal accession waiting for its narrative plaque.'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="surface-card rounded-[32px] px-6 py-10 text-center">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {isMobileMode && hasLocalMobileDraft ? 'Local draft ready' : 'No personal entries yet'}
          </p>
          <p className="mt-3 text-sm text-reading-soft">
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
