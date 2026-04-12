import * as fs from "fs";
import * as path from "path";
import { ContentParserSourcePayload, ContentParserQuery } from "./types";
import { resolveActiveFocus } from "./schema";
import { LocaleManager } from "../platform/locale";

interface PromptBundle {
  systemPrompt: string;
  userPrompt: string;
}

const SKILL_PATH = path.join(__dirname, "..", "..", "skills", "content-parser", "SKILL.md");
const CONTRACT_PATH = path.join(
  __dirname,
  "..",
  "..",
  "skills",
  "content-parser",
  "references",
  "output-contract.md",
);
const JSON_CONTRACT_PATH = path.join(
  __dirname,
  "..",
  "..",
  "skills",
  "content-parser",
  "references",
  "json-contract.md",
);

type PromptBuildOptions = {
  outputMode?: "markdown" | "json";
};

function readRequiredFile(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Required file not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf-8");
}

export function buildContentParserPrompts(
  query: ContentParserQuery,
  source: ContentParserSourcePayload,
  options: PromptBuildOptions = {},
): PromptBundle {
  const skillPrompt = readRequiredFile(SKILL_PATH);
  const outputContract = readRequiredFile(CONTRACT_PATH);
  const jsonContract = readRequiredFile(JSON_CONTRACT_PATH);
  const outputMode = options.outputMode ?? "markdown";

  const systemPrompt =
    outputMode === "json"
      ? [
          skillPrompt,
          "",
          "---",
          "Structured Output Contract (Must Follow)",
          jsonContract,
          "",
          "Return valid JSON only. No markdown. No explanation outside the JSON object.",
        ].join("\n")
      : [
          skillPrompt,
          "",
          "---",
          "Output Contract (Must Follow)",
          outputContract,
        ].join("\n");

  const userLines = buildSourceSummary(query, source);
  userLines.push(LocaleManager.injectPrompt());
  userLines.push("请优先抽取最有学习价值的内容，不要机械复述整篇文章。");
  userLines.push(
    outputMode === "json"
      ? "请直接返回合法 JSON 对象，不要输出 Markdown、解释或代码块。"
      : "输出格式请严格遵循 Output Contract。",
  );

  return {
    systemPrompt,
    userPrompt: userLines.join("\n"),
  };
}

export function buildContentParserRepairPrompts(params: {
  query: ContentParserQuery;
  source: ContentParserSourcePayload;
  previousOutput: string;
  validationErrors: string[];
}): PromptBundle {
  const skillPrompt = readRequiredFile(SKILL_PATH);
  const jsonContract = readRequiredFile(JSON_CONTRACT_PATH);

  const systemPrompt = [
    skillPrompt,
    "",
    "---",
    "Structured Output Contract (Must Follow)",
    jsonContract,
    "",
    "You are repairing an invalid Content Parser JSON response.",
    "Return valid JSON only. Do not wrap it in markdown or prose.",
  ].join("\n");

  const userLines = buildSourceSummary(params.query, params.source);
  userLines.push(LocaleManager.injectPrompt());
  userLines.push("上一次输出没有通过校验，请修复而不是改写任务目标。");
  userLines.push("校验错误:");
  userLines.push(...params.validationErrors.map((error, index) => `${index + 1}. ${error}`));
  userLines.push("");
  userLines.push("上一次输出:");
  userLines.push(params.previousOutput);
  userLines.push("");
  userLines.push("请返回修复后的合法 JSON 对象，不要输出其他内容。");

  return {
    systemPrompt,
    userPrompt: userLines.join("\n"),
  };
}

function buildSourceSummary(
  query: ContentParserQuery,
  source: ContentParserSourcePayload,
): string[] {
  const lines = [
    "请使用 Content Parser 处理以下素材。",
    `标题: ${source.title}`,
    `来源类型: ${source.sourceType}`,
    `聚焦模式: ${resolveActiveFocus(query.focus)}`,
    `来源名称: ${source.sourceName}`,
    `提取引擎: ${source.extractionEngine}`,
    `提取字符数: ${source.charCount}`,
    `是否截断: ${source.truncated ? "yes" : "no"}`,
  ];

  if (typeof source.pageCount === "number") {
    lines.push(`页数: ${source.pageCount}`);
  }

  if (source.warnings.length > 0) {
    lines.push(`抽取警告: ${source.warnings.join(" | ")}`);
  }

  lines.push("");
  lines.push("素材正文:");
  lines.push("<<<CONTENT");
  lines.push(source.text);
  lines.push("CONTENT");

  return lines;
}
