const utils = require("electron").remote.require("./scripts/utils"); // eslint-disable-line
const EventEmitter = require("events");
const addWindowButtons = require("./add-window-buttons");
const setUpSettingsPage = require("./set-up-settings-page");
const addWebviews = require("./add-webviews");
const addWebviewButtons = require("./add-webview-buttons");
const PerfectScrollbar = require("../dependencies/perfect-scrollbar.common");

// Event aggregator. Passed to functions as argument.
const watcher = new EventEmitter();
watcher.setMaxListeners(0);

// Main function running all sub-tasks.
function start() {
  // Do not display control buttons on MacOS, it has own inset buttons
  if (process.platform !== "darwin") {
    addWindowButtons("#titlebar", utils.settings.windowButtonsPosition);
  }

  // Insert settings webview, for addWebviews function call
  const webviews = utils.settings.webviews.concat([{ url: "../pages/settings.html" }]);

  addWebviewButtons("#leftpanel", utils.settings.webviews, watcher);
  addWebviews("#content", webviews, watcher);
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
