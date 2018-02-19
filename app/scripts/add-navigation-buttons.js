const ui = require("./ui");

/**
 * Add webview navigation buttons to each webview button.
 * @param {string|{}} parent Parent object, or a string for document.querySelector().
 */
function addNavigationButtons(parent, eventAggregator, index) {
  // Create containing div.
  const navigationButtonsSection = new ui.BaseElement({
    type: "div",
    id: `nbdiv${index}`,
    class: "navbuttons mdl-typography--text-right",
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
        innerHTML: new ui.MaterialIcon({ innerHTML: "navigate_before" }).element.outerHTML,
      },
      {
        innerHTML: new ui.MaterialIcon({ innerHTML: "home" }).element.outerHTML,
      },
      {
        innerHTML: new ui.MaterialIcon({ innerHTML: "refresh" }).element.outerHTML,
      },
      {
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
      .addRipple()
      .addEventListener("click", (event) => {
        const connectedWebview = document.querySelector(`#${parent.id.replace("wbdiv", "webview")}`);
        // eslint-disable-next-line default-case
        switch (event.currentTarget.innerText) {
          case "navigate_before":
            connectedWebview.goBack();
            break;
          case "home":
            connectedWebview.goToIndex(0);
            break;
          case "refresh":
            connectedWebview.reload();
            break;
          case "navigate_next":
            connectedWebview.goForward();
            break;
        }
      });
  });
}

module.exports = addNavigationButtons;
