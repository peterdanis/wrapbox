import { IpcRenderer } from "electron";

interface CustomIpcRenderer extends IpcRenderer {
  send(channel: "logInfo", message: string): void;
  send(channel: "setSettings", settings: {}): void;
  sendSync(channel: "getAllSettings"): Settings;
  sendSync(channel: "getSetting", settingKey: string): {} | string;
  sendSync(channel: "logError", message: string): void;
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
