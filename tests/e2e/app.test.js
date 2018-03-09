const { Application } = require("spectron");
const { promisify } = require("util");
const { toMatchImageSnapshot } = require("jest-image-snapshot");
const electron = require("electron");
const fs = require("fs");
const NYC = require("nyc");
const path = require("path");

const getInstrumentedFileName = file => `${file.slice(0, -2)}instrumented.js`;
const appDir = path.join(__dirname, "..", "..", "app");
const appJs = path.join(appDir, "app.js");
const mainPageJs = path.join(appDir, "scripts", "main-page.js");
const instrumentedFiles = [];
const nyc = new NYC();
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);
const writeFileAsync = promisify(fs.writeFile);
const app = new Application({
  path: electron,
  args: [].concat(getInstrumentedFileName(appJs)),
  startTimeout: 10000,
});
const convert = async (file) => {
  const instrumentedFile = getInstrumentedFileName(file);
  // prettier-ignore
  const coverageSave = `

    const fs = require("fs");
    process.once("exit", () => {
      const coverageDir = path.join("${appDir.replace(/\\/g, "\\\\")}", "..", "coverage")
      try {
        fs.mkdirSync(coverageDir);
      } catch (error) {}
      fs.writeFileSync(
        path.join(coverageDir, global.__coverage__["${file.replace(/\\/g, "\\\\")}"].hash + ".json"),
        JSON.stringify(global.__coverage__),
        "UTF-8"
      );
    });
    `;

  const orig = await readFileAsync(file, "UTF-8");
  let code = nyc.instrumenter().instrumentSync(orig, file);
  code += coverageSave;
  await writeFileAsync(instrumentedFile, code, "UTF-8");
  instrumentedFiles.push(instrumentedFile);
};

beforeAll(async () => {
  expect.extend({ toMatchImageSnapshot });
  convert(appJs);
  convert(mainPageJs);
  await app.start();
}, 20000);

afterAll(async () => {
  instrumentedFiles.forEach(async (e) => {
    // await unlinkAsync(e);
  });
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

  // TODO WIP tests
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
