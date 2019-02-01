const { toMatchImageSnapshot } = require("jest-image-snapshot");
const electron = require("electron");
const path = require("path");
const puppeteer = require("puppeteer-core");

let app;
let page;

jest.setTimeout(50000);

beforeAll(async () => {
  expect.extend({ toMatchImageSnapshot });
  const preloadFile = path.posix.join(__dirname, "test-preload.js");
  app = await puppeteer.launch({
    executablePath: electron,
    args: ["-r", preloadFile, "."],
    headless: false,
  });
  const pages = await app.pages();
  [page] = pages;
  await page.setViewport({ width: 1200, height: 700 });
});

describe("App", () => {
  test("starts", async () => {
    await page.waitFor(5000);
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0.1 },
      failureThreshold: "0.1",
      failureThresholdType: "percent",
    });
  });

  test("closes", async () => {
    let closed;
    app.on("disconnected", () => {
      closed = true;
    });
    if (process.platform === "darwin") {
      await page.close();
    } else {
      await page.waitForSelector("#close");
      await page.waitFor(2000);
      await page.click("#close");
      await page.waitFor(2000);
    }
    while (!closed) {
      // eslint-disable-next-line no-await-in-loop
      await page.waitFor(500);
    }
    expect(closed).toBeTruthy();
  });
});
