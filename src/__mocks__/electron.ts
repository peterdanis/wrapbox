// eslint-disable-next-line import/prefer-default-export
export const ipcRenderer = {
  sendSync: jest.fn().mockImplementation((channel): {} => {
    switch (channel) {
      case "getAllSettings":
        return {
          pages: [
            {
              icon: "google",
              id: "aaa-bbb",
              url: "www.google.com",
            },
          ],
        };
      default:
        return {};
    }
  }),
};
