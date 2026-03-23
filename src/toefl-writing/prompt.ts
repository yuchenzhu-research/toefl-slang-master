import * as fs from "fs";
import * as path from "path";
import { ToeflWritingSourcePayload, ToeflWritingQuery } from "./types";
import { inferWritingScope } from "./schema";

interface PromptBundle {
  systemPrompt: string;
  userPrompt: string;
}

const SKILL_PATH = path.join(__dirname, "..", "..", "skills", "toefl-writing", "SKILL.md");
const CONTRACT_PATH = path.join(
  __dirname,
  "..",
  "..",
  "skills",
  "toefl-writing",
  "references",
  "output-contract.md",
);
const JSON_CONTRACT_PATH = path.join(
  __dirname,
  "..",
  "..",
  "skills",
  "toefl-writing",
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

export function buildToeflWritingPrompts(
  query: ToeflWritingQuery,
  source: ToeflWritingSourcePayload,
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
      : [skillPrompt, "", "---", "Output Contract (Must Follow)", outputContract].join("\n");

  const userLines = buildSourceSummary(query, source);
  userLines.push("请先诊断再改写，保持原文观点方向，不要替作者改立场。");
  if (outputMode === "json") {
    userLines.push(
      "如果文本里存在可单独升级的弱表达，请额外返回 weakExpressionSet、revisionFocus 和 upgradePrioritySummary。",
    );
    userLines.push(
      "weakExpressionSet 只包含表达级问题，不包含纯语法或纯结构问题；title 和 scope 必须与顶层字段一致。",
    );
  }
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

export function buildToeflWritingRepairPrompts(params: {
  query: ToeflWritingQuery;
  source: ToeflWritingSourcePayload;
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
    "You are repairing an invalid TOEFL Coach JSON response.",
    "Return valid JSON only. Do not wrap it in markdown or prose.",
  ].join("\n");

  const userLines = buildSourceSummary(params.query, params.source);
  userLines.push("上一次输出没有通过校验，请修复而不是改写任务目标。");
  userLines.push("如果存在表达级问题，请保留或补全 weakExpressionSet、revisionFocus 和 upgradePrioritySummary。");
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
  query: ToeflWritingQuery,
  source: ToeflWritingSourcePayload,
): string[] {
  return [
    "请使用 TOEFL Coach 处理以下写作输入。",
    `标题: ${source.title}`,
    `来源类型: ${source.sourceType}`,
    `来源名称: ${source.sourceName}`,
    `字符数: ${source.charCount}`,
    `是否截断: ${source.truncated ? "yes" : "no"}`,
    `推断输入类型: ${inferWritingScope(source.text)}`,
    ...(source.warnings.length > 0 ? [`输入警告: ${source.warnings.join(" | ")}`] : []),
    "",
    "待诊断文本:",
    "<<<WRITING",
    source.text,
    "WRITING",
    ...(query.title ? ["", `用户标题: ${query.title}`] : []),
  ];
}
