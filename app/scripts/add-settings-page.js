const ui = require("./ui");
const settings = require("./settings");

function addSettingsPage(eventAggregator) {
  settings.webviews.push({ url: "../pages/settings.html" });

  const settingsButton = new ui.IconButton({
    id: `button${settings.webviews.length - 1}`,
    class: "settingsButton fadeInLeft",
    innerHTML: new ui.MaterialIcon({ innerHTML: "settings" }).element.outerHTML,
    textColor: "grey-500",
  });
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
}

module.exports = addSettingsPage;
