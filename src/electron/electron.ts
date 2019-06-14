import electron from "electron"; // eslint-disable-line import/no-extraneous-dependencies
import path from "path";

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow: Electron.BrowserWindow | null;

const createWindow: Function = (): void => {
  mainWindow = new BrowserWindow({ width: 900, height: 680 });
  mainWindow.loadURL(
    app.isPackaged
      ? `file://${path.join(__dirname, "../build/index.html")}`
      : "http://localhost:3000"
  );
  mainWindow.on("closed", () => (mainWindow = null));
};

// @ts-ignore
app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
