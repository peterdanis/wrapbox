const addNavButtons = require("../../app/scripts/add-navigation-buttons");
const EventEmitter = require("events");

const testEmitter = new EventEmitter();

function getDiv0() {
  return document.querySelector("#div0");
}

function getNbdiv0() {
  return document.querySelector("#nbdiv0");
}

function createTestDocument() {
  for (let i = 0; i < 2; i++) {
    const div = document.createElement("div");
    document.querySelector("body").appendChild(div);
    div.setAttribute("id", `div${i}`);
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
    expect(getNbdiv0().parentNode.id).toBe("div0");
    expect(document.querySelector("#div1").childElementCount).toBe(0);
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
    const buttons = document.querySelector("#nbdiv0").childNodes;
    expect(buttons.length).toBe(4);
    for (let i = 0; i < buttons.length; i++) {
      expect(buttons[i]).toMatchSnapshot();
    }
  });
});
