const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");

let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 700,
    webviewTag: true,
    frame: process.platform !== "win32",
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, "index.html"),
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

app.on("ready", createWindow);

app.on("browser-window-created", (e, window) => {
  window.setMenu(null);
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
