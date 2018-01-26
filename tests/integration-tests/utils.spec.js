/* eslint-env node, jest */
const { settings, version, saveSettings } = require("../../app/scripts/utils");

jest.mock("electron", () => require("../mocks/electron"));
jest.mock("electron-log", () => require("../mocks/electron-log"));
jest.unmock("fs");

describe("Settings", () => {
  test("Settings should be object", () => {
    expect(typeof settings).toBe("object");
  });
  test("Window buttons position should be 'right' or 'left'", () => {
    expect(settings.windowButtonsPosition).toMatch(/(left)|(right)/);
  });
  test("startMaximized should be a boolean", () => {
    expect(typeof settings.startMaximized).toBe("boolean");
  });
  test("Width and height should be a number", () => {
    expect(typeof settings.windowWidth).toBe("number");
    expect(typeof settings.windowHeight).toBe("number");
  });
  test("backgroundColor should be a string", () => {
    expect(typeof settings.backgroundColor).toBe("string");
  });
  test("Webviews should be an array", () => {
    expect(Array.isArray(settings.webviews)).toBeTruthy();
  });
});

describe("Version", () => {
  test("Version should be a string", () => {
    expect(typeof version).toBe("string");
  });
  test("Version should be '0.0.0'", () => {
    expect(version).toBe("0.0.0");
  });
});

describe("saveSettings", () => {
  test("saveSettings should return a promise", async () => {
    expect.assertions(2);
    await expect(saveSettings()).resolves.toBeUndefined();
    await expect(saveSettings({})).resolves.toBeUndefined();
  });
});
