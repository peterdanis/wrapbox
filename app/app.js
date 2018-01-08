const { app, BrowserWindow, ipcMain } = require("electron"); // eslint-disable-line
const path = require("path");
const settings = require("./scripts/settings");
const url = require("url");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: settings.windowWidth || 1200,
    height: settings.windowHeight || 700,
    frame: false,
    backgroundColor: settings.backgroundColor,
    titleBarStyle: "hiddenInset",
    show: false,
  });

  if (settings.startMaximized) {
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
