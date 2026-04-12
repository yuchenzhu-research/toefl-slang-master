import "dotenv/config";

import { runContentParserModuleCli } from "./content-parser";
import { runDictionaryProBenchCli, runDictionaryProModuleCli } from "./dictionary-pro";
import { printExperimentalUsage, runExperimentalCli } from "./experimental/cli";
import { ToeflSlangClient } from "./platform/client";
import { runDoctorCli } from "./platform/doctor";
import { runInitCli } from "./platform/init";
import { runStudioModuleCli } from "./studio";
import { runToeflWritingModuleCli } from "./toefl-writing";

function printUsage(): void {
  const usage = `
SPARK CLI (Speech, Phrase, and Artful Resonance Kinship)

Usage:
  spark studio [--file <path>] [--dry-run]   ← Studio TUI (Dictionary Pro lookups; pipeline WIP)
  spark dict "<expression>" [options]
  spark coach "<essay-or-paragraph>" [options]
  spark content --file <article.md> [options]
  spark init [--force]
  spark doctor
  spark providers
  spark x --help      (Experimental / Auxiliary commands)

Guided Mode:
  studio     Launch Studio TUI for interactive Dictionary Pro lookups.

Core Commands:
  dict       Run Dictionary Pro to upgrade informal English (Informal -> TOEFL).
  coach      Run TOEFL Coach for writing diagnosis and scoring.
  content    Run Content Parser to extract learning materials.

Setup Commands:
  init       Initialize environment and required directories.
  doctor     Check environment, API keys, and system health.
  providers  List all supported model providers.

Examples:
  spark studio                               ← Start guided session
  spark studio --file article.md --dry-run   ← Preview without API calls
  spark dict "gonna" --target toefl-writing
  spark coach "I think technology is good..." --dry-run
  spark content --file essay.md --json
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
    case "studio":
      await runStudioModuleCli(rest);
      return;
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
      await runInitCli(rest);
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
    `Unknown command "${command}". Use "spark help" to see core commands or "spark x help" for experimental commands.`,
  );
}

async function main() {
  await runTopLevelCli(process.argv.slice(2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error("SPARK CLI error:", error.message);
    process.exit(1);
  });
}
