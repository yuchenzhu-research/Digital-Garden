"use client";

import { useCallback, useMemo, useState } from 'react';
import { getWebFS } from '@/services/entryService';
import { isTauri } from '@/utils/env';
import { useMobileDevice } from './useMobileDevice';

export function useSettingsPanelController() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnectingFolderMode, setIsConnectingFolderMode] = useState(false);
  const mobileDevice = useMobileDevice();
  const isTauriDesktop = isTauri();
  const [fsConnected, setFsConnected] = useState<boolean>(
    !isTauriDesktop && getWebFS().isReady()
  );

  const showFolderModeControls = !isTauriDesktop && !mobileDevice;
  const showMobileDraftNotice = !isTauriDesktop && mobileDevice;

  const connectFolderMode = useCallback(async () => {
    if (fsConnected || isConnectingFolderMode) {
      return;
    }

    setIsConnectingFolderMode(true);

    try {
      const success = await getWebFS().requestDirectoryAccess();
      if (success) {
        setFsConnected(true);
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsConnectingFolderMode(false);
    }
  }, [fsConnected, isConnectingFolderMode]);

  const storageModeLabel = useMemo(() => (
    fsConnected ? 'Folder Mode' : 'Browser Local'
  ), [fsConnected]);

  return {
    connectFolderMode,
    fsConnected,
    isConnectingFolderMode,
    isOpen,
    openPanel: () => setIsOpen(true),
    setIsOpen,
    showFolderModeControls,
    showMobileDraftNotice,
    storageModeLabel,
  };
}
