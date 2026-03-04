/// <reference types="@tauri-apps/api/clients" />

interface Window {
  __TAURI__: {
    window: {
      appWindow: {
        minimize: () => Promise<void>;
        maximize: () => Promise<void>;
        toggleMaximize: () => Promise<void>;
        close: () => Promise<void>;
        setAlwaysOnTop: (onTop: boolean) => Promise<void>;
      };
    };
  };
}