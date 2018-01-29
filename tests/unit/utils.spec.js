const { settings, version, saveSettings } = require("../../app/scripts/utils");

jest.mock("electron", () => require("../mocks/electron"));
jest.mock("electron-log", () => require("../mocks/electron-log"));
jest.mock("fs", () => require("../mocks/fs"));

describe("Settings", () => {
  test("Should be object", () => {
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
  test("Should be a string", () => {
    expect(typeof version).toBe("string");
  });

  test("Should be '0.0.0'", () => {
    expect(version).toBe("0.0.0");
  });
});

// describe("Fn loadSettings", () => {
//   test("Should load", async () => {
//     expect.assertions(3);
//     const path = require("path");
//     const os = require("os");
//     const fs = require("fs");
//     const file = path.join(os.tmpdir(), "test.json");

//     await expect(saveSettings()).rejects.toThrow();
//     await expect(saveSettings({ test: "test" }, file)).resolves.toBeUndefined();
//     expect(fs.writeFile).toHaveBeenLastCalledWith(file, "{\"test\":\"test\"}", expect.any(Function));
//   });
// });

describe("Fn saveSettings", () => {
  test("Should resolve", async () => {
    const path = require("path");
    const os = require("os");
    const fs = require("fs");
    const file = path.join(os.tmpdir(), "test.json");

    expect.assertions(3);
    await expect(saveSettings({})).resolves.toBeUndefined();
    await expect(saveSettings({ test: "test" }, file)).resolves.toBeUndefined();
    expect(fs.writeFile).toHaveBeenLastCalledWith(file, "{\"test\":\"test\"}", expect.any(Function));
  });

  test("Should reject", async () => {
    expect.assertions(1);
    await expect(saveSettings()).rejects.toThrow();
  });
});
