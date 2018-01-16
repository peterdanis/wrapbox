const { app, BrowserWindow, ipcMain } = require("electron"); // eslint-disable-line
const path = require("path");
const utils = require("./scripts/utils");
const url = require("url");

let win;

try {
  // eslint-disable-next-line
  require("electron-reload")(__dirname);
} catch (error) {
  // Do nothing, electron-reload is used only for development
}

function createWindow() {
  win = new BrowserWindow({
    width: utils.windowWidth,
    height: utils.windowHeight,
    frame: false,
    backgroundColor: utils.backgroundColor,
    titleBarStyle: "hiddenInset",
    show: false,
  });

  if (utils.startMaximized) {
    win.maximize();
  }

  win.once("ready-to-show", () => {
    win.show();
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, "pages", "index.html"),
    protocol: "file:",
    slashes: true,
  }));

  win.on("closed", () => {
    win = null;
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
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
}

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
