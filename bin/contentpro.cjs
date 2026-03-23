#!/usr/bin/env node

require("./register-ts-node.cjs");

const { runContentParserModuleCli } = require("../src/content-parser/index.ts");

async function main() {
  await runContentParserModuleCli(process.argv.slice(2));
}

main().catch((error) => {
  console.error("Content Parser error:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
