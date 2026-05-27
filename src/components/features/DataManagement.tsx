"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Download, Upload, Trash2, RefreshCw, Check, AlertCircle } from 'lucide-react';
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
    isWiping,
    handleWipeData,
    storageLocation,
    storageMode,
    conflictBehavior,
    setConflictBehavior,
  } = useDataManagementController({ onDataChanged });

  return (
    <div className={cn('space-y-4', className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <span className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">
          Backup Management
        </span>
        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-primary/80 font-medium font-mono">
          {storageMode.badge}
        </span>
      </div>

      {/* Entry Count & Storage Location Info */}
      <div className="rounded-[16px] border border-white/5 bg-white/[0.02] p-3 space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground/80">Archived Moments</span>
          <span className="font-mono font-medium text-foreground">
            {entryCount}
          </span>
        </div>
        <div className="text-[10px] text-muted-foreground/60 leading-relaxed truncate" title={storageLocation || 'Loading...'}>
          Source: {storageLocation || 'Loading storage location...'}
        </div>
      </div>

      {/* Feedback Message */}
      <AnimatePresence mode="wait">
        {importStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={cn(
              "rounded-xl px-3 py-2 text-[10px] flex items-center gap-2 border",
              importStatus === 'success'
                ? "bg-green-500/5 border-green-500/20 text-green-400"
                : "bg-red-500/5 border-red-500/20 text-red-400"
            )}
          >
            {importStatus === 'success' ? (
              <Check className="w-3.5 h-3.5 shrink-0 text-green-400" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
            )}
            <span className="truncate">{importMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conflict Resolution Strategy Dropdown */}
      <div className="space-y-1.5">
        <label className="text-[10px] text-muted-foreground uppercase tracking-widest font-sans">
          Conflict Strategy
        </label>
        <select
          value={conflictBehavior}
          onChange={(e) => setConflictBehavior(e.target.value)}
          className="w-full rounded-[16px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] px-3 py-2 text-xs font-sans text-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer appearance-none relative"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            backgroundSize: '14px',
            paddingRight: '30px'
          }}
        >
          <option value="skip" className="bg-[#181818] text-foreground">跳过冲突记录 (skip)</option>
          <option value="overwrite" className="bg-[#181818] text-foreground">覆盖已存在的记录 (overwrite)</option>
          <option value="duplicate" className="bg-[#181818] text-foreground">保存为新副本 (duplicate)</option>
        </select>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleExport}
          disabled={isExporting || isImporting || isWiping}
          className="flex items-center justify-center gap-1.5 rounded-[16px] border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent px-3 py-2 text-xs font-sans font-medium text-primary hover:from-primary/20 hover:border-primary/45 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {isExporting ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          Export
        </button>

        <button
          onClick={handleImportClick}
          disabled={isExporting || isImporting || isWiping}
          className="flex items-center justify-center gap-1.5 rounded-[16px] border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent px-3 py-2 text-xs font-sans font-medium text-primary hover:from-primary/20 hover:border-primary/45 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {isImporting ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          Import
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileImport}
        className="hidden"
      />

      {/* Danger Zone: Wipe Archive */}
      <button
        onClick={handleWipeData}
        disabled={isExporting || isImporting || isWiping || entryCount === 0}
        className="w-full flex items-center justify-center gap-2 rounded-[16px] border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-xs font-sans font-medium text-destructive hover:bg-destructive/10 hover:border-destructive/40 transition-all active:scale-[0.98] disabled:opacity-30 disabled:hover:bg-destructive/5 disabled:hover:border-destructive/20 disabled:cursor-not-allowed cursor-pointer"
      >
        {isWiping ? (
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Trash2 className="w-3.5 h-3.5" />
        )}
        Clear All Archive
      </button>

      <p className="text-[10px] text-muted-foreground/50 leading-relaxed text-center">
        {storageMode.description}
      </p>
    </div>
  );
}
