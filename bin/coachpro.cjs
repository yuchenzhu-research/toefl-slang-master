#!/usr/bin/env node

require("./register-ts-node.cjs");

const { runToeflWritingModuleCli } = require("../src/toefl-writing/index.ts");

async function main() {
  await runToeflWritingModuleCli(process.argv.slice(2));
}

main().catch((error) => {
  console.error("TOEFL Coach error:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
