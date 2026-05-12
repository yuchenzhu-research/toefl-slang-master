import { ToeflSlangClient, ToeflSlangClientOptions } from "../platform/client";
import { runValidatedJsonGeneration } from "../platform/runtime/validated-json";
import { resolveContentParserSource } from "./extractor";
import { buildContentParserPrompts, buildContentParserRepairPrompts } from "./prompt";
import { ContentParserStructuredResponse } from "./types";
import { ContentParserQuery, ContentParserSourcePayload } from "./types";
import {
  formatContentParserValidationErrors,
  parseAndValidateContentParserResponse,
} from "./validator";

const MAX_GENERATION_ATTEMPTS = 3;

export type ContentParserRunResult = {
  source: ContentParserSourcePayload;
  structured: ContentParserStructuredResponse;
  markdown: string;
  rawText: string;
  attempts: number;
  repaired: boolean;
};

export async function runContentParserQuery(params: {
  query: ContentParserQuery;
  clientOptions: ToeflSlangClientOptions;
  source?: ContentParserSourcePayload;
}): Promise<ContentParserRunResult> {
  const client = await ToeflSlangClient.create(params.clientOptions);
  const source = params.source ?? (await resolveContentParserSource(params.query));
  const validated = await runValidatedJsonGeneration({
    maxAttempts: MAX_GENERATION_ATTEMPTS,
    failureLabel: "Content Parser",
    generate: async ({ attempt, previousOutput, validationErrors }) => {
      const prompts =
        attempt === 1
        ? buildContentParserPrompts(params.query, source, { outputMode: "json" })
        : buildContentParserRepairPrompts({
            query: params.query,
            source,
            previousOutput,
            validationErrors,
          });

      return client.chat(prompts.systemPrompt, prompts.userPrompt);
    },
    parseAndValidate: (rawText) =>
      parseAndValidateContentParserResponse(rawText, params.query, source),
    formatValidationErrors: formatContentParserValidationErrors,
  });

  return {
    source,
    structured: validated.value,
    markdown: renderContentParserResponse(validated.value),
    rawText: validated.rawText,
    attempts: validated.attempts,
    repaired: validated.repaired,
  };
}

// ── Merged from render.ts ──


export function renderContentParserResponse(response: ContentParserStructuredResponse): string {
  const header = [
    `# 素材拆解笔记: ${response.title}`,
    "",
    `- 来源类型: ${response.sourceType}`,
    `- 聚焦模式: ${response.focus}`,
    `- 提取字符数: ${response.extraction.charCount}`,
    `- 是否截断: ${response.extraction.truncated ? "yes" : "no"}`,
  ];

  if (typeof response.extraction.pageCount === "number") {
    header.push(`- 页数: ${response.extraction.pageCount}`);
  }

  const sections = [
    "",
    "| 维度 | 内容 |",
    "| --- | --- |",
    `| **导读** | ${formatCell(response.overview)} |`,
    `| **拆解** | ${formatCell(response.breakdown)} |`,
    `| **俚语** | ${formatCell(response.slang)} |`,
    `| **文化** | ${formatCell(response.culture)} |`,
    `| **转化** | ${formatCell(response.conversion)} |`,
  ];

  if (response.notes && response.notes.length > 0) {
    sections.push("", "**补充说明**", ...response.notes.map((note) => `- ${note}`));
  }

  return [...header, ...sections].join("\n");
}

function formatCell(items: string[]): string {
  return items.map((item) => `- ${escapeCell(item)}`).join("<br>");
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\n/g, " ");
}
