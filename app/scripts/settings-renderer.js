/* eslint-env node, browser */
const settings = require("./settings");
const ui = require("./ui");
const { app } = require("electron").remote; // eslint-disable-line

// Global variable, needed for addWebviewSetting function
let index = 0;

function addWebviewSetting(parent, url) {
  // Create new MDL textfield and fill in the values.
  new ui.TextField({
    innerId: `w${index}`,
    value: url,
    text: "A webview URL or relative file path",
    errorText: "Should be a valid URL",
    pattern: "^(https?://|file://|..?/)[a-zA-Z0-9/%.?=-]*",
    class: "mdl-cell mdl-cell--7-col",
    innerClass: "wb",
  }).appendTo(parent);
  // Increment the global index variable.
  index++;
}

function loadSettings() {
  const resX = document.querySelector("#resx");
  resX.value = settings.windowWidth;

  const resY = document.querySelector("#resy");
  resY.value = settings.windowHeight;

  const maximized = document.querySelector("#maximized");
  maximized.checked = settings.startMaximized;

  const windowButtons = document.querySelector("#windowButtons");
  if (settings.windowButtonsPosition === "right") {
    windowButtons.checked = true;
  }
  settings.webviews.forEach((e) => {
    addWebviewSetting("#webviews", e.url);
  });

  const webviewButton = document.querySelector("#addwebview");
  webviewButton.addEventListener("click", () => {
    addWebviewSetting("#webviews");
    //
    // eslint-disable-next-line no-undef
    componentHandler.upgradeAllRegistered();
  });
}

function version() {
  console.log(app.getVersion());
  document.querySelector("#version").innerText = app.getVersion();
}

// Main function running all sub-tasks.
function start() {
  loadSettings();
  version();
}

// Start the main function when the page is ready.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    start();
  });
} else {
  start();
}
