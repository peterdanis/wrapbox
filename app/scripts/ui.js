/* eslint-env node, browser */

class Element {
  /**
   * Creates basic DOM element
   * @param {string} type Element type, e.g. button
   * @param {string} id Element id
   * @param {string}
   */
  constructor(type, id, cls) {
    this.element = document.createElement(type);
    if (id) {
      this.element.setAttribute("id", id);
    }
    switch (true) {
      case typeof cls === "string":
        this.element.setAttribute("class", cls);
        break;
      case Array.isArray(cls):
        this.element.setAttribute("class", cls.join(" "));
        break;
      default:
        break;
    }
  }

  /**
   * Appends to a DOM node
   * @param {string} parent Parent node
   */
  appendTo(parent) {
    if (typeof parent === "object") {
      parent.appendChild(this.element);
    } else {
      document.querySelector(parent).appendChild(this.element);
    }
    return this;
  }
}

class Button extends Element {
  /**
   * @param {string} id Element id
   * @param {string | string[]} buttonText Text or array, where first element
   * being material-icon and rest the button text
   * @param {string} color MDL color, e.g. "light-blue-A700"
   * @param {string} textColor MDL color, e.g. "light-blue-A700"
   */
  constructor(id, buttonText, color = "primary", textColor = "primary") {
    const cls = [
      "mdl-button",
      "mdl-js-button",
      `mdl-color--${color}`,
      `mdl--text-color--${textColor}`,
    ];
    super("button", id, cls);
    switch (true) {
      case typeof buttonText === "string":
        this.element.innerText = buttonText;
        break;

      case Array.isArray(buttonText):
        const icon = new Element("i", "", "material-icons");
        icon.element.innerText = buttonText[0];
console.log(icon)
        this.element.innerText = icon.element.outerHTML + buttonText[1];
        break;

      default:
        break;
    }
  }
}

class FabButton extends Button {
  /**
   * @param {string} id Element id
   * @param {string | string[]} buttonText Text or array, where first element
   * being material-icon and rest the button text
   * @param {string} color MDL color, e.g. "light-blue-A700"
   * @param {string} textColor MDL color, e.g. "light-blue-A700"
   */
  constructor(id, buttonText, color = "primary", textColor = "primary") {
    super(id, buttonText, color, textColor);
    this.element.classList.add("mdl-button--fab");
  }
}

class IconButton extends Button {
  /**
   * @param {string} id Element id
   * @param {string | string[]} buttonText Text or array, where first element
   * being material-icon and rest the button text
   * @param {string} color MDL color, e.g. "light-blue-A700"
   * @param {string} textColor MDL color, e.g. "light-blue-A700"
   */
  constructor(id, buttonText, color = "primary", textColor = "primary") {
    super(id, buttonText, color, textColor);
    this.element.classList.add("mdl-button--icon");
  }
}

module.exports = {
  Element,
  Button,
  FabButton,
  IconButton,
};
