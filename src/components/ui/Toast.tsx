"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

export function Toast({ message, visible, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 0.8,
          }}
          onAnimationComplete={() => {
            // Auto dismiss after 2.5 seconds
            setTimeout(onClose, 2500);
          }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999]"
        >
          <div
            className="flex items-center gap-3 px-6 py-4 rounded-full"
            style={{
              // Glassmorphism effect - Digital Renaissance aesthetic
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow)',
            }}
          >
            {/* Success indicator */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 500, damping: 30 }}
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{
                background: 'var(--primary)',
              }}
            >
              <motion.svg
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="w-3 h-3 text-black"
                viewBox="0 0 12 12"
                fill="none"
              >
                <motion.path
                  d="M2 6l3 3 5 -5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </motion.div>

            {/* Message */}
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="font-sans text-sm tracking-wide text-[var(--ink-strong)]"
            >
              {message}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
