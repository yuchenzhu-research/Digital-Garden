"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import {
  exportToFile,
  getStorageLocation,
  getStorageModeInfo,
  getUserEntryCount,
  importFromFile,
  getEntries,
  deleteEntry,
} from '@/services/entryService';

type ImportStatus = 'idle' | 'success' | 'error';

interface UseDataManagementControllerOptions {
  onDataChanged?: () => void;
}

export function useDataManagementController({ onDataChanged }: UseDataManagementControllerOptions) {
  const [storageMode] = useState(() => getStorageModeInfo());
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const [importStatus, setImportStatus] = useState<ImportStatus>('idle');
  const [conflictBehavior, setConflictBehavior] = useState<string>('skip');
  const [importMessage, setImportMessage] = useState('');
  const [entryCount, setEntryCount] = useState(0);
  const [storageLocation, setStorageLocation] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const statusTimeoutRef = useRef<number | null>(null);

  const clearStatusTimeout = useCallback(() => {
    if (statusTimeoutRef.current !== null) {
      window.clearTimeout(statusTimeoutRef.current);
      statusTimeoutRef.current = null;
    }
  }, []);

  const scheduleStatusReset = useCallback((delayMs: number) => {
    clearStatusTimeout();
    statusTimeoutRef.current = window.setTimeout(() => {
      setImportStatus('idle');
      setImportMessage('');
      statusTimeoutRef.current = null;
    }, delayMs);
  }, [clearStatusTimeout]);

  const refreshState = useCallback(async () => {
    try {
      const [count, location] = await Promise.all([
        getUserEntryCount(),
        getStorageLocation(),
      ]);

      setEntryCount(count);
      setStorageLocation(location);
    } catch (error) {
      console.warn('Failed to refresh storage state:', error);
    }
  }, []);

  useEffect(() => {
    void refreshState();
  }, [refreshState]);

  useEffect(() => {
    return () => {
      clearStatusTimeout();
    };
  }, [clearStatusTimeout]);

  const refreshAfterMutation = useCallback(async () => {
    await refreshState();
    onDataChanged?.();
  }, [onDataChanged, refreshState]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);

    try {
      const result = await exportToFile();
      if (result.success) {
        setImportStatus('success');
        setImportMessage(`Downloaded ${result.filename}`);
        scheduleStatusReset(3000);
      } else {
        setImportStatus('error');
        setImportMessage(result.error || 'Export failed');
      }
    } catch (error) {
      console.error('Export failed:', error);
      setImportStatus('error');
      setImportMessage('Export failed');
    } finally {
      setIsExporting(false);
    }
  }, [scheduleStatusReset]);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileImport = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsImporting(true);
    setImportStatus('idle');
    clearStatusTimeout();

    try {
      const result = await importFromFile(file, {
        merge: true,
        onProgress: () => {},
        conflictBehavior,
      });

      if (result.success) {
        setImportStatus('success');
        setImportMessage(
          result.importedCount && result.importedCount > 0
            ? `Imported ${result.importedCount} new entries`
            : 'Backup loaded. No new entries were added.'
        );
        await refreshAfterMutation();
      } else {
        setImportStatus('error');
        setImportMessage(result.error || 'Import failed');
      }
    } catch {
      setImportStatus('error');
      setImportMessage('Failed to parse file');
    } finally {
      setIsImporting(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      scheduleStatusReset(4000);
    }
  }, [clearStatusTimeout, refreshAfterMutation, scheduleStatusReset, conflictBehavior]);

  const handleWipeData = useCallback(async () => {
    const confirmed = window.confirm("Are you sure you want to permanently clear all archive entries? This action cannot be undone.");
    if (!confirmed) return false;

    setIsWiping(true);
    setImportStatus('idle');
    setImportMessage('');
    clearStatusTimeout();

    try {
      const entries = await getEntries();
      if (entries.length === 0) {
        setImportStatus('success');
        setImportMessage('Archive is already empty');
        scheduleStatusReset(3000);
        return true;
      }

      await Promise.all(entries.map(async (entry) => {
        if (entry.id) {
          await deleteEntry(entry.id);
        }
      }));

      setImportStatus('success');
      setImportMessage(`Cleared all ${entries.length} entries`);
      await refreshAfterMutation();
      scheduleStatusReset(3000);
      return true;
    } catch (error) {
      console.error('Failed to wipe data:', error);
      setImportStatus('error');
      setImportMessage('Failed to clear data');
      scheduleStatusReset(3000);
      return false;
    } finally {
      setIsWiping(false);
    }
  }, [clearStatusTimeout, refreshAfterMutation, scheduleStatusReset]);

  return {
    entryCount,
    fileInputRef,
    handleExport,
    handleFileImport,
    handleImportClick,
    importMessage,
    importStatus,
    isExporting,
    isImporting,
    isWiping,
    handleWipeData,
    isOpen,
    setIsOpen,
    storageLocation,
    storageMode,
    conflictBehavior,
    setConflictBehavior,
  };
}
