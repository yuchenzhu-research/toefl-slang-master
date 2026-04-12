import "dotenv/config";

import type { ToeflSlangClientOptions } from "../platform/client";
import { runStudio } from "./runner";

const STUDIO_USAGE = `
SPARK Studio — Terminal UI (TUI)

Usage:
  spark studio [options]

Options:
  --file <path>     Reserved (WIP). Pre-select a source file (.pdf / .md / .txt)
  --provider <id>   Provider to use (default: openai)
  --model <id>      Model id override
  --api-key <key>   API key override
  --base-url <url>  Base URL override
  --dry-run         Launch the TUI without calling APIs
  --help            Show this help

Description:
  Studio currently runs as an interactive TUI focused on Dictionary Pro lookups.
  Type any word or expression and press Enter to query. Press Ctrl+C to exit.

  The full guided pipeline (content parsing, candidate review, card generation)
  is work in progress.
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
    provider: readFlag(argv, "--provider"),
    model: readFlag(argv, "--model"),
    apiKey: readFlag(argv, "--api-key"),
    baseUrl: readFlag(argv, "--base-url"),
  };

  await runStudio({ clientOptions, dryRun, filePathHint });
}

