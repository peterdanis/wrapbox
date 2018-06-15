const { ipcRenderer } = require("electron"); // eslint-disable-line
const codepoints = require("../dependencies/material-icon-codepoints");
const onDocumentReady = require("./on-document-ready");
const ui = require("./ui");
const utils = require("electron").remote.require("./scripts/utils"); // eslint-disable-line

// Global variables
let index = 0;
let resX;
let resY;
let maximized;
let windowButtons;
let webviews;
let iconDialog;

/**
 * Creates modal dialog for choosing webview button icon.
 */
function createIconDialog() {
  iconDialog = new ui.BaseElement({
    type: "dialog",
    class: "mdl-dialog",
    innerHTML: "<h5 class=\"mdl-color-text--blue-A200\">Choose an icon</h5>",
  }).appendTo("body");

  const icons = ui.arrayToElements(
    ui.IconButton,
    codepoints.map(e => ({
      innerHTML: new ui.MaterialIcon({ innerHTML: `${e}` }).element.outerHTML,
    })),
    { textColor: "blue-A200" }
  );

  icons.forEach((e) => {
    e.appendTo(iconDialog.element).addEventListener("click", (event) => {
      iconDialog.currentTarget.firstChild.innerHTML = `${event.currentTarget.firstChild.innerHTML}`;
      iconDialog.element.close();
    });
  });
}

/**
 * Creates a textfield for webviews.
 * @param {string|{}} parent
 * @param {string} url
 */
function addWebviewSetting(parent, webview) {
  // eslint-disable-next-line no-underscore-dangle
  const _webview = webview || {};

  //
  const parentDiv = new ui.BaseElement({
    type: "div",
    class: "mdl-cell mdl-cell--12-col",
  }).appendTo(parent);

  new ui.MiniFabButton({
    id: `i${index}`,
    // If no icon is choosen add a pulse effect
    class: `${_webview.icon ? "" : "infinite pulse "}mdl-shadow--2dp`,
    color: "blue-A200",
    textColor: "white",
    innerHTML: `<i class="material-icons">${_webview.icon || "more_horiz"}</i>`,
  })
    .addEventListener("click", (event) => {
      event.currentTarget.classList.remove("pulse", "infinite");
      iconDialog.currentTarget = event.currentTarget;
      iconDialog.element.showModal();
    })
    .appendTo(parentDiv.element);

  // Create new MDL textfield and fill in the values.
  new ui.TextField({
    innerId: `w${index}`,
    value: _webview.url,
    text: "A webview URL or relative file path",
    errorText: "Should be a valid URL",
    pattern: "^(https?://|file://|..?/)[a-zA-Z0-9/%.?=-]*",
    class: "mdl-cell mdl-cell--6-col",
    innerClass: "wb",
  }).appendTo(parentDiv.element);

  // Increment the global index variable.
  index++;
}

/**
 * Assigns DOM elements to global variables and sets their values
 * to values read from saved settings.
 */
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
  while (webviews.length !== 0) {
    webviews[0].parentNode.parentNode.remove();
  }

  // Load webview settings
  utils.settings.webviews.forEach((e) => {
    addWebviewSetting("#webviews", e);
  });
}

/**
 * Add event listeners to buttons on settings page.
 */
function activateButtons() {
  const webviewButton = document.querySelector("#addwebview");
  const discardButton = document.querySelector("#discard");
  const saveButton = document.querySelector("#save");

  webviewButton.addEventListener("click", () => {
    addWebviewSetting("#webviews");
    // Register newly created button to MDL
    // eslint-disable-next-line no-undef
    componentHandler.upgradeAllRegistered();
  });

  discardButton.addEventListener("click", () => {
    loadSettingsInPage();
    // Register webview settings to MDL
    // eslint-disable-next-line no-undef
    componentHandler.upgradeAllRegistered();
  });

  saveButton.addEventListener("click", async () => {
    const snackbarContainer = document.querySelector("#settingssnackbar");
    const successData = {
      message: "Settings saved",
      timeout: 5000,
      actionHandler: () => {
        // Will close window and create it again
        // app.relaunch does not work with portable version
        ipcRenderer.send("reload");
      },
      actionText: "Reload app",
    };
    const failureData = {
      message: "Error, settings are not saved",
      timeout: 5000,
    };
    const settingsData = {
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
            arr.push({
              url: webviews[i].value,
              icon: webviews[i].parentNode.parentNode.firstChild.firstChild.innerHTML,
            });
          }
        }
        return arr;
      })(),
    };

    // Call utils.saveSettings and displays snackbar with success or failure message.
    try {
      await utils.saveSettings(settingsData);
      snackbarContainer.MaterialSnackbar.showSnackbar(successData);
    } catch (error) {
      snackbarContainer.MaterialSnackbar.showSnackbar(failureData);
    }
  });
}

// Add version info to footer.
function version() {
  document.querySelector("#version").innerText = utils.version;
}

// Main function running all sub-tasks.
function main() {
  loadSettingsInPage();
  activateButtons();
  version();
  createIconDialog();
}

// Start the main function when the page is ready.
onDocumentReady(main);
