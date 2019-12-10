import { app, BrowserWindow, ipcMain, shell } from "electron";
import log from "electron-log";
import path from "path";
import store from "./store";

// Change log level for file log to info and log app start
log.transports.file.level = "info";
log.info("App start");
log.info(`Version: ${app.getVersion()}`);
log.info(`Platform: ${process.platform}`);
log.info(`Arch: ${process.arch}`);
log.info(`Log file location: ${log.transports.file.file}`);
log.info(`Settings location: ${store.path}`);
/*
File log locations:
  on Linux: ~/.config/{app name}/logs/{process type}.log
  on macOS: ~/Library/Logs/{app name}/{process type}.log
  on Windows: %USERPROFILE%\AppData\Roaming\{app name}\{process type}.log
*/

// Enable Overlay scrollbar
app.commandLine.appendSwitch("--enable-features", "OverlayScrollbar");

let mainWindow: Electron.BrowserWindow | null;

const appQuit = (): void => {
  if (process.platform !== "darwin") {
    log.info("App quit");
    app.quit();
  } else {
    mainWindow = null;
  }
};

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    backgroundColor: store.get("backgroundColor") as string,
    frame: false,
    height: store.get("windowHeight") as number,
    // Set taskbar icon for Linux appimage manually.
    icon: process.env.APPDIR
      ? path.join(process.env.APPDIR, "wrapbox.png")
      : undefined,
    show: false,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
      sandbox: true,
      webviewTag: true,
    },
    width: store.get("windowWidth") as number,
  });

  // Window listeners
  mainWindow.once("ready-to-show", () => {
    if (store.get("startMaximized")) {
      mainWindow!.maximize(); // eslint-disable-line @typescript-eslint/no-non-null-assertion
    }
    mainWindow!.show(); // eslint-disable-line @typescript-eslint/no-non-null-assertion
  });

  mainWindow.on("closed", () => {
    log.info("Window closed");
    appQuit();
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, "index.html"));
  } else {
    mainWindow.loadURL("http://localhost:3000");
    // Add react-dev-tools extension for development
    (async () => {
      const module = await import("./react-dev-tools");
      module.default(log);
    })();
  }
};

// Fix for Win10 notifications
app.setAppUserModelId("com.peterdanis.wrapbox");

// App listeners
app.on("ready", () => {
  createWindow();
  if (!process.env.PORTABLE_EXECUTABLE_DIR) {
    // TODO: update after setting up updating module
    // update.checkForUpdatesAndNotify();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  log.info("All windows closed");
});

app.on("web-contents-created", (event, contents) => {
  if (contents.getType() === "webview") {
    contents.on("new-window", (newWindowEvent, url, frameName, disposition) => {
      if (disposition !== "new-window") {
        newWindowEvent.preventDefault();
        shell.openExternal(url);
      }
    });
  }
});

// IPC listeners
interface IpcMainEvent extends Event {
  reply: Function;
  returnValue: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

ipcMain.on("setSettings", (event, settings: {}): void => {
  try {
    store.set(settings);
  } catch (error) {
    log.error(error);
  }
});

ipcMain.on("getSetting", (event: IpcMainEvent, settingKey: string) => {
  event.returnValue = store.get(settingKey); // eslint-disable-line no-param-reassign
});

ipcMain.on("getAllSettings", (event: IpcMainEvent) => {
  event.returnValue = store.store; // eslint-disable-line no-param-reassign
});

ipcMain.on("logInfo", (event, message: string) => {
  log.info(message);
});

ipcMain.on("logError", (event, message: string) => {
  log.error(message);
});
