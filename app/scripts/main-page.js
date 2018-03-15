const addWebviewButtons = require("./add-webview-buttons");
const addWebviews = require("./add-webviews");
const addWindowButtons = require("./add-window-buttons");
const EventEmitter = require("events");
const path = require("path");
const PerfectScrollbar = require("../dependencies/perfect-scrollbar.common");
const { remote } = require("electron"); // eslint-disable-line
const setUpSettingsPage = require("./set-up-settings-page");

const utils = remote.require("./scripts/utils");
const blankPage = path.join(__dirname, "blank.html");

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
  const webviews = utils.settings.webviews.concat([{ url: "settings.html" }]);

  addWebviews("#content", webviews, watcher);
  addWebviewButtons("#leftpanel", utils.settings.webviews, watcher);
  setUpSettingsPage(watcher);

  // Add a custom scrollbar to leftpanel (panel with webview buttons)
  // eslint-disable-next-line no-new
  new PerfectScrollbar("#leftpanel");

  window.onbeforeunload = () => {
    const webContents = remote.getGlobal("registeredWebContents");
    setImmediate(() => {
      webContents.forEach((element) => {
        if (!new RegExp(/pages\/(blank|settings)\.html/).test(element.history)) {
          try {
            element.executeJavaScript(`window.location = "file://${blankPage}"`);
          } catch (error) {
            //
          }
        }
      });
    });

    return Array.from(document.querySelectorAll("webview")).find(el => !new RegExp(/pages\/(blank|settings)\.html/).test(el.src));
  };
}

// Start the main function when the page is ready.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    start();
  });
} else {
  start();
}
