import "dotenv/config";

import { runContentParserCli } from "./content-parser/cli";
import { runDictionaryProBenchCli } from "./dictionary-pro/bench-cli";
import { runDictionaryProCli } from "./dictionary-pro/cli";
import { runDictionaryProEvalCli } from "./dictionary-pro/eval-cli";
import { ToeflSlangClient } from "./platform/client";
import { runDoctorCli } from "./platform/doctor";
import { runInitCli } from "./platform/init";
import { runToeflWritingCli } from "./toefl-writing/cli";

function printUsage(): void {
  const usage = `
TOEFL Slang Master CLI

Usage:
  tsm dict "<expression>" [options]
  tsm dict eval [options]
  tsm dict bench [options]
  tsm bench [options]
  tsm coach "<essay-or-paragraph>" [options]
  tsm content --file <article.md> [options]
  tsm init [--force] [--json]
  tsm doctor [--json]
  tsm providers

Commands:
  dict       Run Dictionary Pro.
  bench      Benchmark Dictionary Pro across providers.
  coach      Run TOEFL Coach.
  content    Run Content Parser.
  init       Create .env from .env.example and print next steps.
  doctor     Check local environment, provider keys, and PDF extraction readiness.
  providers  List all supported model providers.
  help       Show this message.

Examples:
  tsm dict "gonna" --provider openai --mode conversion --target toefl-writing
  tsm dict eval --provider openai --limit 3
  tsm dict bench --providers openai,anthropic,google --limit 2
  tsm coach "I think technology is good because it helps us communicate." --dry-run
  tsm content --file README.md --extract-only
  tsm bench --providers openai,anthropic,google --limit 2
  tsm init
  tsm doctor
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

  if (command === "providers") {
    console.log(ToeflSlangClient.listProviders());
    return;
  }

  if (command === "bench") {
    await runDictionaryProBenchCli(rest);
    return;
  }

  if (command === "doctor") {
    runDoctorCli(rest);
    return;
  }

  if (command === "init") {
    runInitCli(rest);
    return;
  }

  if (command === "dict") {
    if (rest[0] === "eval") {
      await runDictionaryProEvalCli(rest.slice(1));
      return;
    }
    if (rest[0] === "bench") {
      await runDictionaryProBenchCli(rest.slice(1));
      return;
    }
    await runDictionaryProCli(rest.length === 0 ? ["--help"] : rest);
    return;
  }

  if (command === "coach") {
    await runToeflWritingCli(rest.length === 0 ? ["--help"] : rest);
    return;
  }

  if (command === "content") {
    await runContentParserCli(rest.length === 0 ? ["--help"] : rest);
    return;
  }

  throw new Error(
    `Unknown command "${command}". Use "tsm help" to see the available commands.`,
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
