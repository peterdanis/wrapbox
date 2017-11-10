const { shell, ipcRenderer } = require("electron");
const config = require("./config.js");

let content;
let leftpanel;

function insertWebview(index, src) {
  const webview = document.createElement("webview");
  const button = document.createElement("button");
  webview.setAttribute("id", `webview${index}`);
  webview.setAttribute("class", "webview");
  webview.setAttribute("src", src);
  webview.setAttribute("allowpopups", "");
  content.appendChild(webview);
}

function insertButton(index, icon) {
  const button = document.createElement("button");
  button.setAttribute("id", `button${index}`);
  button.setAttribute("class", "mdl-button mdl-button--accent mdl-button-fab");
  leftpanel.appendChild(button);
}

function run() {
  content = document.querySelector("#content");
  leftpanel = document.querySelector("#leftpanel");

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

/*
$(() => {
  // TODO FramelessWindow
  // if (process.platform === "win32") {
  //   $("#titlebar").addClass("hidden");
  //   $("#main").addClass("heightcorrection");
  // }

  $("#sidepanel .btn").click((event) => {
    $("webview").addClass("hidden");
    $(`#${$(event.currentTarget).data("target")}`).removeClass("hidden");
    $("#sidepanel .btn").removeClass("active");
    $(event.currentTarget).addClass("active");
  });

  $($("webview").on("new-window", (event) => {
    try {
      // event.preventDefault();
      // TODO Allow user to choose whether to open
      // in external browser or in the same electron window
      if (event.originalEvent.disposition !== "new-window") {
        shell.openExternal(event.originalEvent.url);
      }
      // else {
      //   $(event.currentTarget).attr("src", event.originalEvent.url);
      // }
    } catch (error) {
      console.log(`Ignoring ${event} due to ${error.message}`);
    }
  }));

  $("#minimize").click(() => {
    ipcRenderer.send("minimize");
  });
  $("#maximize").click(() => {
    ipcRenderer.send("maximize");
  });
  $("#close").click(() => {
    ipcRenderer.send("close");
  });
});
*/
