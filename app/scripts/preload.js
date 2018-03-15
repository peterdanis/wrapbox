const { ipcRenderer } = require("electron"); // eslint-disable-line

const start = () => {
  ipcRenderer.send("register");
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    start();
  });
} else {
  start();
}
