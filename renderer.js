const $ = require("./assets/jquery.min.js");
const { shell, ipcRenderer } = require("electron");

console.log("load");
$(() => {
  $("#sidepanel .btn").click((event) => {
    $("webview").addClass("hide");
    $(`#${$(event.currentTarget).data("target")}`).removeClass("hide");
    $("#sidepanel .btn").removeClass("active");
    $(this).addClass("active");
  });
  $($("webview").on("new-window", (event) => {
    console.log(event);
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
