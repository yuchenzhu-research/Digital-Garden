"use client";

import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { Hero } from '@/components/features/Hero';
import { HorizontalScrollSection } from '@/components/ui/HorizontalScrollSection';
import { ImageCard } from '@/components/ui/ImageCard';
import { DataManagement } from '@/components/ui/DataManagement';
import { isUserDocument } from '@/lib/types';
import { FilterBar } from '@/components/ui/FilterBar';
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
        <Hero
          onAppendClick={handleCreateEntry}
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

        {/* Horizontal Scroll Section - Featured */}
        <HorizontalScrollSection onScrollProgress={setScrollProgress}>
          {featuredDocs.map((doc) => (
            <div key={doc.id} className="flex-none w-[80vw] md:w-[60vw] lg:w-[45vw] max-w-4xl h-[65vh]">
              <ImageCard
                id={doc.id}
                title={doc.title}
                description={doc.description}
                year={doc.year}
                author={doc.author}
                imageUrl={doc.imageUrl}
                floatingTexts={{
                  topLeft: doc.category,
                  centerLeft: doc.author.split(' ')[0],
                  bottomRight: doc.year,
                }}
                aspectRatio="portrait"
                className="h-full w-full shadow-2xl border-elegant rounded-sm"
                focalPoint={doc.focalPoint}
                onClick={() => setSelectedDocId(doc.id)}
              />
            </div>
          ))}
        </HorizontalScrollSection>

        {/* My Moments Section - User Entries */}
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
              {!isMobileMode && <DataManagement onDataChanged={refreshUserEntries} />}
            </div>
          </div>

          {userEntries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userEntries.map((entry, index) => (
                <motion.div
                  key={entry.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="aspect-[4/5] overflow-hidden rounded-lg cursor-pointer group"
                  onClick={() => setSelectedDocId(`user-${entry.id || index}`)}
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

        {/* Browsable Archive Section - With Search & Filter */}
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

              {/* Search & Filter Bar */}
              <FilterBar
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                categoryValue={category}
                onCategoryChange={setCategory}
              />
            </div>
          </div>

          {/* Filter Status */}
          {(searchQuery || category !== 'all') && (
            <div className="mb-6 flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Showing {filteredDocuments.length} of {allDocuments.length} entries
              </span>
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Archive Grid with Filters */}
          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="aspect-square overflow-hidden rounded-lg cursor-pointer group relative"
                  onClick={() => setSelectedDocId(doc.id)}
                >
                  <ImageCard
                    id={doc.id}
                    title={doc.title}
                    description={doc.description}
                    year={doc.year}
                    author={doc.author}
                    imageUrl={doc.imageUrl}
                    floatingTexts={{ topLeft: doc.category }}
                    aspectRatio="square"
                    size="small"
                    className="h-full w-full border-none"
                    focalPoint={doc.focalPoint}
                    onClick={() => { }}
                  />
                  {isUserDocument(doc) && (
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
                onClick={clearFilters}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-12 border-t border-foreground/5 text-muted-foreground/60">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="font-serif text-xl text-foreground">
                Bibliotheca Vitae
              </span>
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-sans text-sm">
                Since 2026
              </span>
            </div>
            {userEntries.length > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                  {userEntries.length} personal moment{userEntries.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </footer>
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
