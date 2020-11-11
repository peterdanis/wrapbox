interface CustomIpcRenderer {
  // invoke(channel: "logInfo", message: string): void;
  invoke(channel: "setSettings", settings: Settings): void;
  invoke(channel: "getAllSettings"): Settings;
  // invoke(channel: "getSetting", settingKey: string): {} | string;
  // invoke(channel: "logError", message: string): void;
}

export interface ElectronCSSProperties extends React.CSSProperties {
  WebkitAppRegion: string;
}

export interface Page {
  icon: string;
  id: string;
  url: string;
}

interface Settings {
  pages: Page[];
}

// ipcRenderer will be attached to window object via preload script. This ensures that it will work both in development and in production.
declare global {
  interface Window {
    ipcRenderer: CustomIpcRenderer;
  }
}
