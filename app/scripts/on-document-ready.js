/**
 * Runs a given function when document is ready or adds
 * an event listener, which will run the function
 * @param {function} fn Function to run
 */
function onDocumentReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      fn();
    });
  } else {
    fn();
  }
}

module.exports = onDocumentReady;
