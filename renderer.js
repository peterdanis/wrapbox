const { shell, ipcRenderer } = require("electron");
const config = require("./config");

function insertWebview(index, src) {
  const webview = document.createElement("webview");
  webview.setAttribute("id", `webview${index}`);
  if (index === 0) {
    webview.setAttribute("class", "webview");
  } else {
    webview.setAttribute("class", "webview invisible");
  }
  webview.setAttribute("src", src);
  webview.setAttribute("allowpopups", "");
  content.appendChild(webview);
}

function insertButton(index, icon) {
  const button = document.createElement("button");
  const i = document.createElement("i");
  const activeButton = [
    "mdl-button",
    "mdl-button--primary",
    "mdl-button--fab",
    "mdl-js-button",
    "mdl-js-ripple-effect",
    "mdl-shadow--4dp",
    "mdl-color--cyan-800",
  ].join(" ");
  const inactiveButton = [
    "mdl-button",
    "mdl-button--primary",
    "mdl-button--fab",
    "mdl-js-button",
    "mdl-js-ripple-effect",
    "mdl-shadow--4dp",
    "mdl-color--cyan-A700",
  ].join(" ");

  button.setAttribute("id", `button${index}`);
  if (index === 0) {
    button.setAttribute("class", activeButton);
  } else {
    button.setAttribute("class", inactiveButton);
  }
  leftpanel.appendChild(button);
  i.setAttribute("class", "material-icons");
  i.innerText = icon;
  button.appendChild(i);
  button.addEventListener("click", () => {
    const allButtons = document.querySelectorAll("#leftpanel button");
    const allWebviews = document.querySelectorAll("#content webview");
    const webview = document.querySelector(button.id.replace("button", "#webview"));

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

function activateWindowButton() {
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

function run() {
  activateWindowButton();

  const content = document.querySelector("#content");
  const leftpanel = document.querySelector("#leftpanel");

  for (let i = 0; i < config.webviews.length; i++) {
    insertWebview(i, config.webviews[i][0]);
    insertButton(i, config.webviews[i][1]);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", (event) => {
    run();
  });
} else {
  run();
}
