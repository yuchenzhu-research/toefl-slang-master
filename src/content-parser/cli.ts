import "dotenv/config";

import { ToeflSlangClient } from "../platform/client";
import { LocaleManager } from "../platform/locale";
import { PROVIDER_APIS } from "../platform/providers/types";
import { resolveContentParserSource } from "./extractor";
import { buildContentParserPrompts } from "./prompt";
import { runContentParserQuery } from "./runner";
import { resolveActiveFocus } from "./schema";
import { ContentParserFocus, ContentParserQuery } from "./types";

const VALID_FOCUS: ContentParserFocus[] = [
  "full",
  "syntax",
  "slang",
  "culture",
  "conversion",
];
const VALID_PROTOCOLS = [...PROVIDER_APIS];

function printUsage(): void {
  const usage = `
Content Parser CLI

Usage:
  contentpro --pdf <file.pdf> [--focus <focus>] [--provider <id>] [--dry-run]
  contentpro --file <article.md> [--focus <focus>] [--extract-only]
  contentpro --text "<content>" [--title "<title>"] [--json]
  contentpro providers
  npm run content -- --pdf <file.pdf> [--focus <focus>] [--provider <id>] [--dry-run]
  npm run content -- --file <article.md> [--focus <focus>] [--extract-only]
  npm run content -- --text "<content>" [--title "<title>"] [--json]

Options:
  --pdf             Optional. PDF file path.
  --file            Optional. Markdown or plain-text file path.
  --text            Optional. Inline text content.
  --title           Optional. Override source title.
  --focus           Optional. full | syntax | slang | culture | conversion
  --locale          Optional. Output locale for user-facing text. (zh-Hans | zh-Hant | en)
  --provider, -p    Optional. Gateway/provider runtime. Default: openai
  --model           Optional. Provider model id.
  --api-key         Optional. API key override.
  --base-url        Optional. Provider base URL override.
  --protocol        Optional. openai-completions | openai-responses | anthropic-messages | google-generative-ai | ollama
  --max-tokens      Optional. Override max output tokens.
  --max-chars       Optional. Limit extracted source chars before prompt assembly.
  --json            Optional. Print validated JSON instead of rendered Markdown.
  --extract-only    Optional. Only extract and print source text / metadata.
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

export function parseContentParserArgs(argv: string[]): ContentParserQuery {
  const draft: Partial<ContentParserQuery> = {};

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

    if (token === "--locale") {
      LocaleManager.setLocale(parseArgValue(argv, i, token));
      i += 1;
      continue;
    }

    if (token === "--json") {
      draft.jsonOutput = true;
      continue;
    }

    if (token === "--extract-only") {
      draft.extractOnly = true;
      continue;
    }

    if (token === "--list-providers") {
      draft.listProviders = true;
      continue;
    }

    if (token === "--pdf") {
      draft.pdfPath = parseArgValue(argv, i, token);
      i += 1;
      continue;
    }

    if (token === "--file") {
      draft.filePath = parseArgValue(argv, i, token);
      i += 1;
      continue;
    }

    if (token === "--text") {
      draft.text = parseArgValue(argv, i, token);
      i += 1;
      continue;
    }

    if (token === "--title") {
      draft.title = parseArgValue(argv, i, token);
      i += 1;
      continue;
    }

    if (token === "--focus") {
      const focus = parseArgValue(argv, i, token) as ContentParserFocus;
      if (!VALID_FOCUS.includes(focus)) {
        throw new Error(`Invalid focus "${focus}". Allowed: ${VALID_FOCUS.join(", ")}`);
      }
      draft.focus = focus;
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

  if (!draft.listProviders && !draft.pdfPath && !draft.filePath && !draft.text?.trim()) {
    throw new Error("Missing source. Use --pdf, --file, or --text.");
  }

  return {
    ...draft,
    text: draft.text?.trim(),
    title: draft.title?.trim(),
  };
}

export async function runContentParserCli(argv: string[]): Promise<void> {
  if (argv.length === 1 && argv[0] === "providers") {
    console.log(ToeflSlangClient.listProviders());
    return;
  }

  const query = parseContentParserArgs(argv);

  if (query.listProviders) {
    console.log(ToeflSlangClient.listProviders());
    return;
  }

  const source = await resolveContentParserSource(query);
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

  console.log("Content Parser");
  console.log(`title: ${source.title}`);
  console.log(`sourceType: ${source.sourceType}`);
  console.log(`focus: ${resolveActiveFocus(query.focus)}`);
  console.log(`sourceName: ${source.sourceName}`);
  console.log(`charCount: ${source.charCount}`);
  console.log(`truncated: ${source.truncated ? "yes" : "no"}`);
  console.log(`extractionEngine: ${source.extractionEngine}`);
  if (typeof source.pageCount === "number") {
    console.log(`pageCount: ${source.pageCount}`);
  }
  if (source.warnings.length > 0) {
    console.log(`warnings: ${source.warnings.join(" | ")}`);
  }
  if (!query.extractOnly) {
    console.log(client.formatPreview());
  }
  console.log("=".repeat(60));

  if (query.extractOnly) {
    if (query.jsonOutput) {
      console.log(JSON.stringify(source, null, 2));
      return;
    }
    console.log(source.text);
    return;
  }

  const prompts = buildContentParserPrompts(query, source, { outputMode: "json" });
  if (query.dryRun) {
    console.log("[DRY RUN] system prompt length:", prompts.systemPrompt.length);
    console.log("\n[DRY RUN] user prompt:\n");
    console.log(prompts.userPrompt);
    return;
  }

  const result = await runContentParserQuery({
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

  await runContentParserCli(argv);
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Content Parser error:", error.message);
    process.exit(1);
  });
}
