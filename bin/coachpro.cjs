#!/usr/bin/env node

require("ts-node/register/transpile-only");

const { runToeflWritingCli } = require("../src/toefl-writing/cli.ts");

async function main() {
  const argv = process.argv.slice(2);
  await runToeflWritingCli(argv.length === 0 ? ["--help"] : argv);
}

main().catch((error) => {
  console.error("TOEFL Coach error:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
