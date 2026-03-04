"use client";

import { useState, useEffect } from 'react';
import { isRunningInTauri } from '@/services/entryService';

interface WindowControls {
    isDesktop: boolean;
    isMac: boolean;
    minimize: () => void;
    maximize: () => void;
    close: () => void;
}

export function useDesktopWindow(): WindowControls {
    const [isDesktop, setIsDesktop] = useState(false);
    const [isMac, setIsMac] = useState(false);

    useEffect(() => {
        // Only run on client
        if (typeof window !== 'undefined') {
            const desktop = isRunningInTauri();
            setIsDesktop(desktop);
            setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
        }
    }, []);

    const minimize = async () => {
        if (isDesktop) {
            try {
                const { getCurrentWindow } = await import('@tauri-apps/api/window');
                getCurrentWindow().minimize();
            } catch (e) {
                console.warn('Failed to minimize window', e);
            }
        }
    };

    const maximize = async () => {
        if (isDesktop) {
            try {
                const { getCurrentWindow } = await import('@tauri-apps/api/window');
                getCurrentWindow().toggleMaximize();
            } catch (e) {
                console.warn('Failed to maximize window', e);
            }
        }
    };

    const close = async () => {
        if (isDesktop) {
            try {
                const { getCurrentWindow } = await import('@tauri-apps/api/window');
                getCurrentWindow().close();
            } catch (e) {
                console.warn('Failed to close window', e);
            }
        }
    };

    return {
        isDesktop,
        isMac,
        minimize,
        maximize,
        close,
    };
}
