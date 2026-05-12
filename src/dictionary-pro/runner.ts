import { ToeflSlangClient, ToeflSlangClientOptions } from "../platform/client";
import { runValidatedJsonGeneration } from "../platform/runtime/validated-json";
import {
  buildDictionaryProPrompts,
  buildDictionaryProRepairPrompts,
} from "./prompt";
import {
  DictionaryProStructuredResponse,
  DictionaryProWordPhraseResponse,
  DictionaryProSentenceUpgradeResponse,
  DictionaryProComparisonResponse,
  DictionaryProAmbiguousResponse,
  DictionaryProQuery,
} from "./types";
import {
  formatDictionaryProValidationErrors,
  parseAndValidateDictionaryProResponse,
} from "./validator";

const MAX_GENERATION_ATTEMPTS = 3;

export type DictionaryProRunResult = {
  structured: DictionaryProStructuredResponse;
  markdown: string;
  rawText: string;
  attempts: number;
  repaired: boolean;
};

export async function runDictionaryProQuery(params: {
  query: DictionaryProQuery;
  clientOptions: ToeflSlangClientOptions;
}): Promise<DictionaryProRunResult> {
  const client = await ToeflSlangClient.create(params.clientOptions);
  const validated = await runValidatedJsonGeneration({
    maxAttempts: MAX_GENERATION_ATTEMPTS,
    failureLabel: "Dictionary Pro",
    generate: async ({ attempt, previousOutput, validationErrors }) => {
      const prompts =
        attempt === 1
        ? buildDictionaryProPrompts(params.query, { outputMode: "json" })
        : buildDictionaryProRepairPrompts({
            query: params.query,
            previousOutput,
            validationErrors,
          });

      return client.chat(prompts.systemPrompt, prompts.userPrompt);
    },
    parseAndValidate: (rawText) => parseAndValidateDictionaryProResponse(rawText, params.query),
    formatValidationErrors: formatDictionaryProValidationErrors,
  });

  return {
    structured: validated.value,
    markdown: renderDictionaryProResponse(validated.value),
    rawText: validated.rawText,
    attempts: validated.attempts,
    repaired: validated.repaired,
  };
}

// ── Merged from render.ts ──


export function renderDictionaryProResponse(response: DictionaryProStructuredResponse): string {
  if (response.kind === "word_phrase") {
    return renderWordPhraseResponse(response);
  }

  if (response.kind === "sentence_upgrade") {
    return renderSentenceUpgradeResponse(response);
  }

  if (response.kind === "comparison") {
    return renderComparisonResponse(response);
  }

  return renderAmbiguousResponse(response);
}

function renderWordPhraseResponse(response: DictionaryProWordPhraseResponse): string {
  const translation = formatInlineList(response.translation);
  const slang = [
    `语域: ${response.slang.register}`,
    `语气: ${response.slang.tone}`,
    `变体: ${formatInlineList(response.slang.variants)}`,
  ].join("<br>");
  const alignment = response.alignment
    .map((item: { expression: string; note: string }) => `${item.expression}: ${item.note}`)
    .join("<br>");
  const analysis = [
    `原句: ${response.analysis.sourceExample}`,
    `说明: ${response.analysis.sourceExplanation}`,
    `TOEFL: ${response.analysis.toeflExample}`,
    `说明: ${response.analysis.toeflExplanation}`,
  ].join("<br>");

  const sections = [
    "| 维度 | 内容 |",
    "| --- | --- |",
    `| **翻译** | ${translation} |`,
    `| **俚语** | ${slang} |`,
    `| **对标** | ${alignment} |`,
    `| **频次** | ${response.frequency} |`,
    `| **例析** | ${analysis} |`,
  ];

  if (response.notes && response.notes.length > 0) {
    sections.push("");
    sections.push("**补充说明**");
    sections.push(...response.notes.map((note: string) => `- ${note}`));
  }

  return sections.join("\n");
}

function renderSentenceUpgradeResponse(response: DictionaryProSentenceUpgradeResponse): string {
  const lines = [
    `**原表达问题**: ${response.problem}`,
    "",
    "**替换建议**",
    ...response.replacements.map(
      (item: { source: string; replacement: string; reason: string }) => `- ${item.source} -> ${item.replacement} : ${item.reason}`,
    ),
    "",
    "**推荐改写**",
    response.recommendedRewrite,
    "",
    "**说明**",
    response.explanation,
  ];

  if (response.notes && response.notes.length > 0) {
    lines.push("", "**补充说明**", ...response.notes.map((note: string) => `- ${note}`));
  }

  return lines.join("\n");
}

function renderComparisonResponse(response: DictionaryProComparisonResponse): string {
  const lines = [
    "| 表达 | 语域 | 适合 TOEFL 写作吗 | 差异 |",
    "| --- | --- | --- | --- |",
    ...response.items.map(
      (item: { expression: string; register: string; toeflSuitability: string; difference: string }) =>
        `| ${item.expression} | ${item.register} | ${formatSuitability(item.toeflSuitability as any)} | ${item.difference} |`,
    ),
  ];

  if (response.summary) {
    lines.push("", `**总结**: ${response.summary}`);
  }

  if (response.notes && response.notes.length > 0) {
    lines.push("", "**补充说明**", ...response.notes.map((note: string) => `- ${note}`));
  }

  return lines.join("\n");
}

function renderAmbiguousResponse(response: DictionaryProAmbiguousResponse): string {
  const lines = [
    "**可能义项**",
    ...response.possibleSenses.map((sense: string, index: number) => `${index + 1}. ${sense}`),
    "",
    response.clarificationPrompt,
  ];

  if (response.resolvedCard) {
    lines.push("", "**候选词卡**", renderWordPhraseResponse(response.resolvedCard));
  }

  if (response.notes && response.notes.length > 0) {
    lines.push("", "**补充说明**", ...response.notes.map((note: string) => `- ${note}`));
  }

  return lines.join("\n");
}

function formatInlineList(items: string[]): string {
  return items.join("<br>");
}

function formatSuitability(value: "yes" | "no" | "caution"): string {
  if (value === "yes") {
    return "是";
  }
  if (value === "no") {
    return "否";
  }
  return "谨慎";
}
