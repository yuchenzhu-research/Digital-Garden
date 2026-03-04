"use client";

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { Hero } from '@/components/features/Hero';
import { ArchiveGrid } from '@/components/features/ArchiveGrid';
import { HorizontalScrollSection } from '@/components/ui/HorizontalScrollSection';
import { ImageCard } from '@/components/ui/ImageCard';
import { ArchiveDetailView } from '@/components/features/ArchiveDetailView';
import { EntryEditor } from '@/components/features/EntryEditor';
import { DataManagement } from '@/components/ui/DataManagement';
import { FilterBar, type Category } from '@/components/ui/FilterBar';
import { documents } from '@/lib/data';
import type { Document } from '@/lib/types';
import { getEntries, deleteEntry, isRunningInWeb } from '@/services/entryService';
import { SettingsPanel } from '@/components/features/SettingsPanel';
import type { Entry } from '@/services/storage-repository';

// Dynamically import Canvas3D with loading state
const Canvas3D = dynamic(() => import('@/components/visual/Canvas3D'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-30 bg-warm-paper" />,
});

const SmoothScrollWrapper = dynamic(
  () => import('@/components/ui/SmoothScrollWrapper').then(mod => mod.SmoothScrollWrapper),
  { ssr: false }
);

// Convert Entry to Document format for display
const entryToDocument = (entry: Entry, index: number): Document => ({
  id: entry.id || `user-${index}`,
  title: entry.title,
  category: 'Art' as const,
  description: entry.narrative?.substring(0, 100) + '...' || 'Your personal moment',
  imageUrl: entry.imageUrl || '/placeholder.jpg',
  year: new Date(entry.dateCreated).getFullYear().toString(),
  author: entry.figure || 'You',
  focalPoint: '50% 50%',
  academicContext: '',
  tags: entry.keywords,
  longDescription: entry.narrative || '',
  concepts: [],
  resources: [],
  type: 'image' as const,
});

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userEntries, setUserEntries] = useState<Entry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Custom Settings
  const [dimmingIntensity, setDimmingIntensity] = useState(0.3);

  // Load preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bv_dimming_intensity');
      if (saved) {
        setDimmingIntensity(parseFloat(saved));
      }
    }
  }, []);

  // Save preferences
  const handleIntensityChange = (val: number) => {
    setDimmingIntensity(val);
    localStorage.setItem('bv_dimming_intensity', val.toString());
  };

  // Handle entry deletion
  const handleDeleteEntry = async (id: string) => {
    // Strip 'user-' prefix to get real storage ID
    const realId = id.replace(/^user-/, '');
    if (confirm('Are you sure you want to delete this moment? This cannot be undone.')) {
      await deleteEntry(realId);
      await refreshUserEntries();
      setSelectedDocId(null);
    }
  };

  // Load user entries on mount
  useEffect(() => {
    const loadUserEntries = async () => {
      if (isRunningInWeb()) {
        try {
          const entries = await getEntries();
          setUserEntries(entries);
        } catch (error) {
          console.warn('Failed to load user entries:', error);
        }
      }
      setIsLoading(false);
    };
    loadUserEntries();
  }, []);

  // Combine static and user entries
  const allDocuments = useMemo(() => {
    const userDocs = userEntries.map((entry, i) => ({
      ...entryToDocument(entry, i),
      id: `user-${entry.id || i}`,
      isUserEntry: true,
    }));
    return [...documents, ...userDocs];
  }, [userEntries]);

  // Filter documents based on search and category
  const filteredDocuments = useMemo(() => {
    return allDocuments.filter((doc) => {
      // Category filter
      if (category !== 'all' && doc.category !== category) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(query);
        const matchesAuthor = doc.author.toLowerCase().includes(query);
        const matchesDescription = doc.description.toLowerCase().includes(query);
        const matchesTags = doc.tags?.some(tag => tag.toLowerCase().includes(query));

        // For user entries, also check keywords ((doc as any).keywords)
        const docKeywords = (doc as unknown as { keywords?: string[] }).keywords;
        const matchesKeywords = docKeywords?.some(kw => kw.toLowerCase().includes(query));

        if (!matchesTitle && !matchesAuthor && !matchesDescription && !matchesTags && !matchesKeywords) {
          return false;
        }
      }

      return true;
    });
  }, [allDocuments, category, searchQuery]);

  const selectedDoc = allDocuments.find(doc => doc.id === selectedDocId);

  // Sync scroll lock with edit mode as well
  useEffect(() => {
    if (selectedDocId || isEditing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedDocId, isEditing]);

  // Reload entries when editing is closed
  const handleEditorClose = async () => {
    setIsEditing(false);
    if (isRunningInWeb()) {
      const entries = await getEntries();
      setUserEntries(entries);
    }
  };

  // Refresh user entries
  const refreshUserEntries = async () => {
    if (isRunningInWeb()) {
      const entries = await getEntries();
      setUserEntries(entries);
    }
  };

  // Show featured docs (first 3) regardless of filter
  const featuredDocs = documents.slice(0, 3);

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
        <Hero onAppendClick={() => setIsEditing(true)} />

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

        {/* My Moments Section - User Entries (show if any) */}
        {userEntries.length > 0 && (
          <section className="container mx-auto px-4 py-20">
            <div className="mb-12">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-decorative text-muted-foreground/60 block mb-3">
                    Your Personal Collection
                  </span>
                  <h2 className="font-epic-serif text-4xl md:text-5xl text-foreground font-light">
                    My Moments
                  </h2>
                </div>
                <DataManagement onDataChanged={refreshUserEntries} />
              </div>
            </div>

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
          </section>
        )}

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
                onClick={() => {
                  setSearchQuery('');
                  setCategory('all');
                }}
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
                  {doc.id.startsWith('user-') && (
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
                onClick={() => {
                  setSearchQuery('');
                  setCategory('all');
                }}
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
            onDelete={handleDeleteEntry}
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
            <EntryEditor onClose={handleEditorClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}