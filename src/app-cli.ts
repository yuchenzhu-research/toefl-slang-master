import "dotenv/config";

import { runContentParserModuleCli } from "./content-parser";
import { runDictionaryProBenchCli, runDictionaryProModuleCli } from "./dictionary-pro";
import { ToeflSlangClient } from "./platform/client";
import { runDoctorCli } from "./platform/doctor";
import { runInitCli } from "./platform/init";
import { runToeflWritingModuleCli } from "./toefl-writing";
import { runPipelineInput } from "./connectors/pipeline-input";
import { runPipelineOutput } from "./connectors/coach-to-dict";
import fs from "fs";
import path from "path";

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
  tsm doctor [--json]
  tsm providers
  tsm pipeline:input <filepath>
  tsm pipeline:output "<essay-text>"
  tsm kb:status

Commands:
  dict       Run Dictionary Pro.
  bench      Benchmark Dictionary Pro across providers.
  coach      Run TOEFL Coach.
  content    Run Content Parser.
  init       Create .env from .env.example and print next steps.
  doctor     Check local environment, provider keys, and PDF extraction readiness.
  providers  List all supported model providers.
  pipeline:input   Run Pipeline 1 (Input Learning flow).
  pipeline:output  Run Pipeline 2 (Output Correction flow).
  kb:status  Show knowledge base indexing status.
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
    await runDictionaryProModuleCli(rest);
    return;
  }

  if (command === "coach") {
    await runToeflWritingModuleCli(rest);
    return;
  }

  if (command === "content") {
    await runContentParserModuleCli(rest);
    return;
  }

  if (command === "pipeline:input") {
    const file = rest[0];
    if (!file) throw new Error("Usage: tsm pipeline:input <filepath>");
    await runPipelineInput({ file, focus: "full", extractOnly: false }, {});
    return;
  }

  if (command === "pipeline:output") {
    const text = rest[0];
    if (!text) throw new Error("Usage: tsm pipeline:output <text>");
    await runPipelineOutput(text, {});
    return;
  }

  if (command === "kb:status") {
    console.log(">> Local Knowledge Base Status");
    ['cards.json', 'sources.json', 'diagnoses.json'].forEach(file => {
      const p = path.join(process.cwd(), 'outputs', 'indexes', file);
      if (fs.existsSync(p)) {
        console.log(`- ${file}: Found (${fs.statSync(p).size} bytes)`);
      } else {
        console.log(`- ${file}: Not found`);
      }
    });
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
