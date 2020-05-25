import { CustomIpcRenderer } from "../wrapbox"; // eslint-disable-line import/no-unresolved
import { ipcRenderer } from "electron";

window.ipcRenderer = (ipcRenderer as unknown) as CustomIpcRenderer;
