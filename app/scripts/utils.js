const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const { app } = require("electron"); // eslint-disable-line
const log = require("electron-log");

const writeFileAsync = promisify(fs.writeFile);

const settings = Object.create(null);

settings.windowButtonsPosition = "right";
settings.startMaximized = false;
settings.windowWidth = 1200;
settings.windowHeight = 700;
settings.backgroundColor = "#E0E0E0";
settings.webviews = [
  { url: "https://inbox.google.com/", icon: "inbox" },
  { url: "https://outlook.live.com/owa/?path=/calendar/view/Month", icon: "today" },
  { url: "https://feedly.com/i/latest", icon: "rss_feed" },
  { url: "https://www.messenger.com", icon: "message" },
];

async function saveSettings(data) {
  let dataJSON;

  try {
    dataJSON = JSON.stringify(data);
  } catch (error) {
    log.error("Error trying to JSON.stringify");
    log.error(error);
    return error;
  }

  try {
    await writeFileAsync(path.join(app.getPath("userData"), "config.json"), dataJSON);
    return "success";
  } catch (error) {
    log.error("Error during saving settings to disk");
    log.error(error);
    return error;
  }
}

const version = (() => app.getVersion())();

module.exports = { settings, version, saveSettings };
