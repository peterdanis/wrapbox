const { toMatchImageSnapshot } = require("jest-image-snapshot");
const electron = require("electron");
// const path = require("path");
const puppeteer = require("puppeteer");

const delay = ms => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

let app;
let page;

beforeAll(async () => {
  expect.extend({ toMatchImageSnapshot });
  // const preloadFile = path.posix.join(__dirname, "test-preload.js");
  app = await puppeteer.launch({
    executablePath: electron,
    args: ["."],
    headless: false,
  });
  const pages = await app.pages();
  [page] = pages;
  page.setViewport({ width: 1200, height: 700 });
}, 30000);

afterAll(async () => {
  await app.close();
}, 30000);

describe("App", () => {
  test("starts", async () => {
    await delay(5000);
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      customDiffConfig: { threshold: 0.1 },
      failureThreshold: "0.5",
      failureThresholdType: "percent",
    });
  }, 10000);
});
