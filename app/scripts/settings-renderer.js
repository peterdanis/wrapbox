/* eslint-env node, browser */
const settings = require("./settings");
const ui = require("./ui");

// Main function running all sub-tasks.
function start() {
  const resX = document.querySelector("#resx");
  resX.value = settings.windowWidth;

  const resY = document.querySelector("#resx");
  resY.value = settings.windowHeight;

  const maximized = document.querySelector("#maximized");
  maximized.checked = settings.startMaximized;

  const windowButtons = document.querySelector("#windowButtons");
  if (settings.windowButtonsPosition === "right") {
    windowButtons.checked = true;
  }
}

// Start the main function when the page is ready.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    start();
  });
} else {
  start();
}
