#!/usr/bin/env node

require("./register-ts-node.cjs");

const { runTopLevelCli } = require("../src/app-cli.ts");

async function main() {
  await runTopLevelCli(process.argv.slice(2));
}

main().catch((error) => {
  console.error(
    "SPARK CLI error:",
    error instanceof Error ? error.message : String(error),
  );
  process.exit(1);
});
