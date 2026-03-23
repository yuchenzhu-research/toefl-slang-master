import * as fs from "fs";
import * as path from "path";
import { ToeflSlangClientOptions } from "../platform/client";
import {
  DictionaryProAmbiguousResponse,
  DictionaryProComparisonResponse,
  DictionaryProSentenceUpgradeResponse,
  DictionaryProStructuredResponse,
  DictionaryProWordPhraseResponse,
} from "./schema";
import { runDictionaryProQuery } from "./runner";
import { DictionaryProQuery, DictionaryProTarget } from "./types";

const DEFAULT_EVALUATION_CASES_PATH = path.join(
  __dirname,
  "..",
  "..",
  "skills",
  "dictionary-pro",
  "references",
  "evaluation-cases.md",
);

const WARNING_PATTERNS = [
  /warn/i,
  /avoid/i,
  /reject/i,
  /risk/i,
  /unsafe/i,
  /awkward/i,
  /不建议/,
  /风险/,
  /谨慎/,
  /避免/,
  /不自然/,
  /不能/,
] as const;

export type DictionaryProEvaluationCase = {
  id: string;
  section: string;
  type: string;
  input: string;
  context?: string;
  target: DictionaryProTarget;
  expectedBehavior: string;
};

export type DictionaryProEvaluationCheck = {
  name: string;
  passed: boolean;
  detail: string;
};

export type DictionaryProEvaluationCaseResult = {
  case: DictionaryProEvaluationCase;
  query: DictionaryProQuery;
  passed: boolean;
  score: number;
  checks: DictionaryProEvaluationCheck[];
  attempts?: number;
  repaired?: boolean;
  kind?: DictionaryProStructuredResponse["kind"];
  markdown?: string;
  error?: string;
};

export type DictionaryProEvaluationReport = {
  provider: string;
  model?: string;
  total: number;
  passed: number;
  failed: number;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  results: DictionaryProEvaluationCaseResult[];
};

export type DictionaryProEvaluationOptions = {
  clientOptions: ToeflSlangClientOptions;
  casesPath?: string;
  caseFilter?: string;
  limit?: number;
  failFast?: boolean;
};

export function loadDictionaryProEvaluationCases(
  filePath: string = DEFAULT_EVALUATION_CASES_PATH,
): DictionaryProEvaluationCase[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split(/\r?\n/);
  const cases: DictionaryProEvaluationCase[] = [];
  let currentSection = "Unknown";

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]?.trim() ?? "";

    if (line.startsWith("## ")) {
      currentSection = line.replace(/^##\s+/, "").trim();
      continue;
    }

    if (!line.startsWith("| ID |")) {
      continue;
    }

    const divider = lines[index + 1]?.trim() ?? "";
    if (!divider.startsWith("| ---")) {
      continue;
    }

    index += 2;
    while (index < lines.length) {
      const row = lines[index]?.trim() ?? "";
      if (!row.startsWith("|")) {
        index -= 1;
        break;
      }

      const cells = parseMarkdownTableRow(row);
      if (cells.length >= 6) {
        const [id, type, input, context, target, expectedBehavior] = cells;
        if (id && type && input && target && expectedBehavior) {
          cases.push({
            id,
            section: currentSection,
            type,
            input,
            context: context && context !== "none" ? context : undefined,
            target: target as DictionaryProTarget,
            expectedBehavior,
          });
        }
      }

      index += 1;
    }
  }

  return cases;
}

export async function runDictionaryProEvaluation(
  options: DictionaryProEvaluationOptions,
): Promise<DictionaryProEvaluationReport> {
  const startedAt = new Date();
  let cases = loadDictionaryProEvaluationCases(options.casesPath);

  if (options.caseFilter?.trim()) {
    const needle = options.caseFilter.trim().toLowerCase();
    cases = cases.filter(
      (entry) =>
        entry.id.toLowerCase().includes(needle) || entry.input.toLowerCase().includes(needle),
    );
  }

  if (options.limit && options.limit > 0) {
    cases = cases.slice(0, options.limit);
  }

  const results: DictionaryProEvaluationCaseResult[] = [];

  for (const entry of cases) {
    const query = buildEvaluationQuery(entry);

    try {
      const result = await runDictionaryProQuery({
        query,
        clientOptions: options.clientOptions,
      });

      const checks = evaluateStructuredResponse(entry, result.structured);
      const passedChecks = checks.filter((check) => check.passed).length;
      const score = checks.length === 0 ? 0 : passedChecks / checks.length;
      const passed = checks.every((check) => check.passed);

      results.push({
        case: entry,
        query,
        passed,
        score,
        checks,
        attempts: result.attempts,
        repaired: result.repaired,
        kind: result.structured.kind,
        markdown: result.markdown,
      });

      if (!passed && options.failFast) {
        break;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      results.push({
        case: entry,
        query,
        passed: false,
        score: 0,
        checks: [
          {
            name: "runtime",
            passed: false,
            detail: message,
          },
        ],
        error: message,
      });

      if (options.failFast) {
        break;
      }
    }
  }

  const finishedAt = new Date();
  const passed = results.filter((result) => result.passed).length;

  return {
    provider: options.clientOptions.provider,
    model: options.clientOptions.model,
    total: results.length,
    passed,
    failed: results.length - passed,
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs: finishedAt.getTime() - startedAt.getTime(),
    results,
  };
}

export function formatDictionaryProEvaluationReport(
  report: DictionaryProEvaluationReport,
): string {
  const lines = [
    "Dictionary Pro Evaluation Report",
    `provider: ${report.provider}`,
    `model: ${report.model ?? "(default)"}`,
    `total: ${report.total}`,
    `passed: ${report.passed}`,
    `failed: ${report.failed}`,
    `durationMs: ${report.durationMs}`,
    "",
  ];

  for (const result of report.results) {
    lines.push(
      `${result.passed ? "PASS" : "FAIL"} ${result.case.id} [${result.case.section}] score=${result.score.toFixed(2)}`,
    );
    lines.push(`  input: ${result.case.input}`);
    lines.push(`  kind: ${result.kind ?? "runtime-error"}`);
    if (typeof result.attempts === "number") {
      lines.push(`  attempts: ${result.attempts}${result.repaired ? " (repaired)" : ""}`);
    }
    for (const check of result.checks) {
      lines.push(`  - ${check.passed ? "ok" : "x"} ${check.name}: ${check.detail}`);
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}

function parseMarkdownTableRow(row: string): string[] {
  return row
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
}

function buildEvaluationQuery(entry: DictionaryProEvaluationCase): DictionaryProQuery {
  const normalizedType = entry.type.trim().toLowerCase();
  const query: DictionaryProQuery = {
    text: entry.input,
    target: entry.target,
  };

  const mode = mapEvaluationTypeToMode(normalizedType);
  if (mode) {
    query.mode = mode;
  }

  if (entry.context?.trim()) {
    query.context = entry.context.trim();
  }

  return query;
}

function mapEvaluationTypeToMode(type: string): DictionaryProQuery["mode"] | undefined {
  if (type === "meaning" || type === "conversion" || type === "upgrade" || type === "comparison") {
    return type;
  }

  if (type === "ambiguity") {
    return "meaning";
  }

  if (type === "fake-advanced risk" || type === "collocation" || type === "polarity drift") {
    return "upgrade";
  }

  if (type === "over-upgrade") {
    return "upgrade";
  }

  return undefined;
}

function evaluateStructuredResponse(
  entry: DictionaryProEvaluationCase,
  response: DictionaryProStructuredResponse,
): DictionaryProEvaluationCheck[] {
  const checks: DictionaryProEvaluationCheck[] = [];
  const expectedBehavior = entry.expectedBehavior.toLowerCase();

  checks.push({
    name: "query-match",
    passed: response.query.trim().toLowerCase() === entry.input.trim().toLowerCase(),
    detail: `expected "${entry.input}", got "${response.query}"`,
  });

  checks.push({
    name: "target-match",
    passed: response.target === entry.target,
    detail: `expected "${entry.target}", got "${response.target}"`,
  });

  checks.push(checkKindCompatibility(entry.type, response));
  checks.push(checkVariantCount(entry.expectedBehavior, response));

  if (expectedBehavior.includes("multiple senses") || expectedBehavior.includes("distinguish")) {
    checks.push(checkMultiSenseBehavior(response));
  }

  if (expectedBehavior.includes("spoken-natural option")) {
    checks.push(checkSpeakingDualTrack(response));
  }

  if (
    expectedBehavior.includes("warn") ||
    expectedBehavior.includes("reject") ||
    expectedBehavior.includes("avoid")
  ) {
    checks.push(checkWarningSignal(response));
  }

  if (expectedBehavior.includes("register") || entry.type.toLowerCase() === "comparison") {
    checks.push(checkRegisterExplanation(response));
  }

  return checks;
}

function checkKindCompatibility(
  type: string,
  response: DictionaryProStructuredResponse,
): DictionaryProEvaluationCheck {
  const normalizedType = type.trim().toLowerCase();
  let passed = true;
  let detail = `kind=${response.kind}`;

  if (normalizedType === "comparison") {
    passed = response.kind === "comparison";
  } else if (normalizedType === "meaning") {
    passed = response.kind === "word_phrase" || response.kind === "ambiguous";
  } else if (normalizedType === "conversion") {
    passed = response.kind === "word_phrase" || response.kind === "sentence_upgrade";
  } else if (normalizedType === "upgrade") {
    passed = response.kind === "word_phrase" || response.kind === "sentence_upgrade";
  } else if (normalizedType === "ambiguity") {
    passed = response.kind === "ambiguous" || response.kind === "word_phrase";
  }

  return {
    name: "kind-compatibility",
    passed,
    detail,
  };
}

function checkVariantCount(
  expectedBehavior: string,
  response: DictionaryProStructuredResponse,
): DictionaryProEvaluationCheck {
  const lower = expectedBehavior.toLowerCase();
  let passed = true;
  let detail = "no minimum alternatives required";

  if (lower.includes("ranked alternatives") || lower.includes("offer ranked alternatives")) {
    const count = getAlternativeCount(response);
    passed = count >= 2;
    detail = `alternative count=${count}`;
  } else if (lower.includes("2 to 4") || lower.includes("side by side")) {
    const count = getAlternativeCount(response);
    passed = count >= 2;
    detail = `alternative count=${count}`;
  }

  return {
    name: "alternative-count",
    passed,
    detail,
  };
}

function checkMultiSenseBehavior(response: DictionaryProStructuredResponse): DictionaryProEvaluationCheck {
  const count =
    response.kind === "ambiguous"
      ? response.possibleSenses.length
      : response.kind === "word_phrase"
        ? response.translation.length
        : 0;

  return {
    name: "multi-sense",
    passed: count >= 2,
    detail: `sense count=${count}`,
  };
}

function checkSpeakingDualTrack(response: DictionaryProStructuredResponse): DictionaryProEvaluationCheck {
  if (response.kind !== "word_phrase") {
    return {
      name: "spoken-dual-track",
      passed: false,
      detail: `expected word_phrase, got ${response.kind}`,
    };
  }

  return {
    name: "spoken-dual-track",
    passed: response.slang.variants.length >= 1 && response.alignment.length >= 1,
    detail: `slang variants=${response.slang.variants.length}, alignment=${response.alignment.length}`,
  };
}

function checkWarningSignal(response: DictionaryProStructuredResponse): DictionaryProEvaluationCheck {
  const corpus = collectResponseText(response).join(" ");
  const passed = WARNING_PATTERNS.some((pattern) => pattern.test(corpus));
  return {
    name: "warning-signal",
    passed,
    detail: passed ? "warning marker detected" : "no warning marker detected",
  };
}

function checkRegisterExplanation(
  response: DictionaryProStructuredResponse,
): DictionaryProEvaluationCheck {
  if (response.kind === "comparison") {
    const passed = response.items.every(
      (item) => item.register.trim().length > 0 && item.difference.trim().length > 0,
    );
    return {
      name: "register-explanation",
      passed,
      detail: `comparison items=${response.items.length}`,
    };
  }

  if (response.kind === "word_phrase") {
    return {
      name: "register-explanation",
      passed:
        response.slang.register.trim().length > 0 &&
        response.analysis.toeflExplanation.trim().length > 0,
      detail: `slang register="${response.slang.register}"`,
    };
  }

  if (response.kind === "sentence_upgrade") {
    return {
      name: "register-explanation",
      passed: response.explanation.trim().length > 0,
      detail: "sentence explanation present",
    };
  }

  return {
    name: "register-explanation",
    passed: response.clarificationPrompt.trim().length > 0,
    detail: "clarification prompt present",
  };
}

function getAlternativeCount(response: DictionaryProStructuredResponse): number {
  if (response.kind === "word_phrase") {
    return response.alignment.length;
  }
  if (response.kind === "sentence_upgrade") {
    return response.replacements.length;
  }
  if (response.kind === "comparison") {
    return response.items.length;
  }
  return response.resolvedCard?.alignment.length ?? response.possibleSenses.length;
}

function collectResponseText(response: DictionaryProStructuredResponse): string[] {
  if (response.kind === "word_phrase") {
    return [
      ...response.translation,
      response.slang.register,
      response.slang.tone,
      ...response.slang.variants,
      ...response.alignment.flatMap((item) => [item.expression, item.note]),
      response.frequency,
      response.analysis.sourceExplanation,
      response.analysis.toeflExplanation,
      ...(response.notes ?? []),
    ];
  }

  if (response.kind === "sentence_upgrade") {
    return [
      response.problem,
      ...response.replacements.flatMap((item) => [item.source, item.replacement, item.reason]),
      response.recommendedRewrite,
      response.explanation,
      ...(response.notes ?? []),
    ];
  }

  if (response.kind === "comparison") {
    return [
      ...response.items.flatMap((item) => [
        item.expression,
        item.register,
        item.difference,
        item.toeflSuitability,
      ]),
      response.summary ?? "",
      ...(response.notes ?? []),
    ];
  }

  return [
    ...response.possibleSenses,
    response.clarificationPrompt,
    ...(response.notes ?? []),
    ...(response.resolvedCard ? collectResponseText(response.resolvedCard) : []),
  ];
}
