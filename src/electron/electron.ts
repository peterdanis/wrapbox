import { app, BrowserWindow, ipcMain } from "electron";
import log from "electron-log";
import path from "path";
import store from "./store";
import url from "url";

// Change log level for file log to info and log app start
log.transports.file.level = "info";
log.info("App start");
log.info(`Version: ${app.getVersion()}`);
log.info(`Platform: ${process.platform}`);
log.info(`Arch: ${process.arch}`);
log.info(`Log file location: ${log.transports.file.file}`);
/*
File log locations:
  on Linux: ~/.config/<app name>/log.log
  on OS X: ~/Library/Logs/<app name>/log.log
  on Windows: %USERPROFILE%\AppData\Roaming\<app name>\log.log
*/

let mainWindow: Electron.BrowserWindow | null;

const appQuit = (): void => {
  if (process.platform !== "darwin") {
    log.info("App quit");
    app.quit();
  }
};

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    // frame: false,
    // titleBarStyle: "hiddenInset",
    backgroundColor: store.get("backgroundColor"),
    height: store.get("windowHeight"),
    // Set taskbar icon for Linux appimage manually.
    icon: process.env.APPDIR
      ? path.join(process.env.APPDIR, "wrapbox.png")
      : undefined,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
    width: store.get("windowWidth"),
  });

  mainWindow.loadURL(
    app.isPackaged
      ? url.format({
          pathname: path.join(__dirname, "index.html"),
          protocol: "file:",
          slashes: true,
        })
      : "http://localhost:3000",
  );

  if (store.get("startMaximized")) {
    mainWindow.maximize();
  }

  // Window listeners
  mainWindow.once("ready-to-show", () => {
    // @ts-ignore
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    log.info("Window closed");
    appQuit();
  });

  // Add react-dev-tools extension for development
  if (!app.isPackaged) {
    import("./react-dev-tools").then(module => {
      module.default(log);
    });
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

ipcMain.on("test", (event: Event, msg: string): void => {
  log.info(msg);
});
