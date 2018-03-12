const { ipcRenderer } = require("electron"); // eslint-disable-line

const start = () => {
  ipcRenderer.send("prevent-unload");
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    start();
  });
} else {
  start();
}
