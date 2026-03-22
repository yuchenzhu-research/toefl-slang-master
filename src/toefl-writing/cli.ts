import "dotenv/config";

import * as fs from "fs";
import * as path from "path";
import { ToeflSlangClient } from "../api/client";
import { PROVIDER_APIS } from "../providers/types";
import { buildToeflWritingPrompts } from "./prompt";
import { inferWritingScope } from "./schema";
import { runToeflWritingQuery } from "./runner";
import { ToeflWritingQuery, ToeflWritingSourcePayload } from "./types";

const VALID_PROTOCOLS = [...PROVIDER_APIS];

function printUsage(): void {
  const usage = `
TOEFL Coach CLI

Usage:
  coachpro "<essay-or-paragraph>" [--title "<title>"] [--provider <id>] [--dry-run]
  coachpro providers
  npm run coach -- --text "<essay-or-paragraph>" [--title "<title>"] [--provider <id>] [--dry-run]
  npm run coach -- --file <essay.md> [--title "<title>"] [--provider <id>] [--json]

Options:
  --text            Optional. Inline essay, paragraph, or sentence. You can also pass it as the first positional argument.
  --file            Optional. Markdown or plain-text file path.
  --title           Optional. Override source title.
  --provider, -p    Optional. Model provider. Default: openai
  --model           Optional. Provider model id.
  --api-key         Optional. API key override.
  --base-url        Optional. Provider base URL override.
  --protocol        Optional. openai-completions | openai-responses | anthropic-messages | google-generative-ai | ollama
  --max-tokens      Optional. Override max output tokens.
  --max-chars       Optional. Truncate the input before prompt assembly.
  --json            Optional. Print validated JSON instead of rendered Markdown.
  --list-providers  Optional. Print supported provider catalog.
  --dry-run         Optional. Print prompt payload without API call.
  --cloudflare-account-id Optional. Cloudflare AI Gateway account id.
  --cloudflare-gateway-id Optional. Cloudflare AI Gateway gateway id.
  --help, -h        Show help.
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

export function parseToeflWritingArgs(argv: string[]): ToeflWritingQuery {
  const draft: Partial<ToeflWritingQuery> = {};

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

    if (token === "--json") {
      draft.jsonOutput = true;
      continue;
    }

    if (token === "--list-providers") {
      draft.listProviders = true;
      continue;
    }

    if (!token.startsWith("-")) {
      if (!draft.text) {
        draft.text = token;
        continue;
      }
      throw new Error(`Unexpected positional argument: ${token}`);
    }

    if (token === "--text") {
      draft.text = parseArgValue(argv, i, token);
      i += 1;
      continue;
    }

    if (token === "--file") {
      draft.filePath = parseArgValue(argv, i, token);
      i += 1;
      continue;
    }

    if (token === "--title") {
      draft.title = parseArgValue(argv, i, token);
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

    if (token === "--max-chars") {
      const rawValue = parseArgValue(argv, i, token);
      const parsedValue = Number(rawValue);
      if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
        throw new Error(`Invalid --max-chars "${rawValue}". Expected a positive integer.`);
      }
      draft.maxChars = parsedValue;
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

  if (!draft.listProviders && !draft.filePath && !draft.text?.trim()) {
    throw new Error("Missing source. Use --text or --file.");
  }

  return {
    ...draft,
    text: draft.text?.trim(),
    title: draft.title?.trim(),
  };
}

export function resolveToeflWritingSource(query: ToeflWritingQuery): ToeflWritingSourcePayload {
  if (query.filePath) {
    const filePath = path.resolve(query.filePath);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const rawText = fs.readFileSync(filePath, "utf-8").trim();
    if (!rawText) {
      throw new Error(`File is empty: ${filePath}`);
    }
    return applyMaxChars({
      title: query.title?.trim() || path.basename(filePath, path.extname(filePath)),
      sourceType: "file",
      sourceName: path.basename(filePath),
      text: rawText,
      maxChars: query.maxChars,
    });
  }

  const rawText = query.text?.trim();
  if (!rawText) {
    throw new Error("Missing --text input.");
  }

  return applyMaxChars({
    title: query.title?.trim() || inferDefaultTitle(rawText),
    sourceType: "text",
    sourceName: "inline-text",
    text: rawText,
    maxChars: query.maxChars,
  });
}

function applyMaxChars(params: {
  title: string;
  sourceType: ToeflWritingSourcePayload["sourceType"];
  sourceName: string;
  text: string;
  maxChars?: number;
}): ToeflWritingSourcePayload {
  const maxChars = params.maxChars ?? 12000;
  let text = params.text;
  let truncated = false;
  const warnings: string[] = [];

  if (maxChars > 0 && text.length > maxChars) {
    text = text.slice(0, maxChars).trimEnd();
    truncated = true;
    warnings.push("Source text was truncated before prompt assembly.");
  }

  return {
    title: params.title,
    sourceType: params.sourceType,
    sourceName: params.sourceName,
    text,
    charCount: text.length,
    truncated,
    warnings,
  };
}

function inferDefaultTitle(text: string): string {
  const scope = inferWritingScope(text);
  if (scope === "sentence") {
    return "Sentence review";
  }
  if (scope === "paragraph") {
    return "Paragraph review";
  }
  return "Essay review";
}

export async function runToeflWritingCli(argv: string[]): Promise<void> {
  if (argv.length === 1 && argv[0] === "providers") {
    console.log(ToeflSlangClient.listProviders());
    return;
  }

  const query = parseToeflWritingArgs(argv);

  if (query.listProviders) {
    console.log(ToeflSlangClient.listProviders());
    return;
  }

  const source = resolveToeflWritingSource(query);
  const client = new ToeflSlangClient({
    provider: query.provider ?? "openai",
    model: query.model,
    apiKey: query.apiKey,
    baseUrl: query.baseUrl,
    protocol: query.protocol,
    maxTokens: query.maxTokens,
    accountId: query.cloudflareAccountId,
    gatewayId: query.cloudflareGatewayId,
  });

  console.log("TOEFL Coach");
  console.log(`title: ${source.title}`);
  console.log(`sourceType: ${source.sourceType}`);
  console.log(`scope: ${inferWritingScope(source.text)}`);
  console.log(`sourceName: ${source.sourceName}`);
  console.log(`charCount: ${source.charCount}`);
  console.log(`truncated: ${source.truncated ? "yes" : "no"}`);
  if (source.warnings.length > 0) {
    console.log(`warnings: ${source.warnings.join(" | ")}`);
  }
  console.log(client.formatPreview());
  console.log("=".repeat(60));

  const prompts = buildToeflWritingPrompts(query, source, { outputMode: "json" });
  if (query.dryRun) {
    console.log("[DRY RUN] system prompt length:", prompts.systemPrompt.length);
    console.log("\n[DRY RUN] user prompt:\n");
    console.log(prompts.userPrompt);
    return;
  }

  const result = await runToeflWritingQuery({
    query,
    clientOptions: {
      provider: query.provider ?? "openai",
      model: query.model,
      apiKey: query.apiKey,
      baseUrl: query.baseUrl,
      protocol: query.protocol,
      maxTokens: query.maxTokens,
      accountId: query.cloudflareAccountId,
      gatewayId: query.cloudflareGatewayId,
    },
    source,
  });

  process.stdout.write("\n");
  process.stdout.write(
    query.jsonOutput ? JSON.stringify(result.structured, null, 2) : result.markdown,
  );
  process.stdout.write("\n\n");
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0) {
    printUsage();
    return;
  }

  await runToeflWritingCli(argv);
}

if (require.main === module) {
  main().catch((error) => {
    console.error("TOEFL Coach error:", error.message);
    process.exit(1);
  });
}
