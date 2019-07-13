import { IpcRenderer } from "electron";

interface CustomIpcRenderer extends IpcRenderer {
  send(channel: "logInfo", message: string): void;
  send(channel: "setSettings", settings: {}): void;
  sendSync(channel: "getAllSettings"): {};
  sendSync(channel: "getSetting", setting: string): {} | string;
  sendSync(channel: "logError", message: string): void;
}

declare global {
  interface Window {
    ipcRenderer: CustomIpcRenderer;
  }
}

export default window.ipcRenderer;
