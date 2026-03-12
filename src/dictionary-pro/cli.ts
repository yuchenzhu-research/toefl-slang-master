import { ToeflSlangClient } from "../api/client";
import { buildDictionaryProPrompts } from "./prompt";
import { DictionaryProMode, DictionaryProQuery, DictionaryProTarget } from "./types";

const VALID_MODES: DictionaryProMode[] = ["meaning", "conversion", "upgrade", "comparison"];
const VALID_TARGETS: DictionaryProTarget[] = [
  "toefl-writing",
  "toefl-speaking",
  "general-academic",
  "daily-english",
];

function printUsage(): void {
  const usage = `
Dictionary Pro CLI

Usage:
  npm start -- --text "<expression>" [--context "<sentence>"] [--mode <mode>] [--target <target>] [--dry-run]

Options:
  --text, -t      Required. Word, phrase, or sentence fragment to process.
  --context, -c   Optional. Extra context for disambiguation.
  --mode, -m      Optional. meaning | conversion | upgrade | comparison
  --target, -g    Optional. toefl-writing | toefl-speaking | general-academic | daily-english
  --dry-run       Optional. Print prompt payload without API call.
  --help, -h      Show help.
`;
  console.log(usage.trim());
}

function parseArgValue(args: string[], index: number, flag: string): string {
  const value = args[index + 1];
  if (!value || value.startsWith("-")) {
    throw new Error(`Missing value for ${flag}`);
  }
  return value;
}

export function parseDictionaryProArgs(argv: string[]): DictionaryProQuery {
  const draft: Partial<DictionaryProQuery> = {};

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === "--") {
      continue;
    }

    if (token === "--help" || token === "-h") {
      printUsage();
      process.exit(0);
    }

    if (token === "--dry-run") {
      draft.dryRun = true;
      continue;
    }

    if (token === "--text" || token === "-t") {
      draft.text = parseArgValue(argv, i, token);
      i += 1;
      continue;
    }

    if (token === "--context" || token === "-c") {
      draft.context = parseArgValue(argv, i, token);
      i += 1;
      continue;
    }

    if (token === "--mode" || token === "-m") {
      const mode = parseArgValue(argv, i, token) as DictionaryProMode;
      if (!VALID_MODES.includes(mode)) {
        throw new Error(`Invalid mode "${mode}". Allowed: ${VALID_MODES.join(", ")}`);
      }
      draft.mode = mode;
      i += 1;
      continue;
    }

    if (token === "--target" || token === "-g") {
      const target = parseArgValue(argv, i, token) as DictionaryProTarget;
      if (!VALID_TARGETS.includes(target)) {
        throw new Error(`Invalid target "${target}". Allowed: ${VALID_TARGETS.join(", ")}`);
      }
      draft.target = target;
      i += 1;
      continue;
    }

    throw new Error(`Unknown option: ${token}`);
  }

  if (!draft.text || !draft.text.trim()) {
    throw new Error(`Missing required --text. Run with --help for usage.`);
  }

  const query: DictionaryProQuery = {
    ...draft,
    text: draft.text.trim(),
  };

  if (query.context) {
    query.context = query.context.trim();
  }

  return query;
}

export async function runDictionaryProCli(argv: string[]): Promise<void> {
  const query = parseDictionaryProArgs(argv);
  const prompts = buildDictionaryProPrompts(query);

  console.log("Dictionary Pro");
  console.log(`text: ${query.text}`);
  console.log(`mode: ${query.mode ?? "auto-detect"}`);
  console.log(`target: ${query.target ?? "toefl-writing"}`);
  if (query.context) {
    console.log(`context: ${query.context}`);
  }
  console.log("=".repeat(60));

  if (query.dryRun) {
    console.log("[DRY RUN] system prompt length:", prompts.systemPrompt.length);
    console.log("\n[DRY RUN] user prompt:\n");
    console.log(prompts.userPrompt);
    return;
  }

  const client = new ToeflSlangClient();
  await client.chatStreaming(prompts.systemPrompt, prompts.userPrompt);
}
