"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

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
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: `
                0 8px 32px rgba(0, 0, 0, 0.1),
                0 2px 8px rgba(0, 0, 0, 0.05),
                inset 0 1px 0 rgba(255, 255, 255, 0.3)
              `,
            }}
          >
            {/* Success indicator */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 500, damping: 30 }}
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, oklch(0.55 0.18 20) 0%, oklch(0.45 0.12 25) 100%)',
              }}
            >
              <motion.svg
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="w-3 h-3 text-white"
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
              className="font-sans text-sm tracking-wide"
              style={{ color: 'oklch(0.25 0.02 30)' }}
            >
              {message}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Toast Manager for programmatic use
const toastListeners: Set<(message: string) => void> = new Set();

export function showToast(message: string) {
  toastListeners.forEach(listener => listener(message));
}

// Headless hook for managing toast state in EntryEditor
export function useToast() {
  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const show = React.useCallback((msg: string) => {
    setMessage(msg);
    setVisible(true);
  }, []);

  const hide = React.useCallback(() => {
    setVisible(false);
  }, []);

  React.useEffect(() => {
    toastListeners.add(show);
    return () => {
      toastListeners.delete(show);
    };
  }, [show]);

  return { visible, message, show, hide };
}