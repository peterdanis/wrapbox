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
const update = require("./scripts/update");
const utils = require("./scripts/utils");

const appImageIcon = (() => {
  // On Windows and MacOS the icons on taskbar are automatically set to the app icon,
  // for Linux manually setting it in BrowserWindow is needed.
  if (process.env.APPDIR) {
    return path.join(process.env.APPDIR, "wrapbox.png");
  }
  return undefined;
})();
let reload;
let win;
let closeTimeout;
global.registeredWebContents = [];

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
    icon: appImageIcon,
  });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "pages", "main.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  if (utils.settings.startMaximized) {
    win.maximize();
  }

  // Window listeners
  win.once("ready-to-show", () => {
    win.show();
  });

  win.on("close", () => {
    // Beforeunload event is fired after close event and prevent closing the main window,
    // therefore repeat the close until beforeunload event return undefined or the timeout
    // is cleared in event of reload or user deciding to stay
    closeTimeout = setTimeout(() => {
      try {
        win.close();
      } catch (error) {
        //
      }
    }, 600);
  });

  win.on("closed", () => {
    win = null;
    log.info("Window closed");
    clearTimeout(closeTimeout);
    if (reload) {
      reload = false;
      createWindow();
    } else {
      appQuit();
    }
  });
}

// Init settings
utils.init();

// Fix for Win10 notifications
app.setAppUserModelId("com.peterdanis.wrapbox");

// App listeners
app.on("ready", () => {
  createWindow();
  if (!process.env.PORTABLE_EXECUTABLE_DIR) {
    update.checkForUpdatesAndNotify();
  }
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

ipcMain.on("register", (regEvent) => {
  const webContents = regEvent.sender;
  // eslint-disable-next-line no-underscore-dangle
  if (!webContents._events["will-prevent-unload"]) {
    global.registeredWebContents.push(webContents);
    webContents.on("will-prevent-unload", (unloadEvent) => {
      if (webContents.dontAsk) {
        unloadEvent.preventDefault();
      } else {
        const choice = dialog.showMessageBox(win, {
          type: "question",
          buttons: ["Leave", "Stay"],
          message: `Page: ${webContents.getTitle()}`,
          detail: "Do you want to leave this site? Changes you made may not be saved.",
          defaultId: 0,
          cancelId: 1,
        });
        // preventDefault on will-prevent-unload allows the page to unload
        if (choice === 0) {
          unloadEvent.preventDefault();
          if (closeTimeout) {
            webContents.dontAsk = true;
          }
        } else {
          clearTimeout(closeTimeout);
        }
      }
    });
  }
});
