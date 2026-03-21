#!/usr/bin/env node

require("ts-node/register/transpile-only");

const { runContentParserCli } = require("../src/content-parser/cli.ts");

async function main() {
  const argv = process.argv.slice(2);
  await runContentParserCli(argv.length === 0 ? ["--help"] : argv);
}

main().catch((error) => {
  console.error("Content Parser error:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
