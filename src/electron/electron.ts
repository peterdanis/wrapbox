import { app, BrowserWindow } from "electron"; // eslint-disable-line import/no-extraneous-dependencies
import log from "electron-log";
import path from "path";
import url from "url";
import Store from "electron-store";

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

const store = new Store();

let mainWindow: Electron.BrowserWindow | null;

const appQuit = (): void => {
  if (process.platform !== "darwin") {
    log.info("App quit");
    app.quit();
  }
};

// TODO: Read settings from file
const settings = {
  windowWidth: 1200,
  windowHeight: 700,
  backgroundColor: "#000000",
  startMaximized: false,
};

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: settings.windowWidth,
    height: settings.windowHeight,
    frame: false,
    backgroundColor: settings.backgroundColor,
    titleBarStyle: "hiddenInset",
    show: false,
    // Set taskbar icon for Linux appimage manually.
    icon: process.env.APPDIR
      ? path.join(process.env.APPDIR, "wrapbox.png")
      : undefined,
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

  if (settings.startMaximized) {
    mainWindow.maximize();
  }

  // Window listeners
  mainWindow.once("ready-to-show", () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    log.info("Window closed");
    appQuit();
  });
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

// @ts-ignore
app.on("ready", createWindow);

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  log.info("All windows closed");
});
