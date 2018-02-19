const addNavButtons = require("../../app/scripts/add-navigation-buttons");
const EventEmitter = require("events");

const testEmitter = new EventEmitter();

function createTestDocument() {
  for (let i = 0; i < 2; i++) {
    const div = document.createElement("div");
    document.querySelector("body").appendChild(div);
    div.setAttribute("id", `div${i}`);
  }
}

beforeAll(() => {
  createTestDocument();
});

describe("AddNavButtons function", () => {
  test("creates navbuttons section only in defined element", () => {
    addNavButtons("#div0", testEmitter, 0);
    expect(document.querySelector("#nbdiv0").parentNode.id).toBe("div0");
    expect(document.querySelector("#div1").childElementCount).toBe(0);
  });

  test("navbuttons are hidden by default", () => {
    expect(document.querySelector("#nbdiv0").classList.contains("invisible")).toBeTruthy();
  });

  test("navbuttons are visible if parent node is 'active'", () => {
    expect(document.querySelector("#nbdiv0").classList.contains("invisible")).toBeTruthy();
  });

  test("adds 4 buttons to navbuttons element", () => {
    const buttons = document.querySelector("#nbdiv0").childNodes;
    expect(buttons.length).toBe(4);
    for (let i = 0; i < buttons.length; i++) {
      expect(buttons[i]).toMatchSnapshot();
    }
  });
});
