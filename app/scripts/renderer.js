/* eslint-env node, browser */
const { shell, ipcRenderer } = require("electron");
const settings = require("./settings");
const ui = require("./ui");



function webviewShow(element) {
  element.setAttribute("class", "webview");
}

function webviewHide(element) {
  if (process.platform === "darwin") {
    element.setAttribute("class", "webview zinvisible");
  } else {
    element.setAttribute("class", "webview invisible");
  }
}

function insertWebview(index, src, parent) {
  const webview = document.createElement("webview");
  webview.setAttribute("id", `webview${index}`);
  if (index === 0) {
    webviewShow(webview);
  } else {
    webviewHide(webview);
  }
  webview.setAttribute("src", src);
  webview.setAttribute("allowpopups", "");
  webview.addEventListener("console-message", (event) => {
    console.log(`${src} console message:`, event.message);
  });
  webview.addEventListener("new-window", (event) => {
    if (event.disposition !== "new-window") {
      shell.openExternal(event.url);
    }
  });
  parent.appendChild(webview);
}

function insertButton(index, icon, parent) {
  const button = document.createElement("button");
  const i = document.createElement("i");
  const activeButton = [
    "mdl-button",
    "mdl-button--fab",
    "mdl-js-button",
    "mdl-js-ripple-effect",
    "mdl-shadow--4dp",
    "mdl-color--cyan-800",
    "mdl-color-text--white",
  ].join(" ");
  const inactiveButton = [
    "mdl-button",
    "mdl-button--fab",
    "mdl-js-button",
    "mdl-js-ripple-effect",
    "mdl-shadow--4dp",
    "mdl-color--cyan-A700",
    "mdl-color-text--white",
  ].join(" ");

  button.setAttribute("id", `button${index}`);
  if (index === 0) {
    button.setAttribute("class", activeButton);
  } else {
    button.setAttribute("class", inactiveButton);
  }
  parent.appendChild(button);
  i.setAttribute("class", "material-icons");
  i.innerText = icon;
  button.appendChild(i);
  button.addEventListener("click", () => {
    const allButtons = document.querySelectorAll("#leftpanel button");
    const allWebviews = document.querySelectorAll("#content webview");
    const webview = document.querySelector(button.id.replace("button", "#webview"));
    activeWebview = webview;
    allWebviews.forEach((element) => {
      webviewHide(element);
    });
    allButtons.forEach((element) => {
      element.setAttribute("class", inactiveButton);
    });
    button.setAttribute("class", activeButton);
    webviewShow(webview);
  });
}

/**
 * Add minimize, maximize and close buttons to titlebar.
 * @param {string} side
 */
function addWindowButtons(side) {
  // Create containing div.
  const windowButtonsSection = new ui.BaseElement({ type: "div", class: side }).appendTo("#titlebar");
  const windowButtons = [
    // Minimize button.
    new ui.Button({
      id: "minimize",
      innerHTML: new ui.MaterialIcon({ innerHTML: "expand_more" }).element.outerHTML,
      textColor: "white",
    }),
    // Maximize button.
    new ui.Button({
      id: "maximize",
      innerHTML: new ui.MaterialIcon({ innerHTML: "expand_less" }).element.outerHTML,
      textColor: "white",
    }),
    // Close button.
    new ui.Button({
      id: "close",
      innerHTML: new ui.MaterialIcon({ innerHTML: "close" }).element.outerHTML,
      textColor: "white",
    }),
  ];
  // Append each button to the containing div and add onclick event listeners.
  windowButtons.forEach((button) => {
    button.appendTo(windowButtonsSection.element);
    button.addEventListener("click", () => {
      // Send events to main thread.
      ipcRenderer.send(button.element.id);
    });
  });
}

/**
 * Add page navigation buttons to titlebar.
 * @param {string} side
 */
function addNavigationButtons(side) {
  // Create containing div.
  const navigationButtonsSection = new ui.BaseElement({ type: "div", class: side }).appendTo("#titlebar");
  const navigationButtons = [
    // Back button.
    new ui.Button({
      id: "back",
      innerHTML: new ui.MaterialIcon({ innerHTML: "navigate_before" }).element.outerHTML,
      textColor: "white",
    }),

    // Home button.
    new ui.Button({
      id: "home",
      innerHTML: new ui.MaterialIcon({ innerHTML: "home" }).element.outerHTML,
      textColor: "white",
    }),
    // Reload button.
    new ui.Button({
      id: "reload",
      innerHTML: new ui.MaterialIcon({ innerHTML: "refresh" }).element.outerHTML,
      textColor: "white",
    }),
    // Forward button.
    new ui.Button({
      id: "forward",
      innerHTML: new ui.MaterialIcon({ innerHTML: "navigate_next" }).element.outerHTML,
      textColor: "white",
    }),
  ];
  // Append each button to the containing div and add onclick event listeners.
  navigationButtons.forEach((button) => {
    button.appendTo(navigationButtonsSection.element);
    button.addEventListener("click", () => {
      // TODO
    });
  });
}

// Main function running all sub-tasks.
function start() {
  addWindowButtons(settings.windowButtonsPosition);
  addNavigationButtons(settings.windowButtonsPosition === "right" ? "left" : "right");

  const content = document.querySelector("#content");
  const leftpanel = document.querySelector("#leftpanel");

  for (let i = 0; i < settings.webviews.length; i++) {
    insertWebview(i, settings.webviews[i][0], content);
    insertButton(i, settings.webviews[i][1], leftpanel);
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
