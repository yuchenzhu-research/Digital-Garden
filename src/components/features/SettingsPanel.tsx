"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Sun, Moon, X, FolderOpen } from 'lucide-react';
import { isTauri } from '@/utils/env';
import { getWebFS } from '@/services/entryService';

interface SettingsPanelProps {
    dimmingIntensity: number;
    onIntensityChange: (val: number) => void;
}

export function SettingsPanel({ dimmingIntensity, onIntensityChange }: SettingsPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [fsConnected, setFsConnected] = useState<boolean>(
        !isTauri() && getWebFS().isReady()
    );

    const handleConnectFS = async () => {
        try {
            const success = await getWebFS().requestDirectoryAccess();
            if (success) {
                setFsConnected(true);
                // Force a page reload so all data fetching immediately switches to the new adapter
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-foreground/60 hover:text-foreground transition-all border border-foreground/10 shadow-lg hover:scale-110 active:scale-95 group"
                title="Settings"
            >
                <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: -20, y: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: -20, y: 20 }}
                        className="fixed bottom-20 left-6 z-50 w-72 bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-serif text-lg text-foreground tracking-tight">Focus Control</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded-full hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-sans">
                                <span>Focus Intensity</span>
                                <span className="font-mono">{Math.round(dimmingIntensity * 100)}%</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Sun className="w-3 h-3 text-muted-foreground/60" />
                                <div className="relative flex-1 h-6 flex items-center">
                                    <input
                                        type="range"
                                        min="0"
                                        max="0.9"
                                        step="0.05"
                                        value={dimmingIntensity}
                                        onChange={(e) => onIntensityChange(parseFloat(e.target.value))}
                                        className="w-full h-1 bg-foreground/10 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                                    />
                                </div>
                                <Moon className="w-3 h-3 text-muted-foreground/60" />
                            </div>
                            <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                                Adjust the background opacity to reduce visual noise and focus on the collection.
                            </p>
                        </div>

                        {!isTauri() && (
                            <>
                                <hr className="my-6 border-foreground/10" />
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-sans">
                                        <span>Storage Mode</span>
                                        <span className={`font-mono ${fsConnected ? 'text-green-500' : ''}`}>
                                            {fsConnected ? 'Folder Mode' : 'Browser Local'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleConnectFS}
                                        disabled={fsConnected}
                                        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-foreground/5 hover:bg-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-sans"
                                    >
                                        <FolderOpen className="w-4 h-4" />
                                        {fsConnected ? 'Folder Connected' : 'Connect Folder Mode'}
                                    </button>
                                    <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                                        Folder Mode is recommended. It writes your archive as native `.json` files in a local directory you control.
                                    </p>
                                    <p className="text-[10px] text-muted-foreground/50 leading-relaxed">
                                        If folder access is unavailable, Bibliotheca Vitae falls back to browser-local storage as a compatibility mode.
                                    </p>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
