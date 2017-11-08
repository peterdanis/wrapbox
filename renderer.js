const $ = require("./assets/jquery.min.js");
const { shell, ipcRenderer } = require("electron");

$(() => {
  if (process.platform === "win32") {
    $("#titlebar").addClass("hidden");
    $("#main").addClass("heightcorrection");
  }
  $("#sidepanel .btn").click((event) => {
    $("webview").addClass("hidden");
    $(`#${$(event.currentTarget).data("target")}`).removeClass("hidden");
    $("#sidepanel .btn").removeClass("active");
    $(event.currentTarget).addClass("active");
  });
  $($("webview").on("new-window", (event) => {
    try {
      shell.openExternal(event.originalEvent.url);
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
