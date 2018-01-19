const { ipcRenderer } = require("electron"); // eslint-disable-line
const ui = require("./ui");

/**
 * Add minimize, maximize and close buttons to titlebar.
 * @param {string|{}} parent Parent object, or a string for document.querySelector().
 * @param {"right"|"left"} side Side will translate to CSS class .right or .left.
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

module.exports = addWindowButtons;
