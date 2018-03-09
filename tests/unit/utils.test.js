const {
  init, settings, version, loadSettings, saveSettings,
} = require("../../app/scripts/utils");
const fs = require("fs");
const log = require("electron-log");
const os = require("os");
const path = require("path");

jest.mock("electron", () => require("../mocks/electron"));
jest.mock("electron-log", () => require("../mocks/electron-log"));
jest.mock("fs", () => require("../mocks/fs"));

beforeAll(() => {
  init();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Settings", () => {
  test("is object", () => {
    expect(typeof settings).toBe("object");
  });

  test("default window buttons position is 'right'", () => {
    expect(settings.windowButtonsPosition).toBe("right");
  });

  test("startMaximized is boolean", () => {
    expect(typeof settings.startMaximized).toBe("boolean");
  });

  test("width and height should are number", () => {
    expect(typeof settings.windowWidth).toBe("number");
    expect(typeof settings.windowHeight).toBe("number");
  });

  test("backgroundColor is string", () => {
    expect(typeof settings.backgroundColor).toBe("string");
  });

  test("webviews is array", () => {
    expect(Array.isArray(settings.webviews)).toBeTruthy();
  });
});

describe("Version", () => {
  test("is string", () => {
    expect(typeof version).toBe("string");
  });

  test("is '0.0.0'", () => {
    expect(version).toBe("0.0.0");
  });
});

describe("Function loadSettings", () => {
  test("tries app path first and userData as second", () => {
    const file1 = path.join(
      os.tmpdir(),
      "jest_wrapbox",
      __filename
        .split(path.sep)
        .slice(-2)
        .join(path.sep),
      "appPath",
      "wrapbox-config.json"
    );
    const file2 = path.join(
      os.tmpdir(),
      "jest_wrapbox",
      __filename
        .split(path.sep)
        .slice(-2)
        .join(path.sep),
      "userData",
      "wrapbox-config.json"
    );
    loadSettings();
    expect(fs.statSync).toHaveBeenCalledWith(file1);
    expect(fs.readFileSync).toHaveBeenCalledWith(file2, "utf8");
  });

  test("uses same dir as portable exe dir", () => {
    process.env.PORTABLE_EXECUTABLE_DIR = os.tmpdir();
    loadSettings();
    delete process.env.PORTABLE_EXECUTABLE_DIR;

    expect(fs.statSync).not.toHaveBeenCalled();
    expect(fs.readFileSync).toHaveBeenCalledWith(
      path.join(os.tmpdir(), "wrapbox-config.json"),
      "utf8"
    );
  });

  test("loads the settings from its first argument", () => {
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
    loadSettings(file);
    expect(settings).toEqual(assertSettings);
    expect(fs.statSync).not.toHaveBeenCalled();
    expect(fs.readFileSync).toHaveBeenCalledWith(file, "utf8");
    expect(log.info).toHaveBeenCalledWith(`Settings location: ${file}`);
  });
});

describe("Function saveSettings", () => {
  test("can resolve", async () => {
    const file = path.join(os.tmpdir(), "test.json");
    expect.assertions(3);
    await expect(saveSettings({})).resolves.toBeUndefined();
    await expect(saveSettings({ test: "test" }, file)).resolves.toBeUndefined();
    expect(fs.writeFile).toHaveBeenLastCalledWith(file, "{\"test\":\"test\"}", expect.any(Function));
  });

  test("can reject", async () => {
    expect.assertions(1);
    await expect(saveSettings()).rejects.toThrow();
  });

  test("can trow on JSON circular reference", async () => {
    const data = {};
    data.test = data;
    expect.assertions(1);
    await expect(saveSettings(data)).rejects.toThrow();
  });
});
