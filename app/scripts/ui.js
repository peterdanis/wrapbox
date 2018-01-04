/**
 * Creates array of elements combining individual their and common properties.
 * @param {*} ElementClass BaseElement or one of its subclasses.
 * @param {{}[]} [elements] An array of individual BaseElement constructor parameters.
 * @param {{}} [commonOptions] BaseElement constructor parameters, common for all elements.
 * @returns A new array of constructed BaseElement or of its subclasses elements.
 */
function arrayToElements(ElementClass, elements, commonOptions) {
  // Object.assign() combines an empty object, object in elements array and commonOptions object.
  return (elements || []).map(e => new ElementClass(Object.assign({}, e, commonOptions)));
}

class BaseElement {
  /**
   * Creates any non-specialized element.
   * @param {object} options
   * @param {string} options.type
   * @param {string} [options.id]
   * @param {string} [options.class]
   * @param {string} [options.style]
   * @param {string} [options.innerHTML]
   * @param {string[]} [options.customAttr]
   */
  constructor(options) {
    this.element = document.createElement(options.type);
    if (options.id) {
      this.element.setAttribute("id", options.id);
    }
    if (options.class) {
      this.element.setAttribute("class", options.class);
    }
    if (options.style) {
      this.element.setAttribute("style", options.style);
    }
    if (options.innerHTML) {
      this.element.innerHTML = options.innerHTML;
    }
    if (options.customAttr) {
      for (let i = 0; i < options.customAttr.length; i += 2) {
        this.element.setAttribute(options.customAttr[i], options.customAttr[i + 1]);
      }
    }
  }

  /**
   * Appends to a DOM node or element. Chainable.
   * @param {{}|string} parent Parent object, or a string for document.querySelector().
   * @returns this
   */
  appendTo(parent) {
    if (typeof parent === "object") {
      parent.appendChild(this.element);
    } else {
      document.querySelector(parent).appendChild(this.element);
    }
    return this;
  }

  /**
   * Add event listener. Chainable.
   * @param {HTMLElementEventMap} type Event listener type.
   * @param {function} listener Executed after the event fires.
   */
  addEventListener(type, listener) {
    this.element.addEventListener(type, listener);
    return this;
  }

  listenTo(emitter, message, fn) {
    emitter.on(message, fn);
    return this;
  }
}

class Button extends BaseElement {
  /**
   * Creates an MDL button.
   * @param {object} options
   * @param {string} [options.id]
   * @param {string} [options.class]
   * @param {string} [options.style]
   * @param {string} [options.innerHTML]
   * @param {string} [options.color]
   * @param {string} [options.textColor]
   * @param {string[]} [options.customAttr]
   */
  constructor(options) {
    /* eslint-disable no-param-reassign */
    options.type = "button";
    options.class = (options.class && `${options.class} `) || "";
    options.class += "mdl-button mdl-js-button";
    if (options.color) {
      options.class += ` mdl-color--${options.color}`;
    }
    if (options.textColor) {
      options.class += ` mdl-color-text--${options.textColor}`;
    }
    /* eslint-enable no-param-reassign */
    super(options);
  }

  /**
   * Add ripple effect to button. Chainable.
   * @returns this
   */
  addRipple() {
    this.element.classList.add("mdl-js-ripple-effect");
    return this;
  }
}

class FabButton extends Button {
  /**
   * Creates a floating MDL button.
   * @param {object} options
   * @param {string} [options.id]
   * @param {string} [options.class]
   * @param {string} [options.style]
   * @param {string} [options.innerHTML]
   * @param {string} [options.color]
   * @param {string} [options.textColor]
   * @param {string[]} [options.customAttr]
   */
  constructor(options) {
    super(options);
    this.element.classList.add("mdl-button--fab");
  }
}

class MiniFabButton extends FabButton {
  /**
   * Creates a smaller floating MDL button.
   * @param {object} options
   * @param {string} [options.id]
   * @param {string} [options.class]
   * @param {string} [options.style]
   * @param {string} [options.innerHTML]
   * @param {string} [options.color]
   * @param {string} [options.textColor]
   * @param {string[]} [options.customAttr]
   */
  constructor(options) {
    super(options);
    this.element.classList.add("mdl-button--mini-fab");
  }
}

class IconButton extends Button {
  /**
   * Creates an icon MDL button.
   * @param {object} options
   * @param {string} [options.id]
   * @param {string} [options.class]
   * @param {string} [options.style]
   * @param {string} [options.innerHTML]
   * @param {string} [options.color]
   * @param {string} [options.textColor]
   * @param {string[]} [options.customAttr]
   */
  constructor(options) {
    super(options);
    this.element.classList.add("mdl-button--icon");
  }
}

class MaterialIcon extends BaseElement {
  /**
   * Creates a material-icons icon.
   * @param {object} options
   * @param {string} [options.id]
   * @param {string} [options.class]
   * @param {string} [options.style]
   * @param {string} [options.innerHTML]
   * @param {string} [options.fontSize]
   * @param {string[]} [options.customAttr]
   */
  constructor(options) {
    /* eslint-disable no-param-reassign */
    options.type = "i";
    options.class = (options.class && `${options.class} `) || "";
    options.class += "material-icons";
    if (options.fontSize) {
      options.style = (options.style && `${options.style} `) || "";
      options.style += `font-size: ${options.fontSize};`;
    }
    /* eslint-enable no-param-reassign */
    super(options);
  }
}

class Webview extends BaseElement {
  /**
   * Creates a webview.
   * @param {object} options
   * @param {string} [options.id]
   * @param {string} [options.class]
   * @param {string} [options.style]
   * @param {string} [options.innerHTML]
   * @param {string[]} [options.customAttr]
   */
  constructor(options) {
    /* eslint-disable no-param-reassign */
    options.type = "webview";
    options.customAttr = options.customAttr || [];
    options.customAttr.push("src", options.src);
    /* eslint-enable no-param-reassign */
    super(options);
  }

  /**
   * Hide the webview. Chainable.
   * @returns this
   */
  hide() {
    if (process.platform === "darwin") {
      this.element.classList.add("hidden");
    } else {
      this.element.classList.add("invisible");
    }
    return this;
  }

  /**
   * Show the webview. Chainable.
   * @returns this
   */
  show() {
    if (process.platform === "darwin") {
      this.element.classList.remove("hidden");
    } else {
      this.element.classList.remove("invisible");
    }
    return this;
  }
}

module.exports = {
  arrayToElements,
  BaseElement,
  Button,
  FabButton,
  MiniFabButton,
  IconButton,
  MaterialIcon,
  Webview,
};
