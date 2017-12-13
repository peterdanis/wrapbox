/* eslint-env node, browser */
const { shell, ipcRenderer } = require("electron"); // eslint-disable-line
const settings = require("./settings");
const ui = require("./ui");
const Mediator = require("./mediator");
const EventEmitter = require("events");

const mediator = new Mediator();
const watcher = new EventEmitter();
/*
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
*/

/*
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
    console.log(`${src} console message:`, event.message); // eslint-disable-line no-console
  });
  webview.addEventListener("new-window", (event) => {
    if (event.disposition !== "new-window") {
      shell.openExternal(event.url);
    }
  });
  parent.appendChild(webview);
}
*/

/**
 * TODO
 *
 */
function addNavigationButtons(parent) {
  // Create containing div.
  const navigationButtonsSection = new ui.BaseElement({
    type: "div",
    id: "navbuttons",
    class: "mdl-typography--text-right",
  })
    .appendTo(parent)
    .addEventListener("mouseleave", () =>
      navigationButtonsSection.element.setAttribute("class", "invisible"));
  // Create array with buttons
  const navigationButtons = ui.arrayToElements(
    ui.MiniFabButton,
    [
      {
        id: "back",
        innerHTML: new ui.MaterialIcon({ innerHTML: "navigate_before" }).element.outerHTML,
      },
      {
        id: "home",
        innerHTML: new ui.MaterialIcon({ innerHTML: "home" }).element.outerHTML,
      },
      {
        id: "reload",
        innerHTML: new ui.MaterialIcon({ innerHTML: "refresh" }).element.outerHTML,
      },
      {
        id: "forward",
        innerHTML: new ui.MaterialIcon({ innerHTML: "navigate_next" }).element.outerHTML,
      },
    ],
    {
      textColor: "white",
      color: "cyan-A400",
      class: "mdl-shadow--4dp",
    }
  );
  // Append each button to the containing div and add onclick event listeners.
  navigationButtons.forEach((button) => {
    button.appendTo(navigationButtonsSection.element);
    button.addEventListener("click", () => {
      // TODO
    });
  });
}

/*
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
  button.addEventListener("contextmenu", () => {
    // TODO
    if (true) {
      addNavigationButtons(button);
    }
  });
  button.addEventListener("click", () => {
    const allButtons = document.querySelectorAll("#leftpanel button");
    const allWebviews = document.querySelectorAll("#content webview");
    const webview = document.querySelector(button.id.replace("button", "#webview"));
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
*/

/**
 * Add minimize, maximize and close buttons to titlebar.
 * @param {string|{}} parent Parent object, or a string for document.querySelector().
 * @param {"right"|"left"} side Side will translate to CSS class .right or .left
 */
function addWindowButtons(parent, side) {
  // Create containing div.
  const windowButtonsSection = new ui.BaseElement({ type: "div", class: side }).appendTo(parent);
  // Create array with window buttons
  const windowButtons = ui.arrayToElements(
    ui.Button,
    [
      {
        id: "minimize",
        innerHTML: new ui.MaterialIcon({ innerHTML: "expand_more" }).element.outerHTML,
      },
      {
        id: "maximize",
        innerHTML: new ui.MaterialIcon({ innerHTML: "expand_less" }).element.outerHTML,
      },
      {
        id: "close",
        innerHTML: new ui.MaterialIcon({ innerHTML: "close" }).element.outerHTML,
      },
    ],
    { textColor: "white" }
  );
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
 * TODO
 * @param {string|{}} parent Parent object, or a string for document.querySelector().
 * @param {{}[]} webviewSettings Array of objects, containing url and icon for creating webviews.
 */
function addWebviews(parent, webviewSettings) {
  webviewSettings.forEach((e, i) => {
    new ui.BaseElement({
      type: "webview",
      id: `webview${i}`,
      class: "webview",
      customAttr: ["src", e.url],
    }).appendTo(parent);
  });
}

/**
 * TODO
 * @param {string|{}} parent Parent object, or a string for document.querySelector().
 * @param {{}[]} webviewSettings Array of objects, containing url and icon for creating webviews.
 */
function addWebviewButtons(parent, webviewSettings) {
  const webviewButtons = ui.arrayToElements(
    ui.FabButton,
    webviewSettings.map((e, i) => ({
      id: `button${i}`,
      innerHTML: new ui.MaterialIcon({ innerHTML: e.icon }).element.outerHTML,
    })),
    { class: "mdl-shadow--4dp", color: "blue-A200", textColor: "white" }
  );
  webviewButtons.forEach((button) => {
    button
      .addRipple()
      .addEventListener("click", (event) => {
        watcher.emit("changeWebview", event.currentTarget);
      })
      .appendTo(parent);
  });
}

// Main function running all sub-tasks.
function start() {
  addWindowButtons("#titlebar", settings.windowButtonsPosition);
  addWebviews("#content", settings.webviews);
  addWebviewButtons("#leftpanel", settings.webviews);
}

// Start the main function when the page is ready.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    start();
  });
} else {
  start();
}
