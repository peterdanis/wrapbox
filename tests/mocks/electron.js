const os = require("os");

const electron = {
  app: {
    getAppPath: () => os.tmpdir(),
    getPath: () => os.tmpdir(),
    getVersion: () => "0.0.0",
  },
};

module.exports = electron;
