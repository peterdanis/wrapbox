class BaseElement {
  /**
   * Creates any non-specialized element
   * @param {object} options - Options object
   * @param {string} options.type - Type of element (a.k.a. tag)
   * @param {string} [options.id] - Element id
   * @param {string} [options.class] - Element class
   * @param {string} [options.innerHTML] - Element innerHTML
   */
  constructor(options) {
    this.element = document.createElement(options.type);
    if (options.id) {
      this.element.setAttribute("id", options.id);
    }
    if (options.class) {
      this.element.setAttribute("class", options.class);
    }
    if (options.innerHTML) {
      this.element.innerHTML = options.innerHTML;
    }
  }

  /**
   * Appends to a DOM node or element
   * @param {{}|string} parent Parent object, or a string for document.querySelector()
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

class Button extends BaseElement {
  /**
   * Creates an MDL button
   * @param {object} options - Options object
   * @param {string} [options.id] - Element id
   * @param {string} [options.class] - Element class
   * @param {string} [options.innerHTML] - Element innerHTML
   * @param {string} [options.color] - Button color
   * @param {string} [options.textColor] - Button text color
   */
  constructor(options) {
    options.type = "button";
    options.class = (options.class && `${options.class} `) || "";
    console.log(options);
    options.class += "mdl-button mdl-js-button";
    console.log(options);
    if (options.color) {
      options.class += ` mdl-color--${options.color}`;
    }
    if (options.textColor) {
      options.class += ` mdl-color-text--${options.textColor}`;
    }
    super(options);
  }

  addRipple() {
    this.element.classList.add("mdl-js-ripple-effect");
    return this;
  }
}

class FabButton extends Button {
  constructor(options) {
    super(options);
    this.element.classList.add("mdl-button--fab");
  }
}

class IconButton extends Button {
  constructor(options) {
    super(options);
    this.element.classList.add("mdl-button--icon");
  }
}

module.exports = {
  BaseElement,
  Button,
  FabButton,
  IconButton,
};
