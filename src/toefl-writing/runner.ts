import { ToeflSlangClient, ToeflSlangClientOptions } from "../platform/client";
import { runValidatedJsonGeneration } from "../platform/runtime/validated-json";
import { buildToeflWritingPrompts, buildToeflWritingRepairPrompts } from "./prompt";
import { ToeflWritingStructuredResponse } from "./types";
import { ToeflWritingQuery, ToeflWritingSourcePayload } from "./types";
import {
  formatToeflWritingValidationErrors,
  parseAndValidateToeflWritingResponse,
} from "./validator";

const MAX_GENERATION_ATTEMPTS = 3;

export type ToeflWritingRunResult = {
  source: ToeflWritingSourcePayload;
  structured: ToeflWritingStructuredResponse;
  markdown: string;
  rawText: string;
  attempts: number;
  repaired: boolean;
};

export async function runToeflWritingQuery(params: {
  query: ToeflWritingQuery;
  clientOptions: ToeflSlangClientOptions;
  source: ToeflWritingSourcePayload;
}): Promise<ToeflWritingRunResult> {
  const client = await ToeflSlangClient.create(params.clientOptions);
  const validated = await runValidatedJsonGeneration({
    maxAttempts: MAX_GENERATION_ATTEMPTS,
    failureLabel: "TOEFL Coach",
    generate: async ({ attempt, previousOutput, validationErrors }) => {
      const prompts =
        attempt === 1
        ? buildToeflWritingPrompts(params.query, params.source, { outputMode: "json" })
        : buildToeflWritingRepairPrompts({
            query: params.query,
            source: params.source,
            previousOutput,
            validationErrors,
          });

      return client.chat(prompts.systemPrompt, prompts.userPrompt);
    },
    parseAndValidate: (rawText) =>
      parseAndValidateToeflWritingResponse(rawText, params.query, params.source),
    formatValidationErrors: formatToeflWritingValidationErrors,
  });

  return {
    source: params.source,
    structured: validated.value,
    markdown: renderToeflWritingResponse(validated.value),
    rawText: validated.rawText,
    attempts: validated.attempts,
    repaired: validated.repaired,
  };
}

// ── Merged from render.ts ──


export function renderToeflWritingResponse(response: ToeflWritingStructuredResponse): string {
  const header = [
    `# TOEFL 写作诊断: ${response.title}`,
    "",
    `- 输入类型: ${response.scope}`,
    `- 来源类型: ${response.sourceType}`,
    `- 字符数: ${response.charCount}`,
    "",
    "| 维度 | 内容 |",
    "| --- | --- |",
    `| **评分** | ${escapeCell(`${response.score.band}。${response.score.reason}`)} |`,
    `| **逻辑** | ${formatCell(response.logic)} |`,
    `| **用词** | ${formatCell(response.vocabulary)} |`,
    `| **句式** | ${formatCell(response.structure)} |`,
    `| **优化** | ${escapeCell(`改写: ${response.optimization.rewrite}`)}<br>${formatCell(response.optimization.explanations)} |`,
  ];

  if (
    response.upgradePrioritySummary ||
    (response.revisionFocus && response.revisionFocus.length > 0) ||
    response.weakExpressionSet
  ) {
    header.push("", "**表达升级入口**");

    if (response.upgradePrioritySummary) {
      header.push(`- 优先级摘要: ${response.upgradePrioritySummary}`);
    }

    if (response.revisionFocus && response.revisionFocus.length > 0) {
      header.push(`- Revision Focus: ${response.revisionFocus.join(" / ")}`);
    }

    if (response.weakExpressionSet) {
      header.push(`- 弱表达摘要: ${response.weakExpressionSet.summary}`);
      header.push(
        ...response.weakExpressionSet.items.map(
          (item) =>
            `- [${item.severity}] ${item.sourceFragment ?? item.text}: ${item.reason} -> ${item.rewriteGoal}`,
        ),
      );
    }
  }

  if (response.notes && response.notes.length > 0) {
    header.push("", "**补充说明**", ...response.notes.map((note) => `- ${note}`));
  }

  return header.join("\n");
}

function formatCell(items: string[]): string {
  return items.map((item) => `- ${escapeCell(item)}`).join("<br>");
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\n/g, " ");
}
