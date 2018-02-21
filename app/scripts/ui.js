/**
 * Creates array of elements combining individual and common properties.
 * @param {*} ElementClass BaseElement or one of its subclasses.
 * @param {{}[]} [elements] An array of individual BaseElement constructor parameters.
 * @param {{}} [commonOptions] BaseElement constructor parameters, common for all elements.
 * @returns A new array of constructed BaseElement or of its subclasses elements.
 */
function arrayToElements(ElementClass, elements, commonOptions) {
  // Object.assign() combines an empty object, object in elements array and commonOptions object.
  return (elements || []).map((e) => {
    if (e.wh && commonOptions.wh) {
      Object.assign(e.wh, commonOptions.wh);
    }
    return new ElementClass(Object.assign({}, commonOptions, e));
  });
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
   * @param {{}} [options.wh]
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
    this.wh = options.wh || {};
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

  hideClass() {
    // On macOS visibility: hidden is causing bugs in webview
    if (this.element.tagName === "WEBVIEW" && process.platform === "darwin") {
      return "zinvisible";
    }
    return "invisible";
  }

  /**
   * Hide the element. Chainable.
   * @returns this
   */
  hide() {
    this.element.classList.add(this.hideClass());
    return this;
  }

  /**
   * Show the element. Chainable.
   * @returns this
   */
  show() {
    this.element.classList.remove(this.hideClass());
    return this;
  }
}

class Button extends BaseElement {
  /**
   * Creates a MDL button.
   * @param {object} options
   * @param {string} [options.id]
   * @param {string} [options.class]
   * @param {string} [options.style]
   * @param {string} [options.innerHTML]
   * @param {string} [options.color]
   * @param {string} [options.textColor]
   * @param {string[]} [options.customAttr]
   * @param {{}} [options.wh]
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
   * @param {{}} [options.wh]
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
   * @param {{}} [options.wh]
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
   * @param {{}} [options.wh]
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
   * @param {{}} [options.wh]
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
   * @param {{}} [options.wh]
   */
  constructor(options) {
    /* eslint-disable no-param-reassign */
    options.type = "webview";
    options.customAttr = options.customAttr || [];
    options.customAttr.push("src", options.src);
    /* eslint-enable no-param-reassign */
    super(options);
  }
}

class TextField extends BaseElement {
  /**
   * Creates a MDL textfield.
   * @param {object} options
   * @param {string} [options.id]
   * @param {string} [options.class]
   * @param {string} [options.style]
   * @param {string} [options.innerHTML]
   * @param {string[]} [options.customAttr]
   * @param {string} [options.innerId]
   * @param {string} [options.innerClass]
   * @param {string} [options.pattern]
   * @param {string} [options.value]
   * @param {string} [options.text]
   * @param {string} [options.errorText]
   * @param {{}} [options.wh]
   */
  constructor(options) {
    /* eslint-disable no-param-reassign */
    options.type = "div";
    options.class = (options.class && `${options.class} `) || "";
    options.class += "mdl-textfield mdl-js-textfield";
    options.innerClass = (options.innerClass && `${options.innerClass} `) || "";
    options.innerClass += "mdl-textfield__input";
    /* eslint-enable no-param-reassign */
    super(options);
    new BaseElement({
      type: "input",
      id: options.innerId,
      class: options.innerClass,
      customAttr: ["type", "text", "pattern", options.pattern || "", "value", options.value || ""],
    }).appendTo(this.element);
    new BaseElement({
      type: "label",
      class: "mdl-textfield__label",
      customAttr: ["for", options.innerId],
      innerHTML: options.text,
    }).appendTo(this.element);
    new BaseElement({
      type: "span",
      class: "mdl-textfield__error",
      innerHTML: options.errorText,
    }).appendTo(this.element);
  }
}

module.exports = {
  arrayToElements,
  BaseElement,
  Button,
  FabButton,
  IconButton,
  MaterialIcon,
  MiniFabButton,
  TextField,
  Webview,
};
