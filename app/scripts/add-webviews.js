const { shell } = require("electron"); // eslint-disable-line
const ui = require("./ui");

/**
 * Add a webview from settings.
 * @param {string|{}} parent Parent object, or a string for document.querySelector().
 * @param {{}[]} webviewSettings Array of objects, containing url and icon for creating webviews.
 */
function addWebviews(parent, webviewSettings, eventAggregator) {
  // Create webviews and store them in array
  const webviews = ui.arrayToElements(
    ui.Webview,
    webviewSettings.map((e, i) => ({
      id: `webview${i}`,
      src: e.url,
    })),
    { customAttr: ["allowpopups", "", "style", "display: flex-inline;"] }
  );
  // Append each webview to parent, hide it (except the first one) and add event listeners.
  webviews.forEach((webview, i) => {
    webview
      .hide()
      .appendTo(parent)
      .addEventListener("new-window", (event) => {
        if (event.disposition !== "new-window") {
          shell.openExternal(event.url);
        }
      })
      .addEventListener("console-message", (event) => {
        // eslint-disable-next-line no-console
        console.log(`${webview.element.src} console message:`, event.message);
      })
      .listenTo(eventAggregator, "changeWebview", (button) => {
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

module.exports = addWebviews;
