"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Document } from '@/lib/types';
import { motion } from 'framer-motion';

interface MarkdownViewProps {
    document: Document;
}

export function MarkdownView({ document }: MarkdownViewProps) {
    return (
        <div className="container mx-auto px-6 py-12 md:px-12 md:py-20 lg:grid lg:grid-cols-12 lg:gap-16">
            <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="sticky top-24 mb-12 h-fit lg:col-span-3 lg:mb-0"
            >
                <div className="surface-panel rounded-[28px] p-6">
                    <h3 className="mb-6 border-l-2 border-primary pl-4 font-sans text-xs uppercase tracking-widest text-muted-foreground">
                        Contents
                    </h3>
                    <nav className="space-y-3 font-elegant-sans text-sm text-muted-foreground/80">
                        <p className="hover:text-foreground cursor-pointer transition-colors block">Introduction</p>
                        <p className="hover:text-foreground cursor-pointer transition-colors block">Analysis</p>
                        <p className="hover:text-foreground cursor-pointer transition-colors block">Conclusion</p>
                    </nav>

                    <div className="mt-12">
                        <h3 className="mb-6 border-l-2 border-primary pl-4 font-sans text-xs uppercase tracking-widest text-muted-foreground">
                            Metadata
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Figure</span>
                                <span className="text-sm font-medium">{document.author}</span>
                            </div>
                            <div>
                                <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Year</span>
                                <span className="text-sm font-medium">{document.year}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.aside>

            <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="lg:col-span-8 lg:col-start-5"
            >
                <div className="surface-card rounded-[32px] p-8 md:p-10">
                    <div className="prose prose-invert prose-lg max-w-none prose-headings:font-epic-serif prose-headings:font-light prose-p:font-elegant-sans prose-p:leading-relaxed prose-p:text-white/78 prose-li:text-white/72 prose-strong:text-foreground prose-blockquote:border-primary/50 prose-blockquote:bg-white/[0.04] prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-2xl">
                        <ReactMarkdown>
                            {document.content || document.longDescription || document.description}
                        </ReactMarkdown>
                    </div>
                </div>
            </motion.article>
        </div>
    );
}
