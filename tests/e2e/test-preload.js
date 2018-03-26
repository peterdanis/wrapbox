const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// const rootDir = (() => {
//   try {
//     JSON.parse(process.env.NYC_CONFIG).tempDirectory;
//   } catch (error) {}
// }())

const root = /* process.env.NYC */ process.cwd();

// eslint-disable-next-line
require("babel-register")({ plugins: [path.join(__dirname, "test-plugin.js"), "istanbul"] });

function saveCoverageFile() {
  function generateFilename() {
    const hash = crypto.createHash("md5");
    hash.update(process.pid.toString(), "utf8");
    return hash.digest("hex");
  }
  fs.writeFileSync(
    path.join(root, "coverage", `${generateFilename()}.json`),
    // eslint-disable-next-line
    JSON.stringify(global.__coverage__),
    "UTF-8"
  );
}

try {
  window.addEventListener("beforeunload", saveCoverageFile, { once: true });
} catch (error) {
  process.once("exit", saveCoverageFile);
}
