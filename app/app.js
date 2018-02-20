const { app, BrowserWindow, ipcMain } = require("electron"); // eslint-disable-line
const log = require("electron-log");

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

// Require rest of the dependencies
const path = require("path");
const url = require("url");
const utils = require("./scripts/utils");

let win;

try {
  // eslint-disable-next-line
  require("electron-reload")(__dirname);
} catch (error) {
  // Do nothing, electron-reload is used only for development
}

function createWindow() {
  win = new BrowserWindow({
    width: utils.settings.windowWidth,
    height: utils.settings.windowHeight,
    frame: false,
    backgroundColor: utils.settings.backgroundColor,
    titleBarStyle: "hiddenInset",
    show: false,
  });

  if (utils.settings.startMaximized) {
    win.maximize();
  }

  win.once("ready-to-show", () => {
    win.show();
  });

  win.on("closed", () => {
    log.info("Window closed");
    win = null;
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, "pages", "main.html"),
    protocol: "file:",
    slashes: true,
  }));
}

function appQuit() {
  if (process.platform !== "darwin") {
    log.info("App quit");
    app.quit();
  }
}

app.on("ready", () => {
  createWindow();
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  log.info("All windows closed");
  appQuit();
});

ipcMain.on("minimize", () => {
  win.minimize();
});

ipcMain.on("maximize", () => {
  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }
});

ipcMain.on("close", () => {
  appQuit();
});
