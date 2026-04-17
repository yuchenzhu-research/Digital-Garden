"use client";

import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { MuseumHero } from '@/components/features/home/MuseumHero';
import { FeaturedArchive } from '@/components/features/home/FeaturedArchive';
import { CuratedShelf } from '@/components/features/home/CuratedShelf';
import { ArchiveBrowser } from '@/components/features/home/ArchiveBrowser';
import { ArchivalFooter } from '@/components/features/home/ArchivalFooter';
import { ExhibitDetail } from '@/components/features/home/ExhibitDetail';
import { SettingsPanel } from '@/components/features/SettingsPanel';
import { useHomePageController } from '@/hooks/useHomePageController';

// Dynamically import Canvas3D with loading state
const Canvas3D = dynamic(() => import('@/components/visual/Canvas3D'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-30 bg-warm-paper" />,
});

const SmoothScrollWrapper = dynamic(
  () => import('@/components/ui/SmoothScrollWrapper').then(mod => mod.SmoothScrollWrapper),
  { ssr: false }
);

const ArchiveDetailView = dynamic(
  () => import('@/components/features/ArchiveDetailView').then(mod => mod.ArchiveDetailView),
  { ssr: false }
);

const EntryEditor = dynamic(
  () => import('@/components/features/EntryEditor').then(mod => mod.EntryEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center text-sm uppercase tracking-[0.3em] text-muted-foreground">
        Loading editor...
      </div>
    ),
  }
);

export default function Home() {
  const {
    allDocuments,
    category,
    clearFilters,
    dimmingIntensity,
    editorEntry,
    featuredDocs,
    filteredDocuments,
    handleCreateEntry,
    handleDeleteEntry,
    handleEditEntry,
    handleEditorClose,
    handleIntensityChange,
    hasLocalMobileDraft,
    heroAppendLabel,
    heroMobileNote,
    isEditing,
    isEditMode,
    isLoading,
    isMobileMode,
    refreshMobileDraftState,
    refreshUserEntries,
    scrollProgress,
    searchQuery,
    selectedDoc,
    setCategory,
    setScrollProgress,
    setSearchQuery,
    setSelectedDocId,
    userEntries,
  } = useHomePageController();

  return (
    <main className="relative min-h-screen">
      <SmoothScrollWrapper>
        <Canvas3D
          imageUrl="/archive/newton.jpg"
          scrollProgress={scrollProgress}
        />

        {/* Dynamic Dimming Overlay - Controlled by User Settings */}
        <div
          className="fixed inset-0 pointer-events-none bg-background transition-opacity duration-100 ease-linear"
          style={{ opacity: scrollProgress * dimmingIntensity, zIndex: -1 }}
        />

        {/* Global Settings Panel */}
        <SettingsPanel
          dimmingIntensity={dimmingIntensity}
          onIntensityChange={handleIntensityChange}
        />

        {/* Hero Section */}
        <MuseumHero
          onAppend={handleCreateEntry}
          appendLabel={heroAppendLabel}
          mobileNote={heroMobileNote}
        />

        {isLoading && (
          <section className="container mx-auto px-4 pt-8">
            <div className="rounded-lg border border-foreground/10 bg-card/40 px-4 py-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Loading your local archive...
            </div>
          </section>
        )}

        <FeaturedArchive
          documents={featuredDocs}
          onDocumentClick={(doc) => setSelectedDocId(doc.id)}
        />

        <CuratedShelf
          documents={userEntries.map((e, i) => ({ ...documents[0], ...e, id: e.id || `user-${i}` } as any))}
          onDocumentClick={(doc) => setSelectedDocId(doc.id)}
        />

        <ArchiveBrowser
          documents={filteredDocuments}
          onDocumentClick={(doc) => setSelectedDocId(doc.id)}
        />

        <ArchivalFooter />
      </SmoothScrollWrapper>

      {/* Archive Detail View Overlay */}
      <AnimatePresence>
        {selectedDoc && (
          <ArchiveDetailView
            document={selectedDoc}
            onClose={() => setSelectedDocId(null)}
            onEdit={isMobileMode ? undefined : handleEditEntry}
            onDelete={isMobileMode ? undefined : handleDeleteEntry}
          />
        )}
      </AnimatePresence>

      {/* Entry Editor Overlay */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background overflow-y-auto"
            data-lenis-prevent
          >
            <EntryEditor
              mode={isEditMode ? 'edit' : 'create'}
              initialEntry={editorEntry ?? undefined}
              onClose={handleEditorClose}
              mobileDraftMode={isMobileMode && !isEditMode}
              onDraftStateChange={refreshMobileDraftState}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
