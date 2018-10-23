const { Application } = require("spectron");
const { toMatchImageSnapshot } = require("jest-image-snapshot");
const electron = require("electron");
const path = require("path");

const delay = ms => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});
let app;

beforeAll(async () => {
  expect.extend({ toMatchImageSnapshot });
  const preloadFile = path.posix.join(__dirname, "test-preload.js");
  app = new Application({
    path: electron,
    args: ["-r", preloadFile, "."],
    startTimeout: 30000,
  });
  await app.start();
}, 30000);

afterAll(async () => {
  await app.stop();
  await delay(5000);
}, 30000);

describe("App", () => {
  test(
    "starts",
    async () => {
      const isVisible = await app.browserWindow.isVisible();

      expect(isVisible).toBe(true);
    },
    10000
  );

  // TODO: WIP tests
  /*
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
  */
});
