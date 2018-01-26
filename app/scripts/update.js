const { app } = require("electron").remote; // eslint-disable-line
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

autoUpdater.on("checking-for-update", log.info());

// app.relaunch();
// app.quit();
