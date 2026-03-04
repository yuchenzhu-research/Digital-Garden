"use client";

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Upload, RefreshCw, Check, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { exportToFile, importFromFile, getUserEntryCount } from '@/services/entryService';

interface DataManagementProps {
  onDataChanged?: () => void;
  className?: string;
}

export function DataManagement({ onDataChanged, className }: DataManagementProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');
  const [entryCount, setEntryCount] = useState(getUserEntryCount());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update entry count when data changes
  const refreshCount = useCallback(() => {
    setEntryCount(getUserEntryCount());
    onDataChanged?.();
  }, [onDataChanged]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportToFile();
      if (result.success) {
        setImportStatus('success');
        setImportMessage(`Downloaded ${result.filename}`);
        setTimeout(() => setImportStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus('idle');

    try {
      const result = await importFromFile(file, {
        merge: true,
        onProgress: () => {}, // Progress tracking
      });

      if (result.success) {
        setImportStatus('success');
        setImportMessage(`Imported ${result.importedCount} new entries`);
        refreshCount();
      } else {
        setImportStatus('error');
        setImportMessage(result.error || 'Import failed');
      }
    } catch (error) {
      setImportStatus('error');
      setImportMessage('Failed to parse file');
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setTimeout(() => {
        setImportStatus('idle');
        setImportMessage('');
      }, 4000);
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Status Badge */}
      {entryCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
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
            className="absolute right-0 top-full mt-2 w-72 bg-card border border-foreground/10 rounded-lg shadow-xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-foreground/10 flex items-center justify-between">
              <span className="font-sans text-sm font-medium">Data Management</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-foreground/10 rounded transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Status Message */}
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

            {/* Actions */}
            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground mb-2">
                {entryCount > 0
                  ? `You have ${entryCount} custom entries saved locally.`
                  : 'No custom entries yet. Create your first moment!'}
              </p>

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={isExporting || isImporting}
                className="w-full flex items-center gap-3 px-4 py-3 bg-foreground/5 hover:bg-foreground/10 rounded-lg transition-colors disabled:opacity-50"
              >
                {isExporting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <div className="text-left">
                  <div className="font-sans text-sm font-medium">Export Data</div>
                  <div className="font-sans text-xs text-muted-foreground">
                    Download backup as .json
                  </div>
                </div>
              </button>

              {/* Import Button */}
              <button
                onClick={handleImportClick}
                disabled={isExporting || isImporting}
                className="w-full flex items-center gap-3 px-4 py-3 bg-foreground/5 hover:bg-foreground/10 rounded-lg transition-colors disabled:opacity-50"
              >
                {isImporting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <div className="text-left">
                  <div className="font-sans text-sm font-medium">Import Data</div>
                  <div className="font-sans text-xs text-muted-foreground">
                    Restore from backup file
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

              {/* Info */}
              <div className="pt-2 border-t border-foreground/10">
                <p className="font-sans text-[10px] text-muted-foreground/60 leading-relaxed">
                  Data is stored locally in your browser. Export regularly to prevent data loss.
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