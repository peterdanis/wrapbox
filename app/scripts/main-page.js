const EventEmitter = require("events");
const addWebviewButtons = require("./add-webview-buttons");
const addWebviews = require("./add-webviews");
const addWindowButtons = require("./add-window-buttons");
const addBeforeUnload = require("./add-before-unload");
const onDocumentReady = require("./on-document-ready");
const PerfectScrollbar = require("../dependencies/perfect-scrollbar.common");
const setUpSettingsPage = require("./set-up-settings-page");
const utils = require("electron").remote.require("./scripts/utils"); // eslint-disable-line

// Event aggregator. Passed to functions as argument.
const watcher = new EventEmitter();
watcher.setMaxListeners(0);

// Main function running all sub-tasks.
function main() {
  // Do not display control buttons on MacOS, it has own inset buttons
  if (process.platform !== "darwin") {
    addWindowButtons("#titlebar", utils.settings.windowButtonsPosition);
  }

  // Insert settings webview, for addWebviews function call
  const webviews = utils.settings.webviews.concat([{ url: "settings.html" }]);

  addWebviews("#content", webviews, watcher);
  addWebviewButtons("#leftpanel", utils.settings.webviews, watcher);
  setUpSettingsPage(watcher);
  addBeforeUnload();

  // Add a custom scrollbar to leftpanel (panel with webview buttons)
  // eslint-disable-next-line no-new
  new PerfectScrollbar("#leftpanel");
}

// Start the main function when the page is ready.
onDocumentReady(main);
