import {
  DictionaryProAmbiguousResponse,
  DictionaryProComparisonResponse,
  DictionaryProSentenceUpgradeResponse,
  DictionaryProStructuredResponse,
  DictionaryProWordPhraseResponse,
} from "./schema";

export function renderDictionaryProResponse(response: DictionaryProStructuredResponse): string {
  if (response.kind === "word_phrase") {
    return renderWordPhraseResponse(response);
  }

  if (response.kind === "sentence_upgrade") {
    return renderSentenceUpgradeResponse(response);
  }

  if (response.kind === "comparison") {
    return renderComparisonResponse(response);
  }

  return renderAmbiguousResponse(response);
}

function renderWordPhraseResponse(response: DictionaryProWordPhraseResponse): string {
  const translation = formatInlineList(response.translation);
  const slang = [
    `语域: ${response.slang.register}`,
    `语气: ${response.slang.tone}`,
    `变体: ${formatInlineList(response.slang.variants)}`,
  ].join("<br>");
  const alignment = response.alignment
    .map((item) => `${item.expression}: ${item.note}`)
    .join("<br>");
  const analysis = [
    `原句: ${response.analysis.sourceExample}`,
    `说明: ${response.analysis.sourceExplanation}`,
    `TOEFL: ${response.analysis.toeflExample}`,
    `说明: ${response.analysis.toeflExplanation}`,
  ].join("<br>");

  const sections = [
    "| 维度 | 内容 |",
    "| --- | --- |",
    `| **翻译** | ${translation} |`,
    `| **俚语** | ${slang} |`,
    `| **对标** | ${alignment} |`,
    `| **频次** | ${response.frequency} |`,
    `| **例析** | ${analysis} |`,
  ];

  if (response.notes && response.notes.length > 0) {
    sections.push("");
    sections.push("**补充说明**");
    sections.push(...response.notes.map((note) => `- ${note}`));
  }

  return sections.join("\n");
}

function renderSentenceUpgradeResponse(response: DictionaryProSentenceUpgradeResponse): string {
  const lines = [
    `**原表达问题**: ${response.problem}`,
    "",
    "**替换建议**",
    ...response.replacements.map(
      (item) => `- ${item.source} -> ${item.replacement} : ${item.reason}`,
    ),
    "",
    "**推荐改写**",
    response.recommendedRewrite,
    "",
    "**说明**",
    response.explanation,
  ];

  if (response.notes && response.notes.length > 0) {
    lines.push("", "**补充说明**", ...response.notes.map((note) => `- ${note}`));
  }

  return lines.join("\n");
}

function renderComparisonResponse(response: DictionaryProComparisonResponse): string {
  const lines = [
    "| 表达 | 语域 | 适合 TOEFL 写作吗 | 差异 |",
    "| --- | --- | --- | --- |",
    ...response.items.map(
      (item) =>
        `| ${item.expression} | ${item.register} | ${formatSuitability(item.toeflSuitability)} | ${item.difference} |`,
    ),
  ];

  if (response.summary) {
    lines.push("", `**总结**: ${response.summary}`);
  }

  if (response.notes && response.notes.length > 0) {
    lines.push("", "**补充说明**", ...response.notes.map((note) => `- ${note}`));
  }

  return lines.join("\n");
}

function renderAmbiguousResponse(response: DictionaryProAmbiguousResponse): string {
  const lines = [
    "**可能义项**",
    ...response.possibleSenses.map((sense, index) => `${index + 1}. ${sense}`),
    "",
    response.clarificationPrompt,
  ];

  if (response.resolvedCard) {
    lines.push("", "**候选词卡**", renderWordPhraseResponse(response.resolvedCard));
  }

  if (response.notes && response.notes.length > 0) {
    lines.push("", "**补充说明**", ...response.notes.map((note) => `- ${note}`));
  }

  return lines.join("\n");
}

function formatInlineList(items: string[]): string {
  return items.join("<br>");
}

function formatSuitability(value: "yes" | "no" | "caution"): string {
  if (value === "yes") {
    return "是";
  }
  if (value === "no") {
    return "否";
  }
  return "谨慎";
}
