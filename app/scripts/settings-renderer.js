/* eslint-env node, browser */
const utils = require("electron").remote.require("./scripts/utils"); // eslint-disable-line
const ui = require("./ui");
const log = require("electron-log");
const { app } = require("electron").remote; // eslint-disable-line

// Global variables, needed for addWebviewSetting and loadSettingsInPage functions
let index = 0;
let resX;
let resY;
let maximized;
let windowButtons;
let webviews;

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

function loadSettingsInPage() {
  resX = document.getElementById("resx");
  resX.value = utils.settings.windowWidth;

  resY = document.getElementById("resy");
  resY.value = utils.settings.windowHeight;

  maximized = document.getElementById("maximized");
  maximized.checked = utils.settings.startMaximized;

  windowButtons = document.getElementById("windowButtons");
  if (utils.settings.windowButtonsPosition === "right") {
    windowButtons.checked = true;
  }

  webviews = document.getElementsByClassName("wb");
  // Delete all existing webview setting fields
  for (let i = 0; i < webviews.length; i++) {
    webviews[i].parentNode.remove();
  }

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
      .saveSettings({
        windowButtonsPosition: (() => {
          if (windowButtons.checked) {
            return "right";
          }
          return "left";
        })(),
        startMaximized: maximized.checked,
        windowWidth: resX.value,
        windowHeight: resY.value,
        webviews: (() => {
          const arr = [];
          for (let i = 0; i < webviews.length; i++) {
            if (webviews[i].value) {
              arr.push({ url: webviews[i].value });
            }
          }
          return arr;
        })(),
      })
      .then((success) => {
        console.log("s");
        // TODO: Add MDL snackbar here, with option to reload
        const snackbarContainer = document.querySelector("#settingssnackbar");
        const handler = function (event) {
          // TODO
          app.relaunch();
          app.quit();
        };
        const data = {
          message: "Settings saved",
          timeout: 5000,
          actionHandler: handler,
          actionText: "Reload app",
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
      })
      .catch((failure) => {
        console.log("f");
        // Add MDL snackbar here
      });
  });

  const discardButton = document.querySelector("#discard");
  discardButton.addEventListener("click", () => {
    loadSettingsInPage();
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
  loadSettingsInPage();
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