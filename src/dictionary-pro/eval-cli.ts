import "dotenv/config";

import { PROVIDER_APIS } from "../platform/providers/types";
import { runDictionaryProEvaluation, formatDictionaryProEvaluationReport } from "./evaluation";

type EvalCliOptions = {
  provider: string;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  protocol?: (typeof PROVIDER_APIS)[number];
  maxTokens?: number;
  caseFilter?: string;
  limit?: number;
  failFast?: boolean;
  json?: boolean;
  casesPath?: string;
  accountId?: string;
  gatewayId?: string;
};

const VALID_PROTOCOLS = [...PROVIDER_APIS];

function printUsage(): void {
  console.log(`Dictionary Pro Eval

Usage:
  dictpro eval --provider <id> [--model <id>] [--case <id-or-text>] [--limit <n>] [--json]
  dictpro-eval --provider <id> [--model <id>] [--case <id-or-text>] [--limit <n>] [--json]
  npm run dict:eval -- --provider <id> [--model <id>] [--case <id-or-text>] [--limit <n>] [--json]

Options:
  --provider         Required. Provider id.
  --model            Optional. Model id override.
  --api-key          Optional. API key override.
  --base-url         Optional. Base URL override.
  --protocol         Optional. ${VALID_PROTOCOLS.join(" | ")}
  --max-tokens       Optional. Max output tokens.
  --case             Optional. Filter cases by id or input substring.
  --limit            Optional. Max number of cases to run.
  --fail-fast        Optional. Stop after first failure.
  --json             Optional. Print JSON report.
  --cases-path       Optional. Alternate evaluation cases markdown path.
  --cloudflare-account-id Optional. Cloudflare AI Gateway account id.
  --cloudflare-gateway-id Optional. Cloudflare AI Gateway gateway id.
  --help             Show help.
`);
}

function parseArgValue(args: string[], index: number, flag: string): string {
  const value = args[index + 1];
  if (!value || value.startsWith("-")) {
    throw new Error(`Missing value for ${flag}`);
  }
  return value;
}

function parseArgs(argv: string[]): EvalCliOptions {
  const options: Partial<EvalCliOptions> = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--") {
      continue;
    }

    if (token === "--help" || token === "-h") {
      printUsage();
      process.exit(0);
    }

    if (token === "--fail-fast") {
      options.failFast = true;
      continue;
    }

    if (token === "--json") {
      options.json = true;
      continue;
    }

    if (token === "--provider") {
      options.provider = parseArgValue(argv, index, token);
      index += 1;
      continue;
    }

    if (token === "--model") {
      options.model = parseArgValue(argv, index, token);
      index += 1;
      continue;
    }

    if (token === "--api-key") {
      options.apiKey = parseArgValue(argv, index, token);
      index += 1;
      continue;
    }

    if (token === "--base-url") {
      options.baseUrl = parseArgValue(argv, index, token);
      index += 1;
      continue;
    }

    if (token === "--protocol") {
      const protocol = parseArgValue(argv, index, token);
      if (!VALID_PROTOCOLS.includes(protocol as (typeof VALID_PROTOCOLS)[number])) {
        throw new Error(`Invalid protocol "${protocol}". Allowed: ${VALID_PROTOCOLS.join(", ")}`);
      }
      options.protocol = protocol as (typeof VALID_PROTOCOLS)[number];
      index += 1;
      continue;
    }

    if (token === "--max-tokens") {
      const raw = parseArgValue(argv, index, token);
      const parsed = Number(raw);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error(`Invalid --max-tokens "${raw}".`);
      }
      options.maxTokens = parsed;
      index += 1;
      continue;
    }

    if (token === "--case") {
      options.caseFilter = parseArgValue(argv, index, token);
      index += 1;
      continue;
    }

    if (token === "--limit") {
      const raw = parseArgValue(argv, index, token);
      const parsed = Number(raw);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error(`Invalid --limit "${raw}".`);
      }
      options.limit = parsed;
      index += 1;
      continue;
    }

    if (token === "--cases-path") {
      options.casesPath = parseArgValue(argv, index, token);
      index += 1;
      continue;
    }

    if (token === "--cloudflare-account-id") {
      options.accountId = parseArgValue(argv, index, token);
      index += 1;
      continue;
    }

    if (token === "--cloudflare-gateway-id") {
      options.gatewayId = parseArgValue(argv, index, token);
      index += 1;
      continue;
    }

    throw new Error(`Unknown option: ${token}`);
  }

  if (!options.provider?.trim()) {
    throw new Error("Missing required --provider.");
  }

  return options as EvalCliOptions;
}

export async function runDictionaryProEvalCli(argv: string[]): Promise<void> {
  const options = parseArgs(argv);
  const report = await runDictionaryProEvaluation({
    clientOptions: {
      provider: options.provider,
      model: options.model,
      apiKey: options.apiKey,
      baseUrl: options.baseUrl,
      protocol: options.protocol,
      maxTokens: options.maxTokens,
      accountId: options.accountId,
      gatewayId: options.gatewayId,
    },
    casesPath: options.casesPath,
    caseFilter: options.caseFilter,
    limit: options.limit,
    failFast: options.failFast,
  });

  const output = options.json
    ? JSON.stringify(report, null, 2)
    : formatDictionaryProEvaluationReport(report);

  process.stdout.write(`${output}\n`);

  if (report.failed > 0) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  runDictionaryProEvalCli(process.argv.slice(2)).catch((error) => {
    console.error(
      "Dictionary Pro eval error:",
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  });
}
