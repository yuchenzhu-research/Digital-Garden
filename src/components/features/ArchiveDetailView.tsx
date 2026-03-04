"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Trash2 } from 'lucide-react';
import { Document } from '@/lib/types';
import { MarkdownView } from '@/components/features/MarkdownView';
import { ImageView } from '@/components/features/ImageView';

interface ArchiveDetailViewProps {
    document: Document; // Keep interface as is for now or rename it too
    onClose: () => void;
    onDelete?: (id: string) => void;
}

export function ArchiveDetailView({ document: data, onClose, onDelete }: ArchiveDetailViewProps) {
    // Body scroll locking when overlay is active
    useEffect(() => {
        const originalStyle = window.getComputedStyle(window.document.body).overflow;
        window.document.body.style.overflow = 'hidden';

        return () => {
            window.document.body.style.overflow = originalStyle;
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background overflow-y-auto selection:bg-primary/20"
            data-lenis-prevent // Prevent Lenis from hijacking scroll on this element
        >
            {/* Navigation */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 md:py-8 flex justify-between items-center pointer-events-none">
                <button
                    onClick={onClose}
                    className="pointer-events-auto flex items-center gap-2 group text-muted-foreground hover:text-foreground transition-colors bg-background/80 backdrop-blur-md px-4 py-2 rounded-full border border-elegant shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="font-sans text-xs tracking-widest uppercase">Back to Archive</span>
                </button>
                <div className="hidden md:block font-sans text-xs tracking-[0.2em] text-muted-foreground/30 uppercase">
                    Bibliotheca Vitae / Item {data.id.padStart(3, '0')}
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                    {/* Delete Button - Only for user entries (detected via onDelete presence or ID pattern) */}
                    {onDelete && data.id.startsWith('user-') && (
                        <button
                            onClick={() => onDelete(data.id)}
                            className="p-2 text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors mr-2"
                            title="Delete Entry"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={data.imageUrl}
                        alt={data.title}
                        fill
                        className="object-cover"
                        priority
                        style={{ objectPosition: data.focalPoint || 'center' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 w-full px-6 pb-12 md:px-12 md:pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-4xl"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <span className="px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] uppercase tracking-widest text-primary font-medium">
                                {data.category}
                            </span>
                            <span className="font-mono text-xs text-muted-foreground">
                                {data.year}
                            </span>
                        </div>
                        <h1 className="font-epic-serif text-5xl md:text-7xl lg:text-8xl text-white font-light leading-[0.95] mb-6 drop-shadow-lg">
                            {data.title}
                        </h1>
                        <p className="font-elegant-sans text-lg md:text-xl text-white/80 italic font-light max-w-2xl">
                            — {data.description}
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Content Section - Dual Mode */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                {data.type === 'markdown' ? (
                    <MarkdownView document={data} />
                ) : (
                    <ImageView document={data} />
                )}
            </motion.div>
        </motion.div>
    );
}
