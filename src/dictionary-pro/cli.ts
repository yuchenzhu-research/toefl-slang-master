import { ToeflSlangClient } from "../platform/client";
import { LocaleManager } from "../platform/locale";
import { PROVIDER_APIS } from "../platform/providers/types";
import { buildDictionaryProPrompts } from "./prompt";
import { runDictionaryProQuery } from "./runner";
import { DictionaryProMode, DictionaryProQuery, DictionaryProTarget } from "./types";

const VALID_MODES: DictionaryProMode[] = ["meaning", "conversion", "upgrade", "comparison"];
const VALID_TARGETS: DictionaryProTarget[] = [
  "toefl-writing",
  "toefl-speaking",
  "general-academic",
  "daily-english",
];
const VALID_PROTOCOLS = [...PROVIDER_APIS];

function printUsage(): void {
  const usage = `
Dictionary Pro CLI

Usage:
  dictpro "<expression>" [--context "<sentence>"] [--mode <mode>] [--target <target>] [--provider <id>] [--model <id>] [--dry-run]
  dictpro --text "<expression>" [--context "<sentence>"] [--mode <mode>] [--target <target>] [--provider <id>] [--model <id>] [--dry-run]
  dictpro providers
  dictpro eval --provider <id> [--case <id-or-text>] [--limit <n>] [--json]
  dictpro bench [--providers <provider[:model],...>] [--case <id-or-text>] [--limit <n>] [--json]
  npm run dict -- --text "<expression>" [--context "<sentence>"] [--mode <mode>] [--target <target>] [--provider <id>] [--model <id>] [--dry-run]

Options:
  --text, -t      Word, phrase, or sentence fragment to process. You can also pass it as the first positional argument.
  --context, -c   Optional. Extra context for disambiguation.
  --mode, -m      Optional. meaning | conversion | upgrade | comparison
  --target, -g    Optional. toefl-writing | toefl-speaking | general-academic | daily-english
  --locale        Optional. Output locale for user-facing text. (zh-Hans | zh-Hant | en)
  --provider, -p  Optional. Gateway/provider runtime. Default: (auto-detected from .env)
  --model         Optional. Provider model id.
  --api-key       Optional. API key override.
  --base-url      Optional. Provider base URL override.
  --protocol      Optional. openai-completions | openai-responses | anthropic-messages | google-generative-ai | ollama
  --max-tokens    Optional. Override max output tokens.
  --cloudflare-account-id Optional. Cloudflare AI Gateway account id.
  --cloudflare-gateway-id Optional. Cloudflare AI Gateway gateway id.
  --json          Optional. Print validated JSON instead of rendered Markdown.
  --list-providers Print supported provider catalog.
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

    if (!token.startsWith("-")) {
      if (!draft.text) {
        draft.text = token;
        continue;
      }
      throw new Error(`Unexpected positional argument: ${token}`);
    }

    if (token === "--dry-run") {
      draft.dryRun = true;
      continue;
    }

    if (token === "--locale") {
      LocaleManager.setLocale(parseArgValue(argv, i, token));
      i += 1;
      continue;
    }

    if (token === "--list-providers") {
      draft.listProviders = true;
      continue;
    }

    if (token === "--json") {
      draft.jsonOutput = true;
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

    if (token === "--provider" || token === "-p") {
      draft.provider = parseArgValue(argv, i, token);
      i += 1;
      continue;
    }

    if (token === "--model") {
      draft.model = parseArgValue(argv, i, token);
      i += 1;
      continue;
    }

    if (token === "--api-key") {
      draft.apiKey = parseArgValue(argv, i, token);
      i += 1;
      continue;
    }

    if (token === "--base-url") {
      draft.baseUrl = parseArgValue(argv, i, token);
      i += 1;
      continue;
    }

    if (token === "--protocol") {
      const protocol = parseArgValue(argv, i, token);
      if (!VALID_PROTOCOLS.includes(protocol as (typeof VALID_PROTOCOLS)[number])) {
        throw new Error(`Invalid protocol "${protocol}". Allowed: ${VALID_PROTOCOLS.join(", ")}`);
      }
      draft.protocol = protocol as (typeof VALID_PROTOCOLS)[number];
      i += 1;
      continue;
    }

    if (token === "--max-tokens") {
      const rawValue = parseArgValue(argv, i, token);
      const parsedValue = Number(rawValue);
      if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
        throw new Error(`Invalid --max-tokens "${rawValue}". Expected a positive integer.`);
      }
      draft.maxTokens = parsedValue;
      i += 1;
      continue;
    }

    if (token === "--cloudflare-account-id") {
      draft.cloudflareAccountId = parseArgValue(argv, i, token);
      i += 1;
      continue;
    }

    if (token === "--cloudflare-gateway-id") {
      draft.cloudflareGatewayId = parseArgValue(argv, i, token);
      i += 1;
      continue;
    }

    throw new Error(`Unknown option: ${token}`);
  }

  if (!draft.listProviders && (!draft.text || !draft.text.trim())) {
    throw new Error(`Missing required --text. Run with --help for usage.`);
  }

  const query: DictionaryProQuery = {
    ...draft,
    text: draft.text?.trim(),
  };

  if (query.context) {
    query.context = query.context.trim();
  }

  return query;
}

export async function runDictionaryProCli(argv: string[]): Promise<void> {
  const query = parseDictionaryProArgs(argv);

  if (query.listProviders) {
    console.log(ToeflSlangClient.listProviders());
    return;
  }

  if (!query.text) {
    throw new Error("Missing required --text.");
  }

  const prompts = buildDictionaryProPrompts(query, { outputMode: "json" });
  const client = await ToeflSlangClient.create({
    provider: query.provider,
    model: query.model,
    apiKey: query.apiKey,
    baseUrl: query.baseUrl,
    protocol: query.protocol,
    maxTokens: query.maxTokens,
    accountId: query.cloudflareAccountId,
    gatewayId: query.cloudflareGatewayId,
  });
  const preview = client.formatPreview();

  console.log("Dictionary Pro");
  console.log(`text: ${query.text}`);
  console.log(`mode: ${query.mode ?? "auto-detect"}`);
  console.log(`target: ${query.target ?? "toefl-writing"}`);
  console.log(preview);
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

  const result = await runDictionaryProQuery({
    query,
    clientOptions: {
      provider: query.provider,
      model: query.model,
      apiKey: query.apiKey,
      baseUrl: query.baseUrl,
      protocol: query.protocol,
      maxTokens: query.maxTokens,
      accountId: query.cloudflareAccountId,
      gatewayId: query.cloudflareGatewayId,
    },
  });

  process.stdout.write("\n");
  process.stdout.write(
    query.jsonOutput ? JSON.stringify(result.structured, null, 2) : result.markdown,
  );
  process.stdout.write("\n\n");
}
