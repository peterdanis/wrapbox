const ui = require("./ui");
const addNavigationButtons = require("./add-navigation-buttons");

/**
 * Add a button for each webview (from settings).
 * @param {string|{}} parent Parent object, or a string for document.querySelector().
 * @param {{}[]} webviewSettings Array of objects, containing url and icon for creating webviews.
 */
function addWebviewButtons(parent, webviewSettings, eventAggregator) {
  // Create buttons and store them in array.
  const webviewButtons = ui.arrayToElements(
    ui.FabButton,
    webviewSettings.map((e, i) => ({
      id: `button${i}`,
      innerHTML: new ui.MaterialIcon({ innerHTML: e.icon }).element.outerHTML,
    })),
    { class: "mdl-shadow--4dp", color: "blue-A200", textColor: "white" }
  );
  // Append each button to parent, add effects and event listeners.
  webviewButtons.forEach((button, i) => {
    button
      .addRipple()
      .addEventListener("click", (event) => {
        eventAggregator.emit("changeWebview", event.currentTarget);
      })
      .addEventListener("mouseover", (event) => {
        eventAggregator.emit("showNavButtons", event.currentTarget);
      })
      .addEventListener("mouseleave", (event) => {
        eventAggregator.emit("hideNavButtons", event.currentTarget);
      })
      .appendTo(parent)
      .listenTo(eventAggregator, "changeWebview", (_button) => {
        if (_button === button.element) {
          button.element.classList.add("active");
        } else {
          button.element.classList.remove("active");
        }
      });
    if (i === 0) {
      button.element.classList.add("active");
    }
    // Add webview navigation section to each button.
    addNavigationButtons(button.element, eventAggregator);
  });
}

module.exports = addWebviewButtons;
