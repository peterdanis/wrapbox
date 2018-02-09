const {
  settings, version, loadSettings, saveSettings,
} = require("../../app/scripts/utils");
const fs = require("fs");
const log = require("electron-log");
const os = require("os");
const path = require("path");

jest.mock("electron", () => require("../mocks/electron"));
jest.mock("electron-log", () => require("../mocks/electron-log"));
jest.mock("fs", () => require("../mocks/fs"));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Settings", () => {
  test("Should be object", () => {
    expect(typeof settings).toBe("object");
  });

  test("Window buttons position should be 'right'", () => {
    expect(settings.windowButtonsPosition).toBe("right");
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

describe("Function loadSettings", () => {
  test("Should try the app path first and userData as second", () => {
    const file1 = path.join(
      os.tmpdir(),
      "jest_wrapbox",
      __filename
        .split(path.sep)
        .slice(-2)
        .join(path.sep),
      "appPath",
      "config.json"
    );
    const file2 = path.join(
      os.tmpdir(),
      "jest_wrapbox",
      __filename
        .split(path.sep)
        .slice(-2)
        .join(path.sep),
      "userData",
      "config.json"
    );
    loadSettings();
    expect(fs.statSync).toHaveBeenCalledWith(file1);
    expect(fs.readFileSync).toHaveBeenCalledWith(file2, "utf8");
  });

  test("Should load the settings from its first argument", () => {
    const file = path.join(os.tmpdir(), "custom.json");
    const assertSettings = {
      filePath: file,
      windowButtonsPosition: "left",
      startMaximized: true,
      windowWidth: 1600,
      windowHeight: 900,
      backgroundColor: "#E0E0E0",
      webviews: [{ url: "testurl", icon: "testicon" }],
    };
    fs.readFileSync.mockImplementationOnce(() => JSON.stringify(assertSettings));
    expect(loadSettings(file));
    expect(settings).toEqual(assertSettings);
    expect(fs.statSync).not.toHaveBeenCalled();
    expect(fs.readFileSync).toHaveBeenCalledWith(file, "utf8");
    expect(log.info).toHaveBeenCalledWith(`Settings location: ${file}`);
  });
});

describe("Function saveSettings", () => {
  test("Should resolve", async () => {
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
