const addNavigationButtons = require("./add-navigation-buttons");
const ui = require("./ui");

/**
 * Add a button for each webview (from settings).
 * @param {string|{}} parent Parent object, or a string for document.querySelector().
 * @param {{}[]} webviewSettings Array of objects, containing url and icon for creating webviews.
 */
function addWebviewButtons(parent, webviewSettings, eventAggregator) {
  // Create container divs and store them in array.
  // This step is need for ripple effect to work properly.
  const wbcontainers = ui.arrayToElements(
    ui.BaseElement,
    webviewSettings.map((e, i) => ({
      type: "div",
      id: `wbdiv${i}`,
    })),
    { class: "wbcontainer" }
  );

  // Append each container div to parent and add event listeners.
  wbcontainers.forEach((div) => {
    div
      .appendTo(parent)
      .addEventListener("mouseover", (event) => {
        eventAggregator.emit("showNavButtons", event.currentTarget);
      })
      .addEventListener("mouseleave", (event) => {
        eventAggregator.emit("hideNavButtons", event.currentTarget);
      });
  });

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
      .appendTo(wbcontainers[i].element)
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
    addNavigationButtons(wbcontainers[i].element, eventAggregator, i);
  });
}

module.exports = addWebviewButtons;
