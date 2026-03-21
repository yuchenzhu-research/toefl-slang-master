import { ToeflWritingStructuredResponse } from "./schema";

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
