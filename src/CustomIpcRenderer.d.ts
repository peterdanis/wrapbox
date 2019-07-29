import { IpcRenderer } from "electron";

interface CustomIpcRenderer extends IpcRenderer {
  send(channel: "logInfo", message: string): void;
  send(channel: "setSettings", settings: {}): void;
  sendSync(channel: "getAllSettings"): {};
  sendSync(channel: "getSetting", setting: string): {} | string;
  sendSync(channel: "logError", message: string): void;
}

// ipcRenderer will be attached to window object via preload script. This ensures that it will work both in development and in production.
declare global {
  interface Window {
    ipcRenderer: CustomIpcRenderer;
  }
}
