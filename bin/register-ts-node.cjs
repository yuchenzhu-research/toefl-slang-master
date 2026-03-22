const path = require("path");
const tsNode = require("ts-node");

tsNode.register({
  transpileOnly: true,
  project: path.join(__dirname, "..", "tsconfig.json"),
});
