import Store from "electron-store";

const schema = {
  windowWidth: {
    type: "number",
    default: 1200,
  },
  windowHeight: {
    type: "number",
    default: 700,
  },
  startMaximized: {
    type: "boolean",
    default: false,
  },
  backgroundColor: {
    type: "string",
    default: "#FF0000",
  },
};

// @ts-ignore
export default new Store({ schema });
