"use client";

import { useCallback, useEffect, useState } from 'react';
import { getArchiveStats, type ArchiveStats } from '@/services/archive-stats';

interface UseArchiveStatsReturn {
  stats: ArchiveStats | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

/**
 * Hook for consuming real-time archive statistics.
 */
export function useArchiveStats(): UseArchiveStatsReturn {
  const [stats, setStats] = useState<ArchiveStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const result = await getArchiveStats();
      setStats(result);
    } catch (error) {
      console.warn('[useArchiveStats] Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { stats, isLoading, refresh };
}
