const EventEmitter = require("events");
const {
  arrayToElements,
  BaseElement,
  Button,
  FabButton,
  IconButton,
  MaterialIcon,
  MiniFabButton,
  TextField,
  Webview,
} = require("../../app/scripts/ui");

const emitter = new EventEmitter();
const body = document.body; // eslint-disable-line prefer-destructuring
const qs = e => document.querySelector(e);
let be;
let bu;
let wb;

body.setAttribute("id", "body");

describe("UI element", () => {
  test("BaseElement", () => {
    be = new BaseElement({
      type: "div",
      id: "be",
      class: "be-test",
      style: "top: 0px",
      innerHTML: new BaseElement({ type: "div" }).element.outerHTML,
      customAttr: ["data-1", "test-1", "data-2", "test-2", "data-3", ""],
      wh: { test: "test" },
    });
    be.appendTo(body);

    expect(be.wh.test).toBe("test");
    expect(qs("#be")).toMatchSnapshot();
  });

  test("Button", () => {
    bu = new Button({
      id: "bu",
      class: "bu-test",
      color: "primary",
      textColor: "white",
    });
    bu.appendTo(body);

    expect(qs("#bu")).toMatchSnapshot();
  });

  test("FabButton", () => {
    const element = new FabButton({
      id: "fab",
    });
    element.appendTo(body);

    expect(qs("#fab")).toMatchSnapshot();
  });

  test("IconButton", () => {
    const element = new IconButton({
      id: "ib",
    });
    element.appendTo(body);

    expect(qs("#ib")).toMatchSnapshot();
  });

  test("MaterialIcon", () => {
    const element = new MaterialIcon({
      id: "mi",
      fontSize: "20px",
      innerHTML: "add",
    });
    element.appendTo(body);

    expect(qs("#mi")).toMatchSnapshot();
  });

  test("MiniFabButton", () => {
    const element = new MiniFabButton({
      id: "mfab",
    });
    element.appendTo(body);

    expect(qs("#mdab")).toMatchSnapshot();
  });

  test("TextField", () => {
    const element = new TextField({
      id: "tf",
      innerId: "itf",
      innerClass: "test-class",
      pattern: "[A-Z]",
      value: "value test",
      text: "text test",
      errorText: "error test",
    });
    element.appendTo(body);

    expect(qs("#tf")).toMatchSnapshot();
  });

  test("Webview", () => {
    wb = new Webview({
      id: "wb",
      src: "https:\\\\www.test.com\\test",
    });
    wb.appendTo(body);
    expect(qs("#wb")).toMatchSnapshot();
  });

  describe("method", () => {
    test("addRiple adds class to button", () => {
      // Check before using the addRipple method
      expect(qs("#bu").classList.contains("mdl-js-ripple-effect")).toBeFalsy();

      bu.addRipple();
      expect(qs("#bu").classList.contains("mdl-js-ripple-effect")).toBeTruthy();
    });

    test("append accepts string and DOM object", () => {
      bu.appendTo("#be");
      expect(bu.element.parentNode.id).toBe("be");

      bu.appendTo(body);
      expect(bu.element.parentNode.id).toBe("body");
    });

    test("hideClass output depends on process.platform and tag type", () => {
      const { platform } = process;

      // On macOS visibility: hidden is causing bugs in webview
      Object.defineProperty(process, "platform", {
        value: "darwin",
      });
      expect(bu.hideClass()).toBe("invisible");
      expect(wb.hideClass()).toBe("zinvisible");

      // Needed to pass the test on macOs
      Object.defineProperty(process, "platform", {
        value: "win32",
      });
      expect(bu.hideClass()).toBe("invisible");
      expect(wb.hideClass()).toBe("invisible");

      // Change the process.platform back to default
      Object.defineProperty(process, "platform", {
        value: platform,
      });
    });

    test("hide adds class", () => {
      bu.hide();

      expect(qs("#bu").classList.contains("invisible")).toBeTruthy();
    });

    test("show removes class", () => {
      bu.show();

      expect(qs("#bu").classList.contains("invisible")).toBeFalsy();
    });

    test("addEventListener adds event listener", () => {
      bu.addEventListener("click", (e) => {
        bu.wh.eventTargetId = e.currentTarget.id;
      });
      qs("#bu").click();

      expect(bu.wh.eventTargetId).toBe("bu");
    });

    test("listenTo subscribes subject to events", () => {
      bu.listenTo(emitter, "test", (arg) => {
        bu.wh.listTest = arg;
      });
      emitter.emit("test", "testEvent");

      expect(bu.wh.listTest).toBe("testEvent");
    });

    test("is chainable", () => {
      const test = bu
        .appendTo(body)
        .addRipple()
        .hide()
        .show()
        .addEventListener("", () => {})
        .listenTo(emitter, "", () => {});

      expect(test === bu).toBeTruthy();
    });
  });
});

describe("arrayToElements function", () => {
  test("creates an array of elements", () => {
    const futureElements = [
      {
        id: "xa",
        wh: {
          own: "",
        },
      },
      {
        id: "xb",
      },
    ];
    const elements = arrayToElements(Button, futureElements, {
      class: "x",
      wh: {
        common: "",
      },
    });
    elements.forEach((e) => {
      e.appendTo(body);
    });

    expect(Array.isArray(elements)).toBeTruthy();
    expect(elements.length).toBe(2);
    expect(qs("#xb").classList.contains("x")).toBeTruthy();
    expect(elements[0].wh).toMatchObject({ own: "", common: "" });
  });
});
