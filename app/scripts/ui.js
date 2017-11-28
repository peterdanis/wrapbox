/* eslint-env node, browser */

class BasicElement {
  constructor(type, id) {
    this.element = null;
    this.type = type;
    this.id = id;
    this.parent = null;
    this.class = [];
  }

  create() {
    this.element = document.createElement(this.type);
    this.element.setAttribute("id", this.id);
    this.element.setAttribute("class", this.class.join(" "));
    return this;
  }

  appendTo(parent) {
    this.create();
    this.parent = document.querySelector(parent);
    this.parent.appendChild(this.element);
    return this;
  }
}

class Button extends BasicElement {
  /**
   *
  {string} id
  {string} text
  {string} color
  {*} textColor
   */
  constructor(id, text, color = "primary", textColor = "primary") {
    super("button", id);
    this.color = color;
    this.textColor = textColor;
    this.class = this.class.concat([
      "mdl-button",
      "mdl-js-button",
      `mdl-color--${color}`,
      `mdl--text-color--${textColor}`,
    ]);
  }
}

class FabButton extends Button {
  constructor(id, text, color = "primary", textColor = "primary") {
    super(id, color, textColor);
    this.class.push("mdl-button--fab");
  }
}

module.exports = {
  BasicElement,
  Button,
  FabButton,
};
