const path = require("path");
const os = require("os");

const electron = {
  app: {
    getAppPath: () =>
      path.join(
        os.tmpdir(),
        "jest_wrapbox",
        module.parent.filename
          .split(path.sep)
          .slice(-2)
          .join(path.sep),
        "appPath"
      ),
    getPath: arg =>
      path.join(
        os.tmpdir(),
        "jest_wrapbox",
        module.parent.filename
          .split(path.sep)
          .slice(-2)
          .join(path.sep),
        arg
      ),
    getVersion: () => "0.0.0",
  },
};

module.exports = electron;
