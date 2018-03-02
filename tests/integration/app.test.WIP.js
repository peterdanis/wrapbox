const { Application } = require("spectron");
const path = require("path");

const electronPath = path.join(
  __dirname,
  "..",
  "..",
  "node_modules",
  "electron",
  "dist",
  "electron.exe"
);
const appPath = [path.join(__dirname, "..", "..")];
const app = new Application({
  path: electronPath,
  args: appPath,
});

describe("App", () => {
  test(
    "should load index.html",
    async () => {
      await app.start();
      const isVisible = await app.browserWindow.isVisible();
      await app.stop();
      expect(isVisible).toBe(true);
    },
    10000
  );
});
