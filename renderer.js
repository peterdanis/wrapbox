/* eslint-env node, browser */
const { shell, ipcRenderer } = require("electron");
const config = require("./config");

let activeWebview;

function insertWebview(index, src, parent) {
  const webview = document.createElement("webview");
  webview.setAttribute("id", `webview${index}`);
  if (index === 0) {
    webview.setAttribute("class", "webview");
  } else {
    webview.setAttribute("class", "webview invisible");
  }
  webview.setAttribute("src", src);
  webview.setAttribute("allowpopups", "");
  webview.addEventListener("console-message", (event) => {
    console.log(`${webview.src} console message:`, event.message);
  });
  webview.addEventListener("new-window", (event) => {
    if (event.disposition !== "new-window") {
      shell.openExternal(event.url);
    }
  });
  parent.appendChild(webview);
}

function insertButton(index, icon, parent) {
  const button = document.createElement("button");
  const i = document.createElement("i");
  const activeButton = [
    "mdl-button",
    "mdl-button--fab",
    "mdl-js-button",
    "mdl-js-ripple-effect",
    "mdl-shadow--4dp",
    "mdl-color--cyan-800",
    "mdl-color-text--white",
  ].join(" ");
  const inactiveButton = [
    "mdl-button",
    "mdl-button--fab",
    "mdl-js-button",
    "mdl-js-ripple-effect",
    "mdl-shadow--4dp",
    "mdl-color--cyan-A700",
    "mdl-color-text--white",
  ].join(" ");

  button.setAttribute("id", `button${index}`);
  if (index === 0) {
    button.setAttribute("class", activeButton);
  } else {
    button.setAttribute("class", inactiveButton);
  }
  parent.appendChild(button);
  i.setAttribute("class", "material-icons");
  i.innerText = icon;
  button.appendChild(i);
  button.addEventListener("click", () => {
    const allButtons = document.querySelectorAll("#leftpanel button");
    const allWebviews = document.querySelectorAll("#content webview");
    const webview = document.querySelector(button.id.replace("button", "#webview"));
    activeWebview = webview;
    allWebviews.forEach((element) => {
      element.setAttribute("class", "webview invisible");
    });
    allButtons.forEach((element) => {
      element.setAttribute("class", inactiveButton);
    });
    button.setAttribute("class", activeButton);
    webview.setAttribute("class", "webview");
  });
}

function activateWindowButtons() {
  document.querySelector("#minimize").addEventListener("click", () => {
    ipcRenderer.send("minimize");
  });
  document.querySelector("#maximize").addEventListener("click", () => {
    ipcRenderer.send("maximize");
  });
  document.querySelector("#close").addEventListener("click", () => {
    ipcRenderer.send("close");
  });
}

function activateSettingsButton() {}

function activateNavigationButtons() {}

function run() {
  activateWindowButtons();

  const content = document.querySelector("#content");
  const leftpanel = document.querySelector("#leftpanel");

  for (let i = 0; i < config.webviews.length; i++) {
    insertWebview(i, config.webviews[i][0], content);
    insertButton(i, config.webviews[i][1], leftpanel);
  }

  activateSettingsButton();
  activateNavigationButtons();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    run();
  });
} else {
  run();
}
