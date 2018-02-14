const { app } = require("electron").remote; // eslint-disable-line
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

autoUpdater.logger = null;

autoUpdater.on("checking-for-update", () => {
  log.info("Checking for update...");
});

autoUpdater.on("update-available", (info) => {
  log.info(`Update available.\n${info}`);
});

autoUpdater.on("update-not-available", (info) => {
  log.info(`Update not available.\n${info}`);
});

autoUpdater.on("update-downloaded", (info) => {
  log.info(`Update downloaded.\n${info}`);
});

autoUpdater.on("error", (err) => {
  let message = err.message.slice(0, 600);
  if (err.message.length > 600) {
    message += "...\n( error truncated)";
  }
  log.error(`Error in auto-updater:\n${message}`);
});

autoUpdater.checkForUpdates();

// app.relaunch();
// app.quit();
