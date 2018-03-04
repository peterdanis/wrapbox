const { Application } = require("spectron");
const { toMatchImageSnapshot } = require("jest-image-snapshot");
const path = require("path");

expect.extend({ toMatchImageSnapshot });

const electronBin = (() => {
  if (process.platform === "win32") {
    return "electron.exe";
  }
  if (process.platform === "darwin") {
    return "electron.app";
  }
  return "electron";
})();

const electronPath = path.join(__dirname, "..", "..", "node_modules", ".bin", "electron");
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
  // test(
  //   "image matches",
  //   async () => {
  //     await app.start();
  //     app.client.pause(1000);
  //     const image = await app.browserWindow.capturePage();
  //     await app.stop();
  //     expect(image).toMatchImageSnapshot();
  //   },
  //   10000
  // );
});
