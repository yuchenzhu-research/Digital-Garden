"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Sun, Moon, X, FolderOpen } from 'lucide-react';
import { useSettingsPanelController } from '@/hooks/useSettingsPanelController';

interface SettingsPanelProps {
    dimmingIntensity: number;
    onIntensityChange: (val: number) => void;
}

export function SettingsPanel({ dimmingIntensity, onIntensityChange }: SettingsPanelProps) {
    const {
        connectFolderMode,
        fsConnected,
        isConnectingFolderMode,
        isOpen,
        openPanel,
        setIsOpen,
        showFolderModeControls,
        showMobileDraftNotice,
        storageModeLabel,
    } = useSettingsPanelController();

    return (
        <>
            <button
                onClick={openPanel}
                className="surface-panel fixed bottom-6 left-6 z-50 rounded-full p-3 text-foreground/60 transition-all hover:scale-110 hover:text-foreground active:scale-95 group"
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
                        className="surface-panel fixed bottom-20 left-6 z-50 w-72 rounded-[28px] p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-serif text-lg text-foreground tracking-tight">Focus Control</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
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
                                        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary/20 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                                    />
                                </div>
                                <Moon className="w-3 h-3 text-muted-foreground/60" />
                            </div>
                            <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                                Adjust the background opacity to reduce visual noise and focus on the collection.
                            </p>
                        </div>

                        {showFolderModeControls && (
                            <>
                                <hr className="my-6 border-white/8" />
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-sans">
                                        <span>Storage Mode</span>
                                        <span className={`font-mono ${fsConnected ? 'text-green-500' : ''}`}>
                                            {storageModeLabel}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => void connectFolderMode()}
                                        disabled={fsConnected || isConnectingFolderMode}
                                        className="w-full rounded-[20px] border border-white/8 bg-white/[0.04] px-4 py-2 text-sm font-sans transition-colors hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <FolderOpen className="w-4 h-4" />
                                        {fsConnected
                                            ? 'Folder Connected'
                                            : (isConnectingFolderMode ? 'Connecting Folder…' : 'Connect Folder Mode')}
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

                        {showMobileDraftNotice && (
                            <>
                                <hr className="my-6 border-white/8" />
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-sans">
                                        <span>Capture Mode</span>
                                        <span className="font-mono text-primary/80">
                                            Local Drafts
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                                        Mobile browsers stay in Local Draft Mode. You can browse the archive and keep drafts on this device, but formal archive publishing is reserved for desktop.
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
