/**
 * TOEFL Slang Master - MVP 入口
 *
 * 功能：
 * 1. 读取 skills/dictionary-pro/SKILL.md 作为 system prompt
 * 2. 使用 gpt-4o 流式输出 dictionary-pro 格式的表达解析
 */

import * as fs from "fs";
import * as path from "path";
import { ToeflSlangClient } from "./api/client";

async function main() {
  console.log("🎯 TOEFL Slang Master - MVP\n");

  // 1. 读取 system prompt（dictionary-pro SKILL.md）
  const skillPath = path.join(__dirname, "..", "skills", "dictionary-pro", "SKILL.md");

  if (!fs.existsSync(skillPath)) {
    console.error(`❌ 错误: 找不到 ${skillPath}`);
    process.exit(1);
  }

  const systemPrompt = fs.readFileSync(skillPath, "utf-8");
  console.log(`✅ 已加载 system prompt: ${skillPath}\n`);

  // 2. 测试表达
  const testExpression = "a big deal";

  console.log(`📝 查询表达: "${testExpression}"\n`);
  console.log("─".repeat(50));

  // 3. 调用客户端
  const client = new ToeflSlangClient();

  const userInput = `请解析表达 "${testExpression}"。如果存在多个常见义项，先区分义项；随后按照 Dictionary Pro 的默认格式输出，并给出最适合 TOEFL 写作的替换。`;

  await client.chatStreaming(systemPrompt, userInput);

  console.log("─".repeat(50));
  console.log("✨ 完成！按 Ctrl+C 退出");
}

// 运行
main().catch((error) => {
  console.error("❌ 错误:", error.message);
  process.exit(1);
});
