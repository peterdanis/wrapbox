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
      await app.client.waitUntilWindowLoaded();
      const isVisible = await app.browserWindow.isVisible();

      expect(isVisible).toBe(true);
    },
    10000
  );
  test(
    "maximizes",
    async () => {
      if (process.platform === "darwin") {
        await app.browserWindow.maximize();
      } else {
        await app.client.leftClick("#maximize");
      }
      await app.client.waitUntil(
        async () => (await app.browserWindow.isMaximized()) === true,
        5000,
        "",
        100
      );
      const isMaximized = await app.browserWindow.isMaximized();

      expect(isMaximized).toBe(true);
    },
    10000
  );
  test(
    "unmaximizes",
    async () => {
      if (process.platform === "darwin") {
        await app.browserWindow.maximize();
      } else {
        await app.client.leftClick("#maximize");
      }
      await app.client.waitUntil(
        async () => (await app.browserWindow.isMaximized()) === false,
        5000,
        "",
        100
      );
      const isMaximized = await app.browserWindow.isMaximized();

      expect(isMaximized).toBe(false);
    },
    10000
  );
  test(
    "minimizes",
    async () => {
      if (process.platform === "darwin") {
        await app.browserWindow.minimize();
      } else {
        await app.client.leftClick("#minimize");
      }
      await app.client.waitUntil(
        async () => (await app.browserWindow.isMinimized()) === true,
        5000,
        "",
        100
      );
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
