const ui = require("./ui");

function createContainer(parent, eventAggregator, index) {
  const container = new ui.BaseElement({
    type: "div",
    id: `nbdiv${index}`,
    class: "navbuttons mdl-typography--text-right",
    style: `top: ${parent.getBoundingClientRect().top + 13}px;`,
  });
  container
    .hide()
    .appendTo(parent)
    .listenTo(eventAggregator, "showNavButtons", (buttonContainer) => {
      // Show navbuttons only for webview button with .active class
      if (parent.firstElementChild.classList.contains("active") && parent === buttonContainer) {
        container.show();
      }
    })
    .listenTo(eventAggregator, "hideNavButtons", () => {
      container.hide();
    });
  return container;
}

function createButtons() {
  const buttons = ui.arrayToElements(
    ui.FabButton,
    [
      {
        innerHTML: new ui.MaterialIcon({ innerHTML: "navigate_before" }).element.outerHTML,
        wh: {
          method: "goBack",
        },
      },
      {
        innerHTML: new ui.MaterialIcon({ innerHTML: "home" }).element.outerHTML,
        wh: {
          method: "goToIndex",
          arg: 0,
        },
      },
      {
        innerHTML: new ui.MaterialIcon({ innerHTML: "refresh" }).element.outerHTML,
        wh: {
          method: "reload",
        },
      },
      {
        innerHTML: new ui.MaterialIcon({ innerHTML: "navigate_next" }).element.outerHTML,
        wh: {
          method: "goForward",
        },
      },
    ],
    {
      textColor: "white",
      color: "blue-grey-700",
      class: "mdl-shadow--8dp",
    }
  );
  return buttons;
}

/**
 * Add webview navigation buttons to each webview button.
 * @param {string|{}} parent Parent object, or a string for document.querySelector().
 */
function addNavigationButtons(parent, eventAggregator, index) {
  // Create containing div.
  const navigationButtonsSection = createContainer(parent, eventAggregator, index);

  // Create array with buttons.
  const navigationButtons = createButtons();

  // Append each button to the containing div and add onclick event listeners.
  navigationButtons.forEach((button) => {
    const connectedWebview = document.querySelector(`#${parent.id.replace("wbdiv", "webview")}`);
    button
      .appendTo(navigationButtonsSection.element)
      .addRipple()
      .addEventListener("click", () => {
        connectedWebview[button.wh.method](button.wh.arg);
      });
  });
}

module.exports = addNavigationButtons;
