/**
 * TOEFL Slang Master - MVP 入口
 *
 * 功能：
 * 1. 读取 .claude/skills/dictionary-pro/SKILL.md 作为 system prompt
 * 2. 使用 gpt-4o 流式输出 dictionary-pro 格式的单词解析
 */

import * as fs from "fs";
import * as path from "path";
import { ToeflSlangClient } from "./api/client";

async function main() {
  console.log("🎯 TOEFL Slang Master - MVP\n");

  // 1. 读取 system prompt（dictionary-pro SKILL.md）
  const skillsPath = path.join(__dirname, "..", ".claude", "skills");
  const skillPath = path.join(skillsPath, "dictionary-pro", "SKILL.md");

  if (!fs.existsSync(skillPath)) {
    console.error(`❌ 错误: 找不到 ${skillPath}`);
    process.exit(1);
  }

  const systemPrompt = fs.readFileSync(skillPath, "utf-8");
  console.log(`✅ 已加载 system prompt: ${skillPath}\n`);

  // 2. 测试单词
  const testWord = "cap";

  console.log(`📝 查询单词: "${testWord}"\n`);
  console.log("─".repeat(50));

  // 3. 调用客户端
  const client = new ToeflSlangClient();

  const userInput = `请解析单词 "${testWord}"，严格按照 dictionary-pro 的 5 维度格式输出：翻译、俚语、对标、频次、例析。`;

  await client.chatStreaming(systemPrompt, userInput);

  console.log("─".repeat(50));
  console.log("✨ 完成！按 Ctrl+C 退出");
}

// 运行
main().catch((error) => {
  console.error("❌ 错误:", error.message);
  process.exit(1);
});