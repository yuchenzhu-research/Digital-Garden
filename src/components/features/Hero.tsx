"use client";

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function Hero({ onAppendClick }: { onAppendClick?: () => void }) {
    return (
        <section className="relative min-h-screen flex items-center">
            <div className="container mx-auto px-4 pt-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 relative">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="absolute -top-8 left-0 font-sans text-xs tracking-[0.25em] text-muted-foreground/50 uppercase"
                        >
                            Est. MMXXVI
                        </motion.span>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                        >
                            <span className="inline-block rounded-full border border-foreground/20 px-4 py-1.5 text-xs font-sans font-light uppercase tracking-[0.2em] text-muted-foreground/60 mb-8">
                                Digital Renaissance
                            </span>

                            <h1 className="font-epic-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tighter text-foreground leading-[0.95] mb-8">
                                Bibliotheca
                                <span className="block text-primary/80 mt-2">Vitae</span>
                            </h1>

                            <div className="w-12 h-px bg-foreground/20 mb-8" />

                            <p className="font-elegant-sans text-lg md:text-xl text-muted-foreground/70 leading-relaxed max-w-md mb-10">
                                Curating the intersection of history and technology.
                                A comprehensive digital archive for the modern scholar.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-minimal h-12 px-8"
                                    onClick={onAppendClick}
                                >
                                    Append Moment
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-minimal h-12 px-8 group"
                                    onClick={() => {
                                        window.scrollTo({
                                            top: window.innerHeight,
                                            behavior: 'smooth'
                                        });
                                    }}
                                >
                                    <span>Explore Archive</span>
                                    <ArrowRight className="ml-2 h-4 w-4 opacity-50 group-hover:translate-x-1 transition-all" />
                                </motion.button>
                            </div>
                        </motion.div>

                        <div className="hidden lg:block absolute -left-8 top-1/2 -translate-y-1/2 -translate-x-full">
                            <span className="writing-mode-vertical font-sans text-xs tracking-[0.3em] text-muted-foreground/30 uppercase rotate-180">
                                scroll to explore
                            </span>
                        </div>
                    </div>

                    <div className="lg:col-span-7 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                            className="absolute -top-4 right-8 z-20"
                        >
                            <div className="w-3 h-3 rounded-full bg-primary" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                            className="relative aspect-[16/10] overflow-hidden"
                        >
                            <div className="absolute inset-0">
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-[3s] ease-out"
                                    style={{
                                        backgroundImage: 'url("/archive/newton.jpg")',
                                        backgroundPosition: '50% 10%',
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-foreground/40 via-transparent to-transparent mix-blend-multiply" />
                                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] opacity-20" />
                            </div>

                            <div className="absolute inset-0">
                                <span className="absolute top-6 right-8 font-sans text-xs tracking-[0.2em] text-white/70 uppercase">
                                    1687
                                </span>
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-sans text-xs tracking-[0.25em] text-white/50 writing-mode-vertical">
                                    Isaac Newton
                                </span>
                            </div>

                            <div className="absolute inset-0 border border-white/10" />
                        </motion.div>

                        <div className="absolute bottom-0 left-0 w-32 h-px bg-foreground/20" />
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="absolute bottom-8 left-4 right-4 flex items-center justify-between"
                >
                    <span className="hidden md:block font-sans text-xs tracking-widest text-muted-foreground/40 uppercase">
                        Past · Present · Future
                    </span>
                    <span className="font-sans text-xs tracking-[0.3em] text-muted-foreground/30 uppercase">
                        bibliotheca-vitae
                    </span>
                    <span className="hidden md:block font-sans text-xs tracking-widest text-muted-foreground/40 uppercase">
                        Volume I
                    </span>
                </motion.div>
            </div>
        </section>
    );
}
