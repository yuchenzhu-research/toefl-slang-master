import * as fs from "fs";
import * as path from "path";
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

function readRequiredFile(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Required file not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf-8");
}

export function buildDictionaryProPrompts(query: DictionaryProQuery): PromptBundle {
  const skillPrompt = readRequiredFile(SKILL_PATH);
  const outputContract = readRequiredFile(CONTRACT_PATH);

  const systemPrompt = [
    skillPrompt,
    "",
    "---",
    "Output Contract (Must Follow)",
    outputContract,
  ].join("\n");

  const userLines: string[] = [
    "请使用 Dictionary Pro 处理以下输入。",
    `表达: "${query.text}"`,
    `模式: ${query.mode ?? "auto-detect"}`,
    `目标场景: ${query.target ?? "toefl-writing"}`,
  ];

  if (query.context && query.context.trim()) {
    userLines.push(`上下文: ${query.context.trim()}`);
  }

  userLines.push("请优先保证语义准确和搭配自然，再做语域提升。");
  userLines.push("输出格式请严格遵循 Output Contract。");

  return {
    systemPrompt,
    userPrompt: userLines.join("\n"),
  };
}

