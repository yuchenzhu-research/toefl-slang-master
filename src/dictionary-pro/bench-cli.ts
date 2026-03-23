import "dotenv/config";

import {
  formatDictionaryProBenchmarkReport,
  parseBenchmarkTargets,
  runDictionaryProBenchmark,
} from "./benchmark";
import { PROVIDER_APIS } from "../platform/providers/types";

type BenchCliOptions = {
  providers?: string;
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
  console.log(`Dictionary Pro Benchmark

Usage:
  tsm bench [--providers <provider[:model],...>] [--case <id-or-text>] [--limit <n>] [--json]
  tsm dict bench [--providers <provider[:model],...>] [--case <id-or-text>] [--limit <n>] [--json]
  dictpro bench [--providers <provider[:model],...>] [--case <id-or-text>] [--limit <n>] [--json]
  npm run dict:bench -- [--providers <provider[:model],...>] [--case <id-or-text>] [--limit <n>] [--json]

Options:
  --providers        Optional. Comma-separated providers. Supports provider:model syntax.
  --api-key          Optional. Shared API key override.
  --base-url         Optional. Shared base URL override.
  --protocol         Optional. ${VALID_PROTOCOLS.join(" | ")}
  --max-tokens       Optional. Max output tokens.
  --case             Optional. Filter cases by id or input substring.
  --limit            Optional. Max number of cases per provider.
  --fail-fast        Optional. Stop each provider run after first failure.
  --json             Optional. Print JSON report.
  --cases-path       Optional. Alternate evaluation cases markdown path.
  --cloudflare-account-id Optional. Shared Cloudflare AI Gateway account id.
  --cloudflare-gateway-id Optional. Shared Cloudflare AI Gateway gateway id.
  --help             Show help.

Notes:
  - If --providers is omitted, benchmark will use every provider that has an API key in .env / env / local config.
  - Shared overrides only make sense when the selected providers use the same gateway shape.
`);
}

function parseArgValue(args: string[], index: number, flag: string): string {
  const value = args[index + 1];
  if (!value || value.startsWith("-")) {
    throw new Error(`Missing value for ${flag}`);
  }
  return value;
}

function parseArgs(argv: string[]): BenchCliOptions {
  const options: Partial<BenchCliOptions> = {};

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

    if (token === "--providers") {
      options.providers = parseArgValue(argv, index, token);
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

  return options as BenchCliOptions;
}

export async function runDictionaryProBenchCli(argv: string[]): Promise<void> {
  const options = parseArgs(argv);
  const report = await runDictionaryProBenchmark({
    targets: parseBenchmarkTargets(options.providers),
    clientDefaults: {
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
    : formatDictionaryProBenchmarkReport(report);

  process.stdout.write(`${output}\n`);

  if (report.providers.some((provider) => provider.failed > 0)) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  runDictionaryProBenchCli(process.argv.slice(2)).catch((error) => {
    console.error(
      "Dictionary Pro benchmark error:",
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  });
}
