import "dotenv/config";

import { runToeflWritingCli } from "./cli";

export { runToeflWritingCli, parseToeflWritingArgs, resolveToeflWritingSource } from "./cli";
export { runToeflWritingQuery } from "./runner";
export * from "./types";
export * from "./types";

export async function runToeflWritingModuleCli(argv: string[]): Promise<void> {
  await runToeflWritingCli(argv.length === 0 ? ["--help"] : argv);
}

async function main() {
  await runToeflWritingModuleCli(process.argv.slice(2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error("TOEFL Coach error:", error.message);
    process.exit(1);
  });
}
