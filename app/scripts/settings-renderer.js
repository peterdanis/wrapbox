/* eslint-env node, browser */
const utils = require("electron").remote.require("./scripts/utils"); // eslint-disable-line
const ui = require("./ui");

// Global variable, needed for addWebviewSetting function
let index = 0;

/**
 * Creates a textfield for webviews.
 * @param {string|{}} parent
 * @param {string} url
 */
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
  resX.value = utils.settings.windowWidth;

  const resY = document.querySelector("#resy");
  resY.value = utils.settings.windowHeight;

  const maximized = document.querySelector("#maximized");
  maximized.checked = utils.settings.startMaximized;

  const windowButtons = document.querySelector("#windowButtons");
  if (utils.settings.windowButtonsPosition === "right") {
    windowButtons.checked = true;
  }
  // Delete all existing webview setting fields
  document.querySelectorAll(".wb").forEach((e) => {
    e.parentNode.remove();
  });
  // Load webview settings
  utils.settings.webviews.forEach((e) => {
    addWebviewSetting("#webviews", e.url);
  });
}

function activateButtons() {
  const webviewButton = document.querySelector("#addwebview");
  webviewButton.addEventListener("click", () => {
    addWebviewSetting("#webviews");
    // Register newly created button to MDL
    // eslint-disable-next-line no-undef
    componentHandler.upgradeAllRegistered();
  });

  const saveButton = document.querySelector("#save");
  saveButton.addEventListener("click", () => {
    utils
      .saveSettings("test")
      .then((success) => {
        console.log(`s: ${success}`);
      })
      .catch((failure) => {
        console.log(`f: ${failure}`);
      });
  });

  const discardButton = document.querySelector("#discard");
  discardButton.addEventListener("click", () => {
    loadSettings();
    // eslint-disable-next-line no-undef
    componentHandler.upgradeAllRegistered();
  });
}

// Add version info to footer.
function version() {
  document.querySelector("#version").innerText = utils.version;
}

// Main function running all sub-tasks.
function start() {
  loadSettings();
  activateButtons();
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
