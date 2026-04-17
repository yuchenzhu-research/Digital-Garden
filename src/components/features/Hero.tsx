"use client";

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
    onAppendClick?: () => void;
    appendLabel?: string;
    mobileNote?: string;
}

export function Hero({
    onAppendClick,
    appendLabel = 'Append Moment',
    mobileNote,
}: HeroProps) {
    return (
        <section className="relative flex min-h-screen items-center overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-[12%] top-[16%] h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-[14%] right-[10%] h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            </div>

            <div className="container relative mx-auto px-4 pb-12 pt-28 md:pt-32">
                <div className="mb-10 flex items-center justify-between gap-6">
                    <span className="text-kicker">
                        Night Museum Interface
                    </span>
                    <span className="hidden md:block font-sans text-[10px] uppercase tracking-[0.32em] text-muted-foreground/60">
                        Local-first archival environment
                    </span>
                </div>

                <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
                    <div className="relative lg:col-span-5">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="text-kicker mb-6 inline-flex items-center gap-3"
                        >
                            <span className="h-px w-10 bg-primary/50" />
                            Est. MMXXVI
                        </motion.span>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                        >
                            <span className="mb-8 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-sans font-light uppercase tracking-[0.26em] text-primary">
                                Private Archive
                            </span>

                            <h1 className="mb-8 font-epic-serif text-5xl font-light leading-[0.93] tracking-[-0.04em] text-foreground md:text-6xl lg:text-7xl xl:text-[5.5rem]">
                                Bibliotheca
                                <span className="mt-2 block text-primary">Vitae</span>
                            </h1>

                            <div className="mb-8 h-px w-20 bg-primary/30" />

                            <p className="mb-10 max-w-xl font-elegant-sans text-lg leading-relaxed text-reading-soft md:text-xl">
                                A dark, image-led archive for preserving moments, collections, and notes with the calm of an after-hours exhibition room.
                            </p>

                            <div className="mb-8 grid gap-3 sm:grid-cols-3">
                                {[
                                    ['On-device', 'Your archive stays anchored to your machine.'],
                                    ['Curated', 'Collections over feeds, exhibits over dashboards.'],
                                    ['Luminous', 'Images stay central, UI recedes into glass and shadow.'],
                                ].map(([label, copy]) => (
                                    <div key={label} className="surface-panel rounded-[24px] px-4 py-4">
                                        <p className="text-kicker mb-2 text-primary">{label}</p>
                                        <p className="text-sm leading-relaxed text-reading-soft">{copy}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-minimal h-12 px-8"
                                    onClick={onAppendClick}
                                >
                                    {appendLabel}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-minimal group h-12 px-8"
                                    onClick={() => {
                                        window.scrollTo({
                                            top: window.innerHeight,
                                            behavior: 'smooth',
                                        });
                                    }}
                                >
                                    <span>Explore Archive</span>
                                    <ArrowRight className="ml-2 h-4 w-4 opacity-60 transition-all group-hover:translate-x-1" />
                                </motion.button>
                            </div>

                            {mobileNote && (
                                <p className="mt-4 max-w-md font-sans text-xs uppercase tracking-[0.24em] text-muted-foreground/60">
                                    {mobileNote}
                                </p>
                            )}
                        </motion.div>

                        <div className="absolute -left-8 top-1/2 hidden -translate-x-full -translate-y-1/2 lg:block">
                            <span className="writing-mode-vertical font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground/30 rotate-180">
                                scroll to explore
                            </span>
                        </div>
                    </div>

                    <div className="relative lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                            className="absolute -right-2 top-6 z-20 md:right-8"
                        >
                            <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_28px_rgba(219,184,102,0.5)]" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                            className="surface-card relative aspect-[16/11] overflow-hidden rounded-[36px] p-3 md:p-4"
                        >
                            <div className="absolute inset-3 overflow-hidden rounded-[28px] md:inset-4 md:rounded-[30px]">
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-[3s] ease-out"
                                    style={{
                                        backgroundImage: 'url("/archive/newton.jpg")',
                                        backgroundPosition: '50% 10%',
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.18)_60%,rgba(0,0,0,0.55)_100%)]" />
                            </div>

                            <div className="absolute inset-0">
                                <div className="absolute left-8 top-8 rounded-full border border-white/10 bg-black/25 px-4 py-2 backdrop-blur-md">
                                    <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-white/72">
                                        Featured Exhibit
                                    </span>
                                </div>
                                <span className="absolute right-8 top-8 font-sans text-[10px] uppercase tracking-[0.24em] text-white/64">
                                    1687
                                </span>
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-sans text-[10px] tracking-[0.25em] text-white/45 writing-mode-vertical">
                                    Isaac Newton
                                </span>
                            </div>

                            <div className="surface-panel absolute bottom-8 left-8 right-8 rounded-[28px] px-6 py-5 md:max-w-md">
                                <p className="text-kicker mb-2 text-primary">Cabinet I</p>
                                <h2 className="font-epic-serif text-3xl leading-none text-white md:text-[2.6rem]">
                                    Principia
                                </h2>
                                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/72">
                                    A luminous exhibit card framing the archive as stewardship, not content churn.
                                </p>
                            </div>
                        </motion.div>

                        <div className="absolute bottom-0 left-0 h-px w-32 bg-primary/30" />
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-12 flex items-center justify-between border-t border-[var(--line-subtle)] pt-6"
                >
                    <span className="hidden font-sans text-xs uppercase tracking-widest text-muted-foreground/40 md:block">
                        After-hours archive atmosphere
                    </span>
                    <span className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground/40">
                        bibliotheca-vitae
                    </span>
                    <span className="hidden font-sans text-xs uppercase tracking-widest text-muted-foreground/40 md:block">
                        Volume I
                    </span>
                </motion.div>
            </div>
        </section>
    );
}
