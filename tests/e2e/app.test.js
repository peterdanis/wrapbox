const electron = require("electron");
const { Application } = require("spectron");
const { toMatchImageSnapshot } = require("jest-image-snapshot");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const NYC = require("nyc");
const uuid = require("uuid/v4");

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);
const rootDir = path.join(__dirname, "..", "..");
const appPath = [path.join(rootDir, "app", "app.instrumented.js")];

expect.extend({ toMatchImageSnapshot });

let app;

beforeAll(async () => {
  const nyc = new NYC();

  const appjs = path.join(rootDir, "app", "app.js");

  async function convert(file) {
    const coverageSave = `

    const fs = require("fs");
    process.once("exit", () => {
      const coverageDir = path.join(__dirname, "..", "coverage")
      try {
        fs.mkdirSync(coverageDir);
      } catch (error) {}
      fs.writeFileSync(
        path.join(coverageDir, "coverage-" + "${uuid()}" + ".json"),
        JSON.stringify(global.__coverage__),
        "UTF-8"
      );
    });
    `;

    const orig = await readFileAsync(file, "UTF-8");
    let code = nyc.instrumenter().instrumentSync(orig, appjs);
    code += coverageSave;
    await writeFileAsync(`${file.slice(0, -2)}instrumented.js`, code, "UTF-8");
  }

  convert(appjs);

  app = new Application({
    path: electron,
    args: appPath,
    startTimeout: 10000,
  });

  await app.start();
}, 20000);

afterAll(async () => {
  await unlinkAsync(appPath[0]);
  await app.stop();
}, 20000);

describe("App", () => {
  test(
    "starts",
    async () => {
      await app.client.waitUntilWindowLoaded();
      const isVisible = await app.browserWindow.isVisible();

      expect(isVisible).toBe(true);
    },
    10000
  );
  // test(
  //   "maximizes",
  //   async () => {
  //     if (process.platform === "darwin") {
  //       await app.browserWindow.maximize();
  //     } else {
  //       await app.client.leftClick("#maximize");
  //     }
  //     await app.client.waitUntil(
  //       async () => (await app.browserWindow.isMaximized()) === true,
  //       5000,
  //       "",
  //       100
  //     );
  //     const isMaximized = await app.browserWindow.isMaximized();

  //     expect(isMaximized).toBe(true);
  //   },
  //   10000
  // );
  // test(
  //   "unmaximizes",
  //   async () => {
  //     if (process.platform === "darwin") {
  //       await app.browserWindow.maximize();
  //     } else {
  //       await app.client.leftClick("#maximize");
  //     }
  //     await app.client.waitUntil(
  //       async () => (await app.browserWindow.isMaximized()) === false,
  //       5000,
  //       "",
  //       100
  //     );
  //     const isMaximized = await app.browserWindow.isMaximized();

  //     expect(isMaximized).toBe(false);
  //   },
  //   10000
  // );
  // test(
  //   "minimizes",
  //   async () => {
  //     if (process.platform === "darwin") {
  //       await app.browserWindow.minimize();
  //     } else {
  //       await app.client.leftClick("#minimize");
  //     }
  //     await app.client.waitUntil(
  //       async () => (await app.browserWindow.isMinimized()) === true,
  //       5000,
  //       "",
  //       100
  //     );
  //     const isMinimized = await app.browserWindow.isMinimized();
  //     await app.stop();

  //     expect(isMinimized).toBe(true);
  //   },
  //   10000
  // );
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
