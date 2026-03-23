import "dotenv/config";

import { runContentParserCli } from "./cli";

export { runContentParserCli, parseContentParserArgs } from "./cli";
export { resolveContentParserSource } from "./extractor";
export { runContentParserQuery } from "./runner";
export * from "./types";
export * from "./schema";

export async function runContentParserModuleCli(argv: string[]): Promise<void> {
  await runContentParserCli(argv.length === 0 ? ["--help"] : argv);
}

async function main() {
  await runContentParserModuleCli(process.argv.slice(2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Content Parser error:", error.message);
    process.exit(1);
  });
}
