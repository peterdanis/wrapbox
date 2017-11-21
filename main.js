const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const settings = require("./settings");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: settings.windowWidth,
    height: settings.windowHeight,
    frame: false,
    backgroundColor: settings.backgroundColor,
  });

  // TODO Un-comment to disable menu and DevTools
  // win.setMenu(null);

  win.loadURL(path.join(__dirname, "index.html"));

  if (settings.startMaximized) {
    win.maximize();
  }

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
