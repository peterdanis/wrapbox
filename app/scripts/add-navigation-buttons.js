const ui = require("./ui");

/**
 * Add webview navigation buttons to each webview button.
 * @param {string|{}} parent Parent object, or a string for document.querySelector().
 */
function addNavigationButtons(parent, eventAggregator) {
  // Create containing div.
  const navigationButtonsSection = new ui.BaseElement({
    type: "div",
    id: "navbuttons",
    class: "mdl-typography--text-right",
  })
    .hide()
    .appendTo(parent)
    .listenTo(eventAggregator, "showNavButtons", (buttonContainer) => {
      // Show navbuttons only for webview button with .active class and set position
      if (parent.firstElementChild.classList.contains("active") && parent === buttonContainer) {
        navigationButtonsSection.element.style.top = `${buttonContainer.getBoundingClientRect()
          .top + 13}px`;
        navigationButtonsSection.element.style.left = `${
          buttonContainer.getBoundingClientRect().left
        }px`;
        navigationButtonsSection.show();
      }
    })
    .listenTo(eventAggregator, "hideNavButtons", () => {
      navigationButtonsSection.hide();
    });

  // Create array with buttons.
  const navigationButtons = ui.arrayToElements(
    ui.FabButton,
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
      color: "blue-grey-700",
      class: "mdl-shadow--8dp",
    }
  );

  // Append each button to the containing div and add onclick event listeners.
  navigationButtons.forEach((button) => {
    button
      .appendTo(navigationButtonsSection.element)
      .addEventListener("click", (event) => {
        // eslint-disable-next-line default-case
        switch (event.currentTarget.id) {
          case "back":
            document.querySelector(`#${parent.id.replace("wbdiv", "webview")}`).goBack();
            break;
          case "home":
            document.querySelector(`#${parent.id.replace("wbdiv", "webview")}`).goToIndex(0);
            break;
          case "reload":
            document.querySelector(`#${parent.id.replace("wbdiv", "webview")}`).reload();
            break;
          case "forward":
            document.querySelector(`#${parent.id.replace("wbdiv", "webview")}`).goForward();
            break;
        }
      })
      .addRipple();
  });
}

module.exports = addNavigationButtons;
