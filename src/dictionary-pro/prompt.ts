import * as fs from "fs";
import * as path from "path";
import { LocaleManager } from "../platform/locale";
import { DictionaryProQuery } from "./types";

interface PromptBundle {
  systemPrompt: string;
  userPrompt: string;
}

const SKILL_PATH = path.join(__dirname, "..", "..", "skills", "dictionary-pro", "SKILL.md");
const CONTRACT_PATH = path.join(
  __dirname,
  "..",
  "..",
  "skills",
  "dictionary-pro",
  "references",
  "output-contract.md"
);
const JSON_CONTRACT_PATH = path.join(
  __dirname,
  "..",
  "..",
  "skills",
  "dictionary-pro",
  "references",
  "json-contract.md"
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

export function buildDictionaryProPrompts(
  query: DictionaryProQuery,
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

  const userLines = buildRequestSummary(query);
  userLines.push(LocaleManager.injectPrompt());
  userLines.push("请优先保证语义准确和搭配自然，再做语域提升。");
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

export function buildDictionaryProRepairPrompts(params: {
  query: DictionaryProQuery;
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
    "You are repairing an invalid Dictionary Pro JSON response.",
    "Return valid JSON only. Do not wrap it in markdown or prose.",
  ].join("\n");

  const userLines = buildRequestSummary(params.query);
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

function buildRequestSummary(query: DictionaryProQuery): string[] {
  const userLines: string[] = [
    "请使用 Dictionary Pro 处理以下输入。",
    `表达: "${query.text}"`,
    `模式: ${query.mode ?? "auto-detect"}`,
    `目标场景: ${query.target ?? "toefl-writing"}`,
  ];

  if (query.context && query.context.trim()) {
    userLines.push(`上下文: ${query.context.trim()}`);
  }

  return userLines;
}
