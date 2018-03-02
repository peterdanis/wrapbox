const { Application } = require("spectron");
const { toMatchImageSnapshot } = require("jest-image-snapshot");
const path = require("path");

expect.extend({ toMatchImageSnapshot });

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
    "starts",
    async () => {
      await app.start();
      const isVisible = await app.browserWindow.isVisible();
      await app.stop();
      expect(isVisible).toBe(true);
    },
    10000
  );
  test(
    "image matches",
    async () => {
      await app.start();
      app.client.pause(1000);
      const image = await app.browserWindow.capturePage();
      await app.stop();
      expect(image).toMatchImageSnapshot();
    },
    10000
  );
});
