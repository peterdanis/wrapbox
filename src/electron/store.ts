import Store from "electron-store";

const schema = {
  backgroundColor: {
    default: "#000000",
    type: "string",
  },
  // controlsOnRight: {
  //   default: "right",
  //   type: "string",
  // },
  pages: {
    default: [],
    items: {
      properties: {
        icon: { type: "string" },
        id: { type: "string" },
        url: { type: "string" },
      },
      type: "object",
    },
    type: "array",
  },
  // startMaximized: {
  //   default: false,
  //   type: "boolean",
  // },
  // windowHeight: {
  //   default: 700,
  //   type: "number",
  // },
  // windowWidth: {
  //   default: 1200,
  //   type: "number",
  // },
};

// @ts-ignore
export default new Store({ schema });
