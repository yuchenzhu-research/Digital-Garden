"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Download, Upload, RefreshCw, Check, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDataManagementController } from '@/hooks/useDataManagementController';

interface DataManagementProps {
  onDataChanged?: () => void;
  className?: string;
}

export function DataManagement({ onDataChanged, className }: DataManagementProps) {
  const {
    entryCount,
    fileInputRef,
    handleExport,
    handleFileImport,
    handleImportClick,
    importMessage,
    importStatus,
    isExporting,
    isImporting,
    isOpen,
    setIsOpen,
    storageLocation,
    storageMode,
  } = useDataManagementController({ onDataChanged });

  return (
    <div className={cn('relative', className)}>
      {/* Status Badge */}
      {entryCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary"
        >
          <span className="text-[10px] text-primary-foreground font-medium">
            {entryCount > 99 ? '99+' : entryCount}
          </span>
        </motion.div>
      )}

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="btn-minimal h-10 px-4 flex items-center gap-2"
      >
        <RefreshCw className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
        <span className="text-sm font-sans uppercase tracking-wide">Data</span>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="surface-panel absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-[28px]"
          >
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="font-sans text-sm font-medium">Data Management</span>
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
                  {storageMode.badge}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 transition-colors hover:bg-white/10"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {importStatus !== 'idle' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className={cn(
                    'px-4 py-2 text-sm flex items-center gap-2',
                    importStatus === 'success' && 'bg-green-500/10 text-green-600',
                    importStatus === 'error' && 'bg-red-500/10 text-red-600'
                  )}
                >
                  {importStatus === 'success' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {importMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground mb-2">
                {entryCount > 0
                  ? `You have ${entryCount} entries available from ${storageLocation || storageMode.badge}.`
                  : storageMode.emptyState}
              </p>

              <button
                onClick={handleExport}
                disabled={isExporting || isImporting}
                className="w-full rounded-[20px] border border-white/8 bg-white/[0.04] px-4 py-3 transition-colors hover:bg-white/[0.08] disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  {isExporting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <div className="text-left">
                    <div className="font-sans text-sm font-medium">{storageMode.exportLabel}</div>
                    <div className="font-sans text-xs text-muted-foreground">
                    Download a portable `.json` backup with embedded local images
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={handleImportClick}
                disabled={isExporting || isImporting}
                className="w-full rounded-[20px] border border-white/8 bg-white/[0.04] px-4 py-3 transition-colors hover:bg-white/[0.08] disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  {isImporting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <div className="text-left">
                    <div className="font-sans text-sm font-medium">{storageMode.importLabel}</div>
                    <div className="font-sans text-xs text-muted-foreground">
                    Merge a backup and restore embedded images into the current storage mode
                    </div>
                  </div>
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />

              <div className="border-t border-white/8 pt-2">
                <p className="font-sans text-[10px] text-muted-foreground/60 leading-relaxed">
                  {storageMode.description}
                </p>
                <p className="mt-2 font-sans text-[10px] text-muted-foreground/50 leading-relaxed break-all">
                  Current source: {storageLocation || 'Loading storage location...'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
