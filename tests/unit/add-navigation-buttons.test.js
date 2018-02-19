const addNavButtons = require("../../app/scripts/add-navigation-buttons");
const EventEmitter = require("events");

const testEmitter = new EventEmitter();

function getDiv0() {
  return document.querySelector("#wbdiv0");
}

function getNbdiv0() {
  return document.querySelector("#nbdiv0");
}

function createTestDocument() {
  for (let i = 0; i < 2; i++) {
    const div = document.createElement("div");
    document.querySelector("body").appendChild(div);
    div.setAttribute("id", `wbdiv${i}`);
  }

  const activeDiv = document.createElement("div");
  activeDiv.classList.add("active");
  getDiv0().appendChild(activeDiv);
}

beforeAll(() => {
  createTestDocument();
});

describe("AddNavButtons function", () => {
  test("creates navbuttons section only in defined element", () => {
    addNavButtons(getDiv0(), testEmitter, 0);
    expect(getNbdiv0().parentNode.id).toBe("wbdiv0");
    expect(document.querySelector("#wbdiv1").childElementCount).toBe(0);
  });

  test("navbuttons are hidden by default", () => {
    expect(getNbdiv0().classList.contains("invisible")).toBeTruthy();
  });

  test("navbuttons are visible if parent node is 'active'", () => {
    testEmitter.emit("showNavButtons", getDiv0());
    expect(getNbdiv0().classList.contains("invisible")).toBeFalsy();
  });

  test("navbuttons are hidden", () => {
    testEmitter.emit("hideNavButtons");
    testEmitter.emit("showNavButtons", {});
    expect(getNbdiv0().classList.contains("invisible")).toBeTruthy();
  });

  test("adds 4 buttons to navbuttons element", () => {
    const buttons = getNbdiv0().childNodes;
    expect(buttons.length).toBe(4);
    for (let i = 0; i < buttons.length; i++) {
      expect(buttons[i]).toMatchSnapshot();
    }
  });

  test("nabuttons maps to webview methods", () => {
    const webview0 = document.createElement("div");
    webview0.setAttribute("id", "webview0");
    webview0.goBack = jest.fn(() => {});
    webview0.goToIndex = jest.fn(() => {});
    webview0.reload = jest.fn(() => {});
    webview0.goForward = jest.fn(() => {});
    document.body.appendChild(webview0);

    getNbdiv0().childNodes[0].innerText = "navigate_before";
    getNbdiv0().childNodes[1].innerText = "home";
    getNbdiv0().childNodes[2].innerText = "refresh";
    getNbdiv0().childNodes[3].innerText = "navigate_next";

    getNbdiv0().childNodes.forEach((e) => {
      e.click();
    });

    expect(webview0.goBack).toHaveBeenCalled();
    expect(webview0.goToIndex).toHaveBeenCalledWith(0);
    expect(webview0.reload).toHaveBeenCalled();
    expect(webview0.goForward).toHaveBeenCalled();
  });
});
