"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, Clock } from 'lucide-react';
import { Document } from '@/lib/types';

interface ImageViewProps {
    document: Document;
}

export function ImageView({ document }: ImageViewProps) {
    return (
        <div className="container mx-auto px-6 py-12 md:px-12 md:py-20 lg:grid lg:grid-cols-12 lg:gap-20">
            {/* Sidebar / Metadata */}
            <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="lg:col-span-4 space-y-12 mb-16 lg:mb-0"
            >
                <div>
                    <h3 className="font-sans text-xs tracking-widest text-muted-foreground uppercase mb-4 border-l-2 border-primary pl-4">
                        Figure
                    </h3>
                    <p className="font-epic-serif text-2xl text-foreground">
                        {document.author}
                    </p>
                </div>

                <div>
                    <h3 className="font-sans text-xs tracking-widest text-muted-foreground uppercase mb-4 border-l-2 border-primary pl-4">
                        Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {document.tags?.map((tag) => (
                            <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-sans rounded-sm">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {document.resources && (
                    <div>
                        <h3 className="font-sans text-xs tracking-widest text-muted-foreground uppercase mb-4 border-l-2 border-primary pl-4">
                            Archive Resources
                        </h3>
                        <ul className="space-y-4">
                            {document.resources.map((resource, idx) => {
                                const Content = (
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                                {resource.title}
                                            </p>
                                            <span className="text-xs text-muted-foreground block mt-1">
                                                {resource.type}
                                            </span>
                                        </div>
                                        <ArrowUpRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                );

                                return (
                                    <li key={idx} className="group cursor-pointer">
                                        {resource.url ? (
                                            <a
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block"
                                            >
                                                {Content}
                                            </a>
                                        ) : (
                                            Content
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </motion.aside>

            {/* Main Body */}
            <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="lg:col-span-8 space-y-16"
            >
                {/* Academic Context */}
                <section>
                    <h2 className="flex items-center gap-3 font-epic-serif text-3xl md:text-4xl text-foreground mb-8">
                        <Clock className="w-6 h-6 text-primary/60" />
                        Moment in Time
                    </h2>
                    <div className="prose prose-lg prose-invert text-muted-foreground font-elegant-sans font-light leading-relaxed">
                        <p>{document.academicContext}</p>
                    </div>
                </section>

                {/* Detailed Analysis (Using longDescription if available, otherwise fallback) */}
                <section>
                    <h2 className="flex items-center gap-3 font-epic-serif text-3xl md:text-4xl text-foreground mb-8">
                        <BookOpen className="w-6 h-6 text-primary/60" />
                        The Narrative
                    </h2>
                    <div className="prose prose-lg prose-invert text-muted-foreground font-elegant-sans font-light leading-relaxed space-y-6">
                        <p>{document.longDescription || document.description}</p>

                        {/* Concepts Expansion */}
                        {document.concepts && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 not-prose">
                                {document.concepts.map((concept, idx) => (
                                    <div key={idx} className="bg-foreground/5 p-6 rounded-sm border border-foreground/10">
                                        <h4 className="font-epic-serif text-xl text-foreground mb-3">
                                            {concept.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {concept.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </motion.article>
        </div>
    );
}
