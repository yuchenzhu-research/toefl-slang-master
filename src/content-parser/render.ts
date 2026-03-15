import { ContentParserStructuredResponse } from "./schema";

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
