import { ToeflSlangClientOptions } from "../api/client";
import { getLocalProviderConfig } from "../auth/manager";
import { listProviderCatalog, normalizeProviderId } from "../providers/catalog";
import { DictionaryProEvaluationReport, runDictionaryProEvaluation } from "./evaluation";

export type DictionaryProBenchmarkTarget = {
  provider: string;
  model?: string;
};

export type DictionaryProBenchmarkProviderSummary = {
  provider: string;
  model?: string;
  total: number;
  passed: number;
  failed: number;
  passRate: number;
  averageScore: number;
  durationMs: number;
  repairedCount: number;
  runtimeErrorCount: number;
  failedCaseIds: string[];
  firstError?: string;
};

export type DictionaryProBenchmarkReport = {
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  totalProviders: number;
  totalCasesPerProvider: number;
  providers: DictionaryProBenchmarkProviderSummary[];
  reports: DictionaryProEvaluationReport[];
};

export type DictionaryProBenchmarkOptions = {
  targets?: DictionaryProBenchmarkTarget[];
  clientDefaults?: Partial<ToeflSlangClientOptions>;
  casesPath?: string;
  caseFilter?: string;
  limit?: number;
  failFast?: boolean;
};

export function parseBenchmarkTargets(raw?: string): DictionaryProBenchmarkTarget[] {
  if (!raw?.trim()) {
    return detectConfiguredBenchmarkTargets();
  }

  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map(parseBenchmarkTarget);
}

export function detectConfiguredBenchmarkTargets(): DictionaryProBenchmarkTarget[] {
  return listProviderCatalog()
    .filter((entry) => {
      const hasEnv = entry.envVars.some((envVar) => Boolean(process.env[envVar]?.trim()));
      if (hasEnv) {
        return true;
      }

      const localConfig = getLocalProviderConfig(entry.id);
      return Boolean(localConfig?.apiKey);
    })
    .map((entry) => ({ provider: entry.id }));
}

export async function runDictionaryProBenchmark(
  options: DictionaryProBenchmarkOptions,
): Promise<DictionaryProBenchmarkReport> {
  const startedAt = new Date();
  const targets = options.targets?.length ? options.targets : detectConfiguredBenchmarkTargets();

  if (targets.length === 0) {
    throw new Error(
      "No benchmark providers configured. Pass --providers or configure provider API keys in .env / env / local config.",
    );
  }

  const reports: DictionaryProEvaluationReport[] = [];

  for (const target of targets) {
    const report = await runDictionaryProEvaluation({
      clientOptions: {
        provider: target.provider,
        model: target.model,
        apiKey: options.clientDefaults?.apiKey,
        baseUrl: options.clientDefaults?.baseUrl,
        protocol: options.clientDefaults?.protocol,
        maxTokens: options.clientDefaults?.maxTokens,
        accountId: options.clientDefaults?.accountId,
        gatewayId: options.clientDefaults?.gatewayId,
      },
      casesPath: options.casesPath,
      caseFilter: options.caseFilter,
      limit: options.limit,
      failFast: options.failFast,
    });

    reports.push(report);
  }

  const finishedAt = new Date();
  const providers = reports
    .map(summarizeProviderBenchmark)
    .sort((left, right) => {
      if (right.passRate !== left.passRate) {
        return right.passRate - left.passRate;
      }
      if (right.averageScore !== left.averageScore) {
        return right.averageScore - left.averageScore;
      }
      return left.durationMs - right.durationMs;
    });

  return {
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs: finishedAt.getTime() - startedAt.getTime(),
    totalProviders: providers.length,
    totalCasesPerProvider: reports[0]?.total ?? 0,
    providers,
    reports,
  };
}

export function formatDictionaryProBenchmarkReport(
  report: DictionaryProBenchmarkReport,
): string {
  const lines = [
    "Dictionary Pro Benchmark Report",
    `providers: ${report.totalProviders}`,
    `casesPerProvider: ${report.totalCasesPerProvider}`,
    `durationMs: ${report.durationMs}`,
    "",
    "Leaderboard:",
  ];

  report.providers.forEach((provider, index) => {
    lines.push(
      `${index + 1}. ${provider.provider}${provider.model ? ` (${provider.model})` : ""} passRate=${(provider.passRate * 100).toFixed(1)}% avgScore=${provider.averageScore.toFixed(2)} repaired=${provider.repairedCount} runtimeErrors=${provider.runtimeErrorCount} durationMs=${provider.durationMs}`,
    );
    if (provider.failedCaseIds.length > 0) {
      lines.push(`   failedCases: ${provider.failedCaseIds.join(", ")}`);
    }
    if (provider.firstError) {
      lines.push(`   firstError: ${provider.firstError}`);
    }
  });

  lines.push("");
  lines.push("Provider Summary:");

  for (const provider of report.providers) {
    lines.push(
      `- ${provider.provider}: passed=${provider.passed}/${provider.total}, failed=${provider.failed}, avgScore=${provider.averageScore.toFixed(2)}, repaired=${provider.repairedCount}`,
    );
  }

  return lines.join("\n");
}

function parseBenchmarkTarget(entry: string): DictionaryProBenchmarkTarget {
  const [rawProvider, ...modelParts] = entry.split(":");
  const provider = normalizeProviderId(rawProvider);
  if (!provider) {
    throw new Error(`Invalid provider target "${entry}".`);
  }

  const model = modelParts.join(":").trim() || undefined;
  return { provider, model };
}

function summarizeProviderBenchmark(
  report: DictionaryProEvaluationReport,
): DictionaryProBenchmarkProviderSummary {
  const averageScore =
    report.results.length === 0
      ? 0
      : report.results.reduce((sum, result) => sum + result.score, 0) / report.results.length;
  const repairedCount = report.results.filter((result) => result.repaired).length;
  const runtimeErrorCount = report.results.filter((result) => Boolean(result.error)).length;
  const firstError = report.results.find((result) => result.error)?.error;

  return {
    provider: report.provider,
    model: report.model,
    total: report.total,
    passed: report.passed,
    failed: report.failed,
    passRate: report.total === 0 ? 0 : report.passed / report.total,
    averageScore,
    durationMs: report.durationMs,
    repairedCount,
    runtimeErrorCount,
    failedCaseIds: report.results.filter((result) => !result.passed).map((result) => result.case.id),
    firstError,
  };
}
