const { Application } = require("spectron");
const { toMatchImageSnapshot } = require("jest-image-snapshot");
const path = require("path");

expect.extend({ toMatchImageSnapshot });

const rootDir = path.join(__dirname, "..", "..");
const appPath = [rootDir];
const electronPath = (() => {
  if (process.platform === "win32") {
    return path.join(rootDir, "node_modules", "electron", "dist", "electron.exe");
  }
  return path.join(rootDir, "node_modules", ".bin", "electron");
})();

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
      await app.client.waitUntilWindowLoaded();

      expect(isVisible).toBe(true);
    },
    10000
  );
  test(
    "maximizes",
    async () => {
      await app.client.leftClick("#maximize");
      await app.client.waitUntilWindowLoaded();
      const isMaximized = await app.browserWindow.isMaximized();

      expect(isMaximized).toBe(true);
    },
    10000
  );
  test(
    "unmaximizes",
    async () => {
      await app.client.leftClick("#maximize");
      await app.client.waitUntilWindowLoaded();
      const isMaximized = await app.browserWindow.isMaximized();

      expect(isMaximized).toBe(false);
    },
    10000
  );
  test(
    "minimizes",
    async () => {
      await app.client.leftClick("#minimize");
      await app.client.waitUntilWindowLoaded();
      const isMinimized = await app.browserWindow.isMinimized();
      await app.stop();

      expect(isMinimized).toBe(true);
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
