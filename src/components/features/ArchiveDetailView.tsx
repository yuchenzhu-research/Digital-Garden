"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Pencil, X, Trash2 } from 'lucide-react';
import { isUserDocument, type Document } from '@/lib/types';
import { MarkdownView } from '@/components/features/MarkdownView';
import { ImageView } from '@/components/features/ImageView';

interface ArchiveDetailViewProps {
    document: Document;
    onClose: () => void;
    onEdit?: (document: Document) => void;
    onDelete?: (document: Document) => void;
}

export function ArchiveDetailView({ document: data, onClose, onEdit, onDelete }: ArchiveDetailViewProps) {
    const itemLabel = isUserDocument(data) ? 'Personal Entry' : `Item ${data.id.padStart(3, '0')}`;

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
            className="fixed inset-0 z-[100] overflow-y-auto bg-background text-foreground selection:bg-primary/20"
            data-lenis-prevent
        >
            <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-40 bg-gradient-to-b from-black/65 via-black/20 to-transparent" />

            <nav className="pointer-events-none fixed left-0 top-0 z-50 flex w-full items-center justify-between px-6 py-6 md:px-12 md:py-8">
                <button
                    onClick={onClose}
                    className="surface-panel group pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    <span className="font-sans text-xs uppercase tracking-widest">Back to Archive</span>
                </button>
                <div className="hidden font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground/40 md:block">
                    Bibliotheca Vitae / {itemLabel}
                </div>

                <div className="pointer-events-auto flex items-center gap-2">
                    {onEdit && isUserDocument(data) && (
                        <button
                            onClick={() => onEdit(data)}
                            className="surface-panel rounded-full p-2 text-foreground/70 transition-colors hover:text-foreground"
                            title="Edit Entry"
                        >
                            <Pencil className="h-5 w-5" />
                        </button>
                    )}

                    {onDelete && isUserDocument(data) && (
                        <button
                            onClick={() => onDelete(data)}
                            className="surface-panel mr-2 rounded-full p-2 text-destructive/60 transition-colors hover:text-destructive"
                            title="Delete Entry"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="surface-panel rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>
            </nav>

            <header className="relative min-h-[72vh] overflow-hidden border-b border-[var(--line-subtle)] md:min-h-[80vh]">
                <div className="absolute inset-0">
                    <Image
                        src={data.imageUrl}
                        alt={data.title}
                        fill
                        className="object-cover"
                        priority
                        style={{ objectPosition: data.focalPoint || 'center' }}
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_30%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.16)_28%,rgba(0,0,0,0.32)_55%,rgba(9,8,7,0.92)_100%)]" />
                </div>

                <div className="container relative z-10 mx-auto flex min-h-[72vh] items-end px-6 pb-12 pt-32 md:min-h-[80vh] md:px-12 md:pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.2fr)_340px] lg:items-end"
                    >
                        <div className="max-w-4xl">
                            <div className="mb-6 flex flex-wrap items-center gap-4">
                                <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-primary">
                                    {data.category}
                                </span>
                                <span className="font-mono text-xs text-white/60">{data.year}</span>
                            </div>
                            <h1 className="mb-6 font-epic-serif text-5xl font-light leading-[0.92] tracking-[-0.04em] text-white drop-shadow-lg md:text-7xl lg:text-[5.5rem]">
                                {data.title}
                            </h1>
                            <p className="max-w-2xl font-elegant-sans text-lg font-light italic text-white/78 md:text-xl">
                                — {data.description}
                            </p>
                        </div>

                        <aside className="surface-panel rounded-[28px] p-6">
                            <p className="text-kicker mb-3 text-primary">Exhibit Note</p>
                            <div className="space-y-5">
                                <div>
                                    <p className="font-sans text-[10px] uppercase tracking-[0.26em] text-white/50">Figure</p>
                                    <p className="mt-2 font-epic-serif text-2xl text-white">{data.author}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="font-sans text-[10px] uppercase tracking-[0.26em] text-white/50">Year</p>
                                        <p className="mt-2 text-sm text-white/78">{data.year}</p>
                                    </div>
                                    <div>
                                        <p className="font-sans text-[10px] uppercase tracking-[0.26em] text-white/50">Type</p>
                                        <p className="mt-2 text-sm text-white/78">{isUserDocument(data) ? 'Personal accession' : data.type}</p>
                                    </div>
                                </div>
                                <p className="border-t border-white/8 pt-4 text-sm leading-relaxed text-white/64">
                                    Move through this record like a quiet display case: image first, context second, interface last.
                                </p>
                            </div>
                        </aside>
                    </motion.div>
                </div>
            </header>

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
