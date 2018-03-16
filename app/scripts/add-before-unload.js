const path = require("path");
const { remote } = require("electron"); // eslint-disable-line

/**
 * Add a beforeunload event handler.
 */
function addBeforeUnload() {
  // Page to load on app closing
  const blankPage = path.join(__dirname, "..", "pages", "blank.html");
  // Register beforeunload handler
  window.onbeforeunload = () => {
    const regExp = new RegExp(/pages\/(blank|settings)\.html/);
    const webContents = remote.getGlobal("registeredWebContents");
    // Delay the page change because beforeunload event will be ignored if taking too long
    // setImmediate(() => {
    webContents.forEach((element) => {
      try {
        // Dont load url if url is already blank.html or settings.html
        if (!regExp.test(element.getURL())) {
          // Flush cookies to disk, they are not saved on app exit
          element.session.cookies.flushStore(() => {
            element.loadURL(`file://${blankPage}`);
          });
        }
      } catch (error) {
        // Just catch error
      }
    });
    // });
    // If all webviews conform to regexp return undefined
    return Array.from(document.querySelectorAll("webview")).find(el => !regExp.test(el.src));
  };
}

module.exports = addBeforeUnload;
