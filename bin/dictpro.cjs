#!/usr/bin/env node

require("./register-ts-node.cjs");

const { runDictionaryProModuleCli } = require("../src/dictionary-pro/index.ts");

async function main() {
  await runDictionaryProModuleCli(process.argv.slice(2));
}

main().catch((error) => {
  console.error("Dictionary Pro error:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
