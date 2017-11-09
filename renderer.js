const $ = require("./assets/jquery.min.js");
const { shell, ipcRenderer } = require("electron");

$(() => {
  // TODO FramelessWindow
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
      // TODO Allow user to choose whether to open
      // in external browser or in the same electron window
      if (true) {
        shell.openExternal(event.originalEvent.url);
      } else {
        $(event.currentTarget).attr("src", event.originalEvent.url);
      }
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
