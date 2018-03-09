/* eslint-disable no-underscore-dangle */
const { app } = require("electron"); // eslint-disable-line
const { promisify } = require("util");
const fs = require("fs");
const log = require("electron-log");
const path = require("path");

const settings = Object.create(null);
const version = (() => app.getVersion())();
const writeFileAsync = promisify(fs.writeFile);

function loadSettings(file) {
  let _file;
  let config = {};

  if (file) {
    _file = file;
  } else if (process.env.PORTABLE_EXECUTABLE_DIR) {
    _file = path.join(process.env.PORTABLE_EXECUTABLE_DIR, "Wrapbox-portable-config.json");
  } else {
    try {
      _file = path.join(app.getAppPath(), "config.json");
      fs.statSync(_file);
    } catch (error) {
      // Ignore error and set the default file path
      _file = path.join(app.getPath("userData"), "config.json");
    }
  }

  try {
    config = JSON.parse(fs.readFileSync(_file, "utf8"));
  } catch (error) {
    // Ignore ENOENT errors (file does not exist), this is expected
    if (error.code !== "ENOENT") {
      log.error("Error in loadSettings");
      log.error(error);
    }
  }

  settings.filePath = _file;
  settings.windowButtonsPosition = config.windowButtonsPosition || "right";
  settings.startMaximized = config.startMaximized || false;
  settings.windowWidth = parseInt(config.windowWidth, 10) || 1200;
  settings.windowHeight = parseInt(config.windowHeight, 10) || 700;
  settings.backgroundColor = "#E0E0E0";
  settings.webviews = config.webviews || [];

  log.info(`Settings location: ${settings.filePath}`);
}

async function saveSettings(data, file) {
  let dataJSON;
  let _file;
  if (file) {
    _file = file;
  } else {
    _file = settings.filePath;
  }

  try {
    dataJSON = JSON.stringify(data);
  } catch (error) {
    log.error("Error trying to JSON.stringify");
    log.error(error);
    throw error;
  }

  try {
    await writeFileAsync(_file, dataJSON);
  } catch (error) {
    log.error("Error during saving settings to disk");
    log.error(error);
    throw error;
  }
}

loadSettings();

module.exports = {
  loadSettings,
  saveSettings,
  settings,
  version,
};
