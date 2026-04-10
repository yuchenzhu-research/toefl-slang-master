import { ContentParserStructuredResponse, resolveActiveFocus } from "./schema";
import { ContentParserQuery, ContentParserSourcePayload, ContentParserFocus, ContentParserSourceType } from "./types";

const FOCUS_VALUES: ContentParserFocus[] = ["full", "syntax", "slang", "culture", "conversion"];
const SOURCE_TYPES: ContentParserSourceType[] = ["pdf", "markdown", "text"];

export type ContentParserValidationResult =
  | {
      ok: true;
      value: ContentParserStructuredResponse;
      rawJson: unknown;
    }
  | {
      ok: false;
      errors: string[];
      rawJson?: unknown;
    };

export function parseAndValidateContentParserResponse(
  rawText: string,
  query: ContentParserQuery,
  source: ContentParserSourcePayload,
): ContentParserValidationResult {
  const jsonText = extractJsonObject(rawText);
  if (!jsonText) {
    return {
      ok: false,
      errors: ["未找到合法 JSON 对象。输出必须是一个 JSON object。"],
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    return {
      ok: false,
      errors: [`JSON 解析失败: ${(error as Error).message}`],
    };
  }

  const normalized = validateContentParserResponse(parsed, query, source);
  if (!normalized.ok) {
    return {
      ok: false,
      errors: normalized.errors,
      rawJson: parsed,
    };
  }

  return {
    ok: true,
    value: normalized.value,
    rawJson: parsed,
  };
}

function validateContentParserResponse(
  input: unknown,
  query: ContentParserQuery,
  source: ContentParserSourcePayload,
): ContentParserValidationResult {
  const errors: string[] = [];
  const record = asRecord(input, "root", errors);
  if (!record) {
    return { ok: false, errors };
  }

  const kind = readString(record.kind, "kind", errors);
  if (kind !== "content_note") {
    errors.push(`kind 必须是 "content_note"，实际为 "${kind ?? "undefined"}"。`);
  }

  const title = readString(record.title, "title", errors);
  const sourceType = readEnum(record.sourceType, "sourceType", SOURCE_TYPES, errors);
  const focus = readEnum(record.focus, "focus", FOCUS_VALUES, errors);
  const sourceName = readOptionalString(record.sourceName, "sourceName", errors);
  const notes = readOptionalStringArray(record.notes, "notes", errors);

  const extractionRecord = asRecord(record.extraction, "extraction", errors);
  const overview = readStringArray(record.overview, "overview", errors, 1);
  const breakdown = readStringArray(record.breakdown, "breakdown", errors, 1);
  const slang = readStringArray(record.slang, "slang", errors, 1);
  const culture = readStringArray(record.culture, "culture", errors, 1);
  const conversion = readStringArray(record.conversion, "conversion", errors, 1);
  const expressionCandidates = readExpressionCandidates(
    record.expressionCandidates,
    "expressionCandidates",
    errors,
  );

  if (
    !title ||
    !sourceType ||
    !focus ||
    !extractionRecord ||
    !overview ||
    !breakdown ||
    !slang ||
    !culture ||
    !conversion ||
    !expressionCandidates
  ) {
    return { ok: false, errors, rawJson: input };
  }

  const charCount = readPositiveInteger(extractionRecord.charCount, "extraction.charCount", errors);
  const truncated = readBoolean(extractionRecord.truncated, "extraction.truncated", errors);
  const pageCount = readOptionalPositiveInteger(
    extractionRecord.pageCount,
    "extraction.pageCount",
    errors,
  );

  if (charCount === null || truncated === null) {
    return { ok: false, errors, rawJson: input };
  }

  if (sourceType !== source.sourceType) {
    errors.push(`sourceType 应与输入一致，期望 "${source.sourceType}"，实际 "${sourceType}"。`);
  }

  const expectedFocus = resolveActiveFocus(query.focus);
  if (focus !== expectedFocus) {
    errors.push(`focus 应与请求一致，期望 "${expectedFocus}"，实际 "${focus}"。`);
  }

  if (sourceName && sourceName !== source.sourceName) {
    errors.push(`sourceName 应与输入一致，期望 "${source.sourceName}"，实际 "${sourceName}"。`);
  }

  return {
    ok: true,
    value: {
      kind: "content_note",
      title,
      sourceType,
      focus,
      sourceName,
      extraction: {
        charCount,
        truncated,
        pageCount,
      },
      overview,
      breakdown,
      slang,
      culture,
      conversion,
      expressionCandidates,
      notes: notes ?? undefined,
    },
    rawJson: input,
  };
}

function readExpressionCandidates(
  value: unknown,
  label: string,
  errors: string[],
): ContentParserStructuredResponse["expressionCandidates"] | null {
  if (!Array.isArray(value)) {
    errors.push(`${label} 必须是对象数组。`);
    return null;
  }

  const items = value
    .map((item, index) => {
      const record = asRecord(item, `${label}[${index}]`, errors);
      if (!record) {
        return null;
      }

      const expression = readString(record.expression, `${label}[${index}].expression`, errors);
      const sourceSentence = readString(
        record.sourceSentence,
        `${label}[${index}].sourceSentence`,
        errors,
      );
      const whyWorthLearning = readString(
        record.whyWorthLearning,
        `${label}[${index}].whyWorthLearning`,
        errors,
      );
      const registerHint = readString(
        record.registerHint,
        `${label}[${index}].registerHint`,
        errors,
      );
      const category = readString(record.category, `${label}[${index}].category`, errors);
      const transferPotential = readString(
        record.transferPotential,
        `${label}[${index}].transferPotential`,
        errors,
      );
      const difficulty = readString(record.difficulty, `${label}[${index}].difficulty`, errors);
      const downstreamTarget = readString(
        record.downstreamTarget,
        `${label}[${index}].downstreamTarget`,
        errors,
      );

      if (
        !expression ||
        !sourceSentence ||
        !whyWorthLearning ||
        !registerHint ||
        !category ||
        !transferPotential ||
        !difficulty ||
        !downstreamTarget
      ) {
        return null;
      }

      return {
        expression,
        sourceSentence,
        whyWorthLearning,
        registerHint,
        category,
        transferPotential,
        difficulty,
        downstreamTarget,
      };
    })
    .filter(
      (
        item,
      ): item is ContentParserStructuredResponse["expressionCandidates"][number] => item !== null,
    );

  if (items.length !== value.length) {
    return null;
  }

  return items;
}

function asRecord(
  input: unknown,
  label: string,
  errors: string[],
): Record<string, unknown> | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    errors.push(`${label} 必须是 object。`);
    return null;
  }
  return input as Record<string, unknown>;
}

function readEnum<T extends string>(
  value: unknown,
  label: string,
  allowed: readonly T[],
  errors: string[],
): T | null {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    errors.push(`${label} 必须是以下值之一: ${allowed.join(", ")}。`);
    return null;
  }
  return value as T;
}

function readString(value: unknown, label: string, errors: string[]): string | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`${label} 必须是非空字符串。`);
    return null;
  }
  return value.trim();
}

function readOptionalString(value: unknown, label: string, errors: string[]): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`${label} 必须是非空字符串。`);
    return undefined;
  }
  return value.trim();
}

function readStringArray(
  value: unknown,
  label: string,
  errors: string[],
  minLength: number,
): string[] | null {
  if (!Array.isArray(value)) {
    errors.push(`${label} 必须是字符串数组。`);
    return null;
  }

  const items = value
    .map((item, index) => {
      if (typeof item !== "string" || item.trim().length === 0) {
        errors.push(`${label}[${index}] 必须是非空字符串。`);
        return null;
      }
      return item.trim();
    })
    .filter((item): item is string => item !== null);

  if (items.length < minLength) {
    errors.push(`${label} 至少需要 ${minLength} 条内容。`);
    return null;
  }

  return items;
}

function readOptionalStringArray(
  value: unknown,
  label: string,
  errors: string[],
): string[] | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  const parsed = readStringArray(value, label, errors, 1);
  return parsed ?? undefined;
}

function readBoolean(value: unknown, label: string, errors: string[]): boolean | null {
  if (typeof value !== "boolean") {
    errors.push(`${label} 必须是 boolean。`);
    return null;
  }
  return value;
}

function readPositiveInteger(
  value: unknown,
  label: string,
  errors: string[],
): number | null {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    errors.push(`${label} 必须是正整数。`);
    return null;
  }
  return value;
}

function readOptionalPositiveInteger(
  value: unknown,
  label: string,
  errors: string[],
): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  const parsed = readPositiveInteger(value, label, errors);
  return parsed ?? undefined;
}

function extractJsonObject(rawText: string): string | null {
  const trimmed = rawText.trim();
  if (!trimmed) {
    return null;
  }

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    const fenced = fencedMatch[1].trim();
    if (fenced.startsWith("{") && fenced.endsWith("}")) {
      return fenced;
    }
  }

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  let start = -1;
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = 0; index < trimmed.length; index += 1) {
    const char = trimmed[index];

    if (start === -1) {
      if (char === "{") {
        start = index;
        depth = 1;
      }
      continue;
    }

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return trimmed.slice(start, index + 1);
      }
    }
  }

  return null;
}

export function formatContentParserValidationErrors(errors: string[]): string {
  return errors.map((error, index) => `${index + 1}. ${error}`).join("\n");
}
