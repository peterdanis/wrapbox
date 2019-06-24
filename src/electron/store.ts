import Store from "electron-store";

const schema = {
  backgroundColor: {
    default: "#FF0000",
    type: "string",
  },
  startMaximized: {
    default: false,
    type: "boolean",
  },
  windowHeight: {
    default: 700,
    type: "number",
  },
  windowWidth: {
    default: 1200,
    type: "number",
  },
};

// @ts-ignore
export default new Store({ schema });
