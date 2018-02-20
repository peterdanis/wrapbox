const addNavButtons = require("../../app/scripts/add-navigation-buttons");
const EventEmitter = require("events");

const testEmitter = new EventEmitter();
let activediv0;
let nbdiv0;
let webview0;
let wbdiv0;
let wbdiv1;

function createDiv(id) {
  const div = document.createElement("div");
  div.setAttribute("id", id);
  document.body.appendChild(div);
  return div;
}

function mockWebviewFunctions(webview) {
  /* eslint-disable no-param-reassign  */
  webview.goBack = jest.fn(() => {});
  webview.goToIndex = jest.fn(() => {});
  webview.reload = jest.fn(() => {});
  webview.goForward = jest.fn(() => {});
  /* eslint-enable no-param-reassign  */
}

// Prepare test DOM
beforeAll(() => {
  activediv0 = createDiv("activediv0");
  webview0 = createDiv("webview0");
  wbdiv0 = createDiv("wbdiv0");
  wbdiv1 = createDiv("wbdiv1");

  activediv0.classList.add("active");
  wbdiv0.appendChild(activediv0);

  mockWebviewFunctions(webview0);

  addNavButtons(wbdiv0, testEmitter, 0);
  nbdiv0 = document.querySelector("#nbdiv0");
});

describe("AddNavButtons function", () => {
  test("creates navbuttons section only in defined element", () => {
    expect(nbdiv0.parentNode.id).toBe("wbdiv0");
    expect(wbdiv1.childElementCount).toBe(0);
  });

  test("adds 4 buttons to navbuttons element", () => {
    const buttons = nbdiv0.childNodes;
    expect(buttons.length).toBe(4);
    for (let i = 0; i < buttons.length; i++) {
      expect(buttons[i]).toMatchSnapshot();
    }
  });

  describe("Navbuttons section", () => {
    test("is hidden by default", () => {
      expect(nbdiv0.classList.contains("invisible")).toBeTruthy();
    });

    test("is visible if parent node is 'active'", () => {
      testEmitter.emit("showNavButtons", wbdiv0);
      expect(nbdiv0.classList.contains("invisible")).toBeFalsy();
    });

    test("is hidden after mouseover event", () => {
      testEmitter.emit("hideNavButtons");
      testEmitter.emit("showNavButtons", {});
      expect(nbdiv0.classList.contains("invisible")).toBeTruthy();
    });

    test("buttons maps to webview methods", () => {
      nbdiv0.childNodes[0].innerText = "navigate_before";
      nbdiv0.childNodes[1].innerText = "home";
      nbdiv0.childNodes[2].innerText = "refresh";
      nbdiv0.childNodes[3].innerText = "navigate_next";

      nbdiv0.childNodes.forEach((e) => {
        e.click();
      });

      expect(webview0.goBack).toHaveBeenCalled();
      expect(webview0.goToIndex).toHaveBeenCalledWith(0);
      expect(webview0.reload).toHaveBeenCalled();
      expect(webview0.goForward).toHaveBeenCalled();
    });
  });
});
