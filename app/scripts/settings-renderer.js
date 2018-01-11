/* eslint-env node, browser */
const settings = require("./settings");
const ui = require("./ui");

function addWebviewSetting(parent, url, index) {
  //
  new ui.TextField({
    innerId: `w${index}`,
    value: url,
    text: "A webview URL or relative file path",
    errorText: "Should be a valid URL",
    pattern: "^(https?://|file://|..?/)[a-zA-Z0-9/%.?=-]*",
    class: "mdl-cell mdl-cell--8-col",
  }).appendTo(parent);
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
  settings.webviews.forEach((e, i) => {
    addWebviewSetting("#webviews", e.url, i);
  });
}

// Main function running all sub-tasks.
function start() {
  loadSettings();
}

// Start the main function when the page is ready.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    start();
  });
} else {
  start();
}
