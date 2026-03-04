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
            {/* Sidebar / TOC */}
            <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="lg:col-span-3 mb-12 lg:mb-0 sticky top-24 h-fit"
            >
                <div>
                    <h3 className="font-sans text-xs tracking-widest text-muted-foreground uppercase mb-6 border-l-2 border-primary pl-4">
                        Contents
                    </h3>
                    <nav className="space-y-3 font-elegant-sans text-sm text-muted-foreground/80">
                        {/* Simple TOC placeholder - could be dynamically generated from markdown content in future */}
                        <p className="hover:text-foreground cursor-pointer transition-colors block">Introduction</p>
                        <p className="hover:text-foreground cursor-pointer transition-colors block">Analysis</p>
                        <p className="hover:text-foreground cursor-pointer transition-colors block">Conclusion</p>
                    </nav>
                </div>

                <div className="mt-12">
                    <h3 className="font-sans text-xs tracking-widest text-muted-foreground uppercase mb-6 border-l-2 border-primary pl-4">
                        Metadata
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <span className="text-xs text-muted-foreground block uppercase tracking-wider mb-1">Figure</span>
                            <span className="text-sm font-medium">{document.author}</span>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground block uppercase tracking-wider mb-1">Year</span>
                            <span className="text-sm font-medium">{document.year}</span>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="lg:col-span-8 lg:col-start-5"
            >
                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-epic-serif prose-headings:font-light prose-p:font-elegant-sans prose-p:leading-relaxed prose-blockquote:border-primary/50 prose-blockquote:bg-foreground/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-sm">
                    <ReactMarkdown>
                        {document.content || document.longDescription || document.description}
                    </ReactMarkdown>
                </div>
            </motion.article>
        </div>
    );
}
