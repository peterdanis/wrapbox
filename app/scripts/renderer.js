/* eslint-env node, browser */
const utils = require("electron").remote.require("./scripts/utils"); // eslint-disable-line
const EventEmitter = require("events");
const addWindowButtons = require("./add-window-buttons");
const setUpSettingsPage = require("./set-up-settings-page");
const addWebviews = require("./add-webviews");
const addWebviewButtons = require("./add-webview-buttons");
const PerfectScrollbar = require("./perfect-scrollbar.common");

// Event aggregator. Passed to functions as argument.
const watcher = new EventEmitter();
watcher.setMaxListeners(0);

// Main function running all sub-tasks.
function start() {
  // Do not display control buttons on MacOS, it has own inset buttons
  if (process.platform !== "darwin") {
    addWindowButtons("#titlebar", utils.windowButtonsPosition);
  }

  addWebviewButtons("#leftpanel", utils.webviews, watcher);
  // Insert settings webview after the buttons have been created
  // Settings has its own button
  utils.webviews.push({ url: "../pages/settings.html" });
  addWebviews("#content", utils.webviews, watcher);
  setUpSettingsPage(watcher);

  // Add a custom scrollbar to leftpanel (panel with webview buttons)
  // eslint-disable-next-line no-new
  new PerfectScrollbar("#leftpanel");
}

// Start the main function when the page is ready.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    start();
  });
} else {
  start();
}
