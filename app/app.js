const { app, BrowserWindow, ipcMain, dialog } = require("electron"); // eslint-disable-line
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

let closeWindow = true;
let reload;
let win;

function appQuit() {
  if (process.platform !== "darwin") {
    log.info("App quit");
    app.quit();
  }
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

  // Window listeners
  win.once("ready-to-show", () => {
    win.show();
  });

  win.on("close", (e) => {
    if (closeWindow) {
      log.info("Window closing");
      return;
    }

    e.preventDefault();
    const result = dialog.showMessageBox(win, {
      message: "Quit app?",
      buttons: ["Yes", "No"],
    });
    if (result === 0) {
      closeWindow = true;
      win.close();
    }
  });

  win.on("closed", () => {
    log.info("Window closed");
    if (reload) {
      reload = false;
      createWindow();
    } else {
      appQuit();
    }
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, "pages", "main.html"),
    protocol: "file:",
    slashes: true,
  }));
}

// Init settings
utils.init();

// Load electron-reload for development
try {
  // eslint-disable-next-line
  require("electron-reload")(__dirname);
} catch (error) {
  // Do nothing, electron-reload is used only for development
}

// App listeners
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
});

// IPC listeners
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
  win.close();
});

ipcMain.on("reload", () => {
  utils.init();
  reload = true;
  win.close();
});

ipcMain.on("prevent-unload", (e) => {
  // eslint-disable-next-line no-underscore-dangle
  if (!e.sender._events["will-prevent-unload"]) {
    e.sender.on("will-prevent-unload", (event) => {
      const choice = dialog.showMessageBox(win, {
        type: "question",
        buttons: ["Leave", "Stay"],
        title: "Do you want to leave this site?",
        message: "Changes you made may not be saved.",
        defaultId: 0,
        cancelId: 1,
      });
      if (choice === 0) {
        event.preventDefault();
      }
    });
  }
});
