import "dotenv/config";

import { runContentParserModuleCli } from "./content-parser";
import { runDictionaryProBenchCli, runDictionaryProModuleCli } from "./dictionary-pro";
import { printExperimentalUsage, runExperimentalCli } from "./experimental/cli";
import { ToeflSlangClient } from "./platform/client";
import { runDoctorCli } from "./platform/doctor";
import { runInitCli } from "./platform/init";
import { runToeflWritingModuleCli } from "./toefl-writing";

function printUsage(): void {
  const usage = `
TOEFL Slang Master CLI

Usage:
  tsm dict "<expression>" [options]
  tsm coach "<essay-or-paragraph>" [options]
  tsm content --file <article.md> [options]
  tsm init [--force]
  tsm doctor
  tsm providers
  tsm x --help      (Experimental / Auxiliary commands)

Core Commands:
  dict       Run Dictionary Pro to upgrade informal English.
  coach      Run TOEFL Coach for writing diagnosis and scoring.
  content    Run Content Parser to extract learning materials.

Setup Commands:
  init       Initialize environment and required directories.
  doctor     Check environment, API keys, and system health.
  providers  List all supported model providers.

Examples:
  tsm dict "gonna" --target toefl-writing
  tsm coach "I think technology is good..." --dry-run
  tsm content --file essay.md --json
`;

  console.log(usage.trim());
}

export async function runTopLevelCli(argv: string[]): Promise<void> {
  if (argv.length === 0) {
    printUsage();
    return;
  }

  const [command, ...rest] = argv;

  if (command === "help" || command === "--help" || command === "-h") {
    printUsage();
    return;
  }

  switch (command) {
    case "dict":
      await runDictionaryProModuleCli(rest);
      return;
    case "coach":
      await runToeflWritingModuleCli(rest);
      return;
    case "content":
      await runContentParserModuleCli(rest);
      return;
    case "init":
      runInitCli(rest);
      return;
    case "doctor":
      runDoctorCli(rest);
      return;
    case "providers":
      console.log(ToeflSlangClient.listProviders());
      return;
    case "bench":
      await runDictionaryProBenchCli(rest);
      return;
    case "x":
      if (rest.length === 0 || rest[0] === "--help" || rest[0] === "-h" || rest[0] === "help") {
        printExperimentalUsage();
        return;
      }
      await runExperimentalCli(rest[0], rest.slice(1));
      return;
  }

  throw new Error(
    `Unknown command "${command}". Use "tsm help" to see core commands or "tsm x help" for experimental commands.`,
  );
}

async function main() {
  await runTopLevelCli(process.argv.slice(2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error("TOEFL Slang Master CLI error:", error.message);
    process.exit(1);
  });
}
