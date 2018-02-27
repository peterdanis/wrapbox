const addWinButtons = require("../../app/scripts/add-window-buttons");
const { ipcRenderer } = require("electron"); // eslint-disable-line

jest.mock("electron", () => require("../mocks/electron"));

const titleBar = document.createElement("div");
titleBar.setAttribute("id", "titlebar");
document.querySelector("body").appendChild(titleBar);

addWinButtons("#titlebar", "right");
const winButtons = document.querySelector("#close").parentNode;

describe("AddWinButtons function", () => {
  test("adds window buttons to titlebar", () => {
    expect(winButtons.parentNode.id).toBe("titlebar");
  });
  test("adds 3 buttons", () => {
    const buttons = winButtons.childNodes;
    expect(buttons).toHaveLength(3);
    for (let i = 0; i < buttons.length; i++) {
      expect(buttons[i]).toMatchSnapshot();
    }
  });

  describe("Window buttons", () => {
    test("parent has class 'right'", () => {
      expect(winButtons.classList.contains("right")).toBeTruthy();
    });
    test("send messages through ipcRenderer", () => {
      winButtons.childNodes.forEach((e) => {
        e.click();
      });
      expect(ipcRenderer.send.mock.calls).toEqual([["minimize"], ["maximize"], ["close"]]);
    });
  });
});
