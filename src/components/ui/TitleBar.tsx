"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Minus, X, Maximize2 } from 'lucide-react';

interface TitleBarProps {
  title?: string;
}

import { useDesktopWindow } from '@/hooks/useDesktopWindow';

export function TitleBar({ title = "Bibliotheca Vitae" }: TitleBarProps) {
  const { isDesktop, isMac, minimize, maximize, close } = useDesktopWindow();

  // If we are not on desktop, we do not need the drag region or controls
  // But we still want the spacing & nice gradient for consistency
  if (!isDesktop) {
    return (
      <div
        className="fixed top-0 left-0 right-0 h-12 flex items-center justify-between px-4 z-[9999] select-none"
        style={{
          background: 'linear-gradient(180deg, rgba(61, 52, 40, 0.08) 0%, rgba(61, 52, 40, 0.02) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex-1 text-center">
          <span className="font-serif text-sm text-foreground/40 tracking-widest uppercase">
            {title}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      data-tauri-drag-region
      className={`fixed top-0 left-0 right-0 h-10 flex items-center justify-between z-[9999] select-none ${isMac ? 'pl-[80px]' : ''}`}
      style={{
        background: 'linear-gradient(180deg, rgba(61, 52, 40, 0.08) 0%, rgba(61, 52, 40, 0.02) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Title - Centered */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex justify-center items-center h-full"
        data-tauri-drag-region
      >
        <span className="font-serif text-xs text-foreground/40 tracking-widest uppercase" data-tauri-drag-region>
          {title}
        </span>
      </motion.div>

      {/* Window Controls - Windows 风格 */}
      {!isMac && (
        <div className="flex items-center h-full">
          <button
            onClick={minimize}
            className="w-11 h-full flex items-center justify-center hover:bg-black/10 transition-colors text-foreground/60"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={maximize}
            className="w-11 h-full flex items-center justify-center hover:bg-black/10 transition-colors text-foreground/60"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={close}
            className="w-11 h-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors text-foreground/60"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Spacer for balance on macOS (right side to balance the pl-[80px] on left) */}
      {isMac && <div className="w-[80px] pointer-events-none" />}
    </div>
  );
}