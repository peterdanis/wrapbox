const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");

let win;

function createWindow(target) {
  win = new BrowserWindow({
    width: 1200,
    height: 700,
    frame: false,
    backgroundColor: "#283593",
  });

  // TODO Un-comment to disable menu and DevTools
  // win.setMenu(null);

  win.loadURL(target);

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
  createWindow(url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file:",
    slashes: true,
  }));
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
