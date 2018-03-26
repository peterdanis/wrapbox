const { join } = require("path");

function customVisitor({ types: t }) {
  return {
    visitor: {
      NewExpression(path) {
        if (path.node.callee.name === "BrowserWindow") {
          path.node.arguments[0].properties.push(t.ObjectProperty(
            t.Identifier("webPreferences"),
            t.ObjectExpression([
              t.ObjectProperty(
                t.Identifier("preload"),
                t.StringLiteral(`${join(__dirname, "test-preload.js")}`)
              ),
            ])
          ));
        }
      },
    },
  };
}

module.exports = customVisitor;
