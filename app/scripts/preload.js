const { ipcRenderer } = require("electron"); // eslint-disable-line

ipcRenderer.send("register");
