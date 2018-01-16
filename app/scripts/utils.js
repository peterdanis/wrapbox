const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const { app } = require("electron"); // eslint-disable-line

const readFileAsync = promisify(fs.readFile);
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
  console.log(app);
  let dataJSON;

  try {
    dataJSON = JSON.stringify(data);
  } catch (error) {
    return error;
  }

  try {
    const a = await writeFileAsync(path.join(app.getPath("userData"), "config.json"), dataJSON);
    return "success";
  } catch (error) {
    return error;
  }
}
settings.saveSettings = saveSettings;
settings.version = (() => app.getVersion())();

module.exports = settings;
