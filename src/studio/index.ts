import "dotenv/config";

import type { ToeflSlangClientOptions } from "../platform/client";
import { runStudio } from "./runner";

const STUDIO_USAGE = `
SPARK Studio — Guided Learning Session

Usage:
  spark studio [options]

Options:
  --file <path>     Pre-select a source file (.pdf / .md / .txt)
  --provider <id>   Provider to use (default: openai)
  --model <id>      Model id override
  --api-key <key>   API key override
  --base-url <url>  Base URL override
  --dry-run         Walk through the flow without calling APIs
  --help            Show this help

Description:
  An interactive, step-by-step learning session that guides you through:

    [1] Source file selection (.pdf, .md, .txt)
    [2] Content parsing and digest preview
    [3] Expression candidate review and selection
    [4] Learning target selection (TOEFL / Economist / Spoken)
    [5] Dictionary card generation and output

  All results are saved to your local outputs/ directory.
`;

function readFlag(argv: string[], flag: string): string | undefined {
  const i = argv.indexOf(flag);
  return i !== -1 ? argv[i + 1] : undefined;
}

export async function runStudioModuleCli(argv: string[]): Promise<void> {
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log(STUDIO_USAGE.trim());
    return;
  }

  const dryRun = argv.includes("--dry-run");
  const filePathHint = readFlag(argv, "--file");

  const clientOptions: ToeflSlangClientOptions = {
    provider: readFlag(argv, "--provider") ?? "openai",
    model: readFlag(argv, "--model"),
    apiKey: readFlag(argv, "--api-key"),
    baseUrl: readFlag(argv, "--base-url"),
  };

  await runStudio({ clientOptions, dryRun, filePathHint });
}

