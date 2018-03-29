const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

autoUpdater.logger = null;

autoUpdater.on("checking-for-update", () => {
  log.info("Checking for update...");
});

autoUpdater.on("update-available", (info) => {
  log.info(`Update available: ${info.version}`);
});

autoUpdater.on("update-not-available", () => {
  log.info("Update not available");
});

autoUpdater.on("update-downloaded", (info) => {
  log.info(`Update downloaded: ${info.version}`);
});

autoUpdater.on("error", (err) => {
  let message = err.message.slice(0, 600);
  if (err.message.length > 600) {
    message += "\n...\n(error message truncated)";
  }
  log.error(`Error in auto-updater:\n${message}`);
});

module.exports = autoUpdater;
