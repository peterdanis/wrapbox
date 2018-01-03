/* eslint-env node, browser */
const { shell, ipcRenderer } = require("electron"); // eslint-disable-line
const settings = require("./settings");
const ui = require("./ui");
const EventEmitter = require("events");

const watcher = new EventEmitter();

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
  const webviews = ui.arrayToElements(
    ui.Webview,
    webviewSettings.map((e, i) => ({
      id: `webview${i}`,
      src: e.url,
    })),
    { customAttr: ["allowpopups", ""] }
  );
  webviews.forEach((webview, i) => {
    webview
      .appendTo(parent)
      .hide()
      .addEventListener("new-window", (event) => {
        if (event.disposition !== "new-window") {
          shell.openExternal(event.url);
        }
      })
      .listenTo(watcher, "changeWebview", (button) => {
        console.log(webview);
        // eslint-disable-next-line eqeqeq
        if (button.id.replace("button", "") == i) {
          webview.show();
          webview.element.classList.add("fadeIn");
        } else {
          webview.hide();
          webview.element.classList.remove("fadeIn");
        }
      });
    if (i === 0) {
      webview.show();
    }
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
      .addEventListener("mouseover", (event) => {
        // TODO
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
