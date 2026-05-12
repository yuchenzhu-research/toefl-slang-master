import "dotenv/config";

import { runDictionaryProBenchCli } from "./bench-cli";
import { runDictionaryProCli } from "./cli";
import { runDictionaryProEvalCli } from "./eval-cli";

export { runDictionaryProBenchCli } from "./bench-cli";
export { runDictionaryProCli, parseDictionaryProArgs } from "./cli";
export { runDictionaryProEvalCli } from "./eval-cli";
export { runDictionaryProEvaluation, formatDictionaryProEvaluationReport } from "./evaluation";
export { runDictionaryProBenchmark, formatDictionaryProBenchmarkReport } from "./benchmark";
export { runDictionaryProQuery } from "./runner";
export * from "./types";
export * from "./types";

export async function runDictionaryProModuleCli(argv: string[]): Promise<void> {
  if (argv.length === 0) {
    await runDictionaryProCli(["--help"]);
    return;
  }

  const [command, ...rest] = argv;

  if (command === "eval") {
    await runDictionaryProEvalCli(rest);
    return;
  }

  if (command === "bench") {
    await runDictionaryProBenchCli(rest);
    return;
  }

  if (command === "providers") {
    await runDictionaryProCli(["--list-providers"]);
    return;
  }

  await runDictionaryProCli(argv);
}

async function main() {
  await runDictionaryProModuleCli(process.argv.slice(2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Dictionary Pro error:", error.message);
    process.exit(1);
  });
}
