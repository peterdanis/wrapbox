const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const { app } = require("electron"); // eslint-disable-line
const log = require("electron-log");

const writeFileAsync = promisify(fs.writeFile);
const version = (() => app.getVersion())();
const settings = Object.create(null);
let config = {};
let settingsLocation;

(function loadSettings() {
  // Allow using app root dir for saving the settings file,
  // helpful for portable usage. Only for win platform.
  if (process.platform === "win32") {
    try {
      settingsLocation = path.join(app.getPath("exe"), "config.json");
      config = JSON.parse(fs.readFileSync(settingsLocation, "utf8"));
      return;
    } catch (error) {
      // Ignore ENOENT errors (file does not exist), this is expected
      if (error.code !== "ENOENT") {
        log.error("Error in loadSettings");
        log.error(error);
      }
    }
  }

  settingsLocation = path.join(app.getPath("userData"), "config.json");

  try {
    config = JSON.parse(fs.readFileSync(settingsLocation, "utf8"));
  } catch (error) {
    // Ignore ENOENT errors (file does not exist), this is expected
    if (error.code !== "ENOENT") {
      log.error("Error in loadSettings");
      log.error(error);
    }
  }
}());

log.info(`Settings location: ${settingsLocation}`);

settings.windowButtonsPosition = config.windowButtonsPosition || "right";
settings.startMaximized = config.startMaximized || false;
settings.windowWidth = parseInt(config.windowWidth, 10) || 1200;
settings.windowHeight = parseInt(config.windowHeight, 10) || 700;
settings.backgroundColor = "#E0E0E0";
settings.webviews = config.webviews || [];

async function saveSettings(data) {
  let dataJSON;

  try {
    dataJSON = JSON.stringify(data);
  } catch (error) {
    log.error("Error trying to JSON.stringify");
    log.error(error);
    throw error;
  }

  try {
    await writeFileAsync(settingsLocation, dataJSON);
  } catch (error) {
    log.error("Error during saving settings to disk");
    log.error(error);
    throw error;
  }
}

module.exports = { settings, version, saveSettings };
