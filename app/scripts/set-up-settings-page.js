const ui = require("./ui");
const utils = require("electron").remote.require("./scripts/utils"); // eslint-disable-line

function setUpSettingsPage(eventAggregator) {
  // Webview is already inserted by addWebviews function
  const settingsWebview = document.querySelector(`#webview${utils.webviews.length}`);

  // Create settings button
  const settingsButton = new ui.IconButton({
    id: `button${utils.webviews.length}`,
    class: "settingsButton fadeInLeft",
    innerHTML: new ui.MaterialIcon({ innerHTML: "settings" }).element.outerHTML,
    textColor: "grey-500",
  });

  // Append it to body, add efects and listeners
  settingsButton
    .appendTo("body")
    .addRipple()
    .addEventListener("click", (event) => {
      eventAggregator.emit("changeWebview", event.currentTarget);
    })
    .listenTo(eventAggregator, "changeWebview", (button) => {
      if (button === settingsButton.element) {
        settingsButton.element.classList.add("active");
      } else {
        settingsButton.element.classList.remove("active");
      }
    });

  // Nodeintegration is needed for require and fs to work
  settingsWebview.setAttribute("nodeintegration", "");
}

module.exports = setUpSettingsPage;
