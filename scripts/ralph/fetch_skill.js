const fs = require('fs');
const path = require('path');

// 自动在网上抓取各种 skills 并生成本地的 .agents/skills/<name>/SKILL.md
// 使用方式: node scripts/ralph/fetch_skill.js <skill-name> <url> <description>
async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node fetch_skill.js <skill-name> <url> [description]');
    process.exit(1);
  }

  const name = args[0];
  const url = args[1];
  const description = args[2] || `Custom skill captured from ${url}`;

  console.log(`[FetchSkill] Fetching content from: ${url}...`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();

    // 简单清洗 HTML 转换为纯文本/伪 Markdown，保持轻量
    let content = html
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
      .replace(/<\/?[^>]+(>|$)/g, '\n')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    // 截取前 2000 个字符避免文件过大
    if (content.length > 5000) {
      content = content.substring(0, 5000) + '\n\n... (content truncated)';
    }

    const targetDir = path.resolve(__dirname, '../../.agents/skills', name);
    fs.mkdirSync(targetDir, { recursive: true });

    const skillContent = `---
name: ${name}
description: ${description}
---

# ${name} Skill

Captured from: ${url}

## Raw Reference Material
\`\`\`text
${content}
\`\`\`

## Core Instructions
1. Apply the concepts captured in reference material above.
2. Adapt design patterns or configuration styles shown to the project standards in CONSTITUTION.md.
`;

    const targetFile = path.join(targetDir, 'SKILL.md');
    fs.writeFileSync(targetFile, skillContent, 'utf-8');

    console.log(`[FetchSkill] Success! Saved skill '${name}' to:`);
    console.log(`  ${targetFile}`);
  } catch (error) {
    console.error(`[FetchSkill] Error: ${error.message}`);
    process.exit(1);
  }
}

main();
