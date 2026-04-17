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
        <div className="container mx-auto px-6 py-12 md:px-12 md:py-20 lg:grid lg:grid-cols-12 lg:gap-16">
            <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="mb-16 space-y-8 lg:col-span-4 lg:mb-0"
            >
                <div className="surface-panel rounded-[28px] p-6">
                    <h3 className="mb-4 border-l-2 border-primary pl-4 font-sans text-xs uppercase tracking-widest text-muted-foreground">
                        Figure
                    </h3>
                    <p className="font-epic-serif text-2xl text-foreground">
                        {document.author}
                    </p>
                </div>

                <div className="surface-panel rounded-[28px] p-6">
                    <h3 className="mb-4 border-l-2 border-primary pl-4 font-sans text-xs uppercase tracking-widest text-muted-foreground">
                        Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {document.tags?.map((tag) => (
                            <span key={tag} className="rounded-full border border-white/8 bg-white/[0.06] px-3 py-1 text-xs font-sans text-secondary-foreground">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {document.resources && (
                    <div className="surface-panel rounded-[28px] p-6">
                        <h3 className="mb-4 border-l-2 border-primary pl-4 font-sans text-xs uppercase tracking-widest text-muted-foreground">
                            Archive Resources
                        </h3>
                        <ul className="space-y-4">
                            {document.resources.map((resource, idx) => {
                                const Content = (
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                                                {resource.title}
                                            </p>
                                            <span className="mt-1 block text-xs text-muted-foreground">
                                                {resource.type}
                                            </span>
                                        </div>
                                        <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                    </div>
                                );

                                return (
                                    <li key={idx} className="group cursor-pointer rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4">
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
                className="space-y-10 lg:col-span-8"
            >
                <section className="surface-card rounded-[32px] p-8 md:p-10">
                    <h2 className="mb-8 flex items-center gap-3 font-epic-serif text-3xl text-foreground md:text-4xl">
                        <Clock className="h-6 w-6 text-primary/60" />
                        Moment in Time
                    </h2>
                    <div className="prose prose-lg prose-invert font-elegant-sans font-light leading-relaxed text-reading-soft">
                        <p>{document.academicContext}</p>
                    </div>
                </section>

                <section className="surface-card rounded-[32px] p-8 md:p-10">
                    <h2 className="mb-8 flex items-center gap-3 font-epic-serif text-3xl text-foreground md:text-4xl">
                        <BookOpen className="h-6 w-6 text-primary/60" />
                        The Narrative
                    </h2>
                    <div className="prose prose-lg prose-invert space-y-6 font-elegant-sans font-light leading-relaxed text-reading-soft">
                        <p>{document.longDescription || document.description}</p>

                        {document.concepts && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 not-prose">
                                {document.concepts.map((concept, idx) => (
                                    <div key={idx} className="rounded-[24px] border border-white/8 bg-white/[0.04] p-6">
                                        <h4 className="font-epic-serif text-xl text-foreground mb-3">
                                            {concept.title}
                                        </h4>
                                        <p className="text-sm leading-relaxed text-muted-foreground">
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
