const os = require("os");

const electron = {
  app: {
    getVersion: () => "0.0.0",
    getPath: () => os.tmpdir(),
  },
};

module.exports = electron;
