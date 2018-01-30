const path = require("path");
const os = require("os");

const electron = {
  app: {
    getAppPath: () => path.join(os.tmpdir(), "app"),
    getPath: () => os.tmpdir(),
    getVersion: () => "0.0.0",
  },
};

module.exports = electron;
