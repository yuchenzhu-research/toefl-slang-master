import {
  WEAK_EXPRESSION_CATEGORIES,
  WEAK_EXPRESSION_SEVERITIES,
  WeakExpression,
  WeakExpressionSet,
} from "../platform/contracts";
import { ToeflWritingStructuredResponse, ToeflWritingScope, inferWritingScope } from "./schema";
import { ToeflWritingQuery, ToeflWritingSourcePayload, ToeflWritingSourceType } from "./types";

const SCOPE_VALUES: ToeflWritingScope[] = ["sentence", "paragraph", "essay"];
const SOURCE_TYPES: ToeflWritingSourceType[] = ["text", "file"];
const TARGET_VALUES = [
  "toefl-writing",
  "toefl-speaking",
  "general-academic",
  "daily-english",
] as const;

export type ToeflWritingValidationResult =
  | {
      ok: true;
      value: ToeflWritingStructuredResponse;
      rawJson: unknown;
    }
  | {
      ok: false;
      errors: string[];
      rawJson?: unknown;
    };

export function parseAndValidateToeflWritingResponse(
  rawText: string,
  _query: ToeflWritingQuery,
  source: ToeflWritingSourcePayload,
): ToeflWritingValidationResult {
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

  const normalized = validateToeflWritingResponse(parsed, source);
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

function validateToeflWritingResponse(
  input: unknown,
  source: ToeflWritingSourcePayload,
): ToeflWritingValidationResult {
  const errors: string[] = [];
  const record = asRecord(input, "root", errors);
  if (!record) {
    return { ok: false, errors };
  }

  const kind = readString(record.kind, "kind", errors);
  if (kind !== "writing_diagnosis") {
    errors.push(`kind 必须是 "writing_diagnosis"，实际为 "${kind ?? "undefined"}"。`);
  }

  const title = readString(record.title, "title", errors);
  const scope = readEnum(record.scope, "scope", SCOPE_VALUES, errors);
  const sourceType = readEnum(record.sourceType, "sourceType", SOURCE_TYPES, errors);
  const charCount = readPositiveInteger(record.charCount, "charCount", errors);
  const notes = readOptionalStringArray(record.notes, "notes", errors);
  const revisionFocus = readOptionalStringArray(record.revisionFocus, "revisionFocus", errors);
  const upgradePrioritySummary = readOptionalString(
    record.upgradePrioritySummary,
    "upgradePrioritySummary",
    errors,
  );

  const scoreRecord = asRecord(record.score, "score", errors);
  const optimizationRecord = asRecord(record.optimization, "optimization", errors);
  const logic = readStringArray(record.logic, "logic", errors, 1);
  const vocabulary = readStringArray(record.vocabulary, "vocabulary", errors, 1);
  const structure = readStringArray(record.structure, "structure", errors, 1);
  const weakExpressionSet = readOptionalWeakExpressionSet(
    record.weakExpressionSet,
    errors,
    title,
    scope,
  );

  if (
    !title ||
    !scope ||
    !sourceType ||
    charCount === null ||
    !scoreRecord ||
    !optimizationRecord ||
    !logic ||
    !vocabulary ||
    !structure
  ) {
    return { ok: false, errors, rawJson: input };
  }

  const band = readString(scoreRecord.band, "score.band", errors);
  const reason = readString(scoreRecord.reason, "score.reason", errors);
  const rewrite = readString(optimizationRecord.rewrite, "optimization.rewrite", errors);
  const explanations = readStringArray(
    optimizationRecord.explanations,
    "optimization.explanations",
    errors,
    1,
  );

  if (!band || !reason || !rewrite || !explanations) {
    return { ok: false, errors, rawJson: input };
  }

  if (sourceType !== source.sourceType) {
    errors.push(`sourceType 应与输入一致，期望 "${source.sourceType}"，实际 "${sourceType}"。`);
  }

  if (charCount !== source.charCount) {
    errors.push(`charCount 应与输入一致，期望 "${source.charCount}"，实际 "${charCount}"。`);
  }

  const expectedScope = inferWritingScope(source.text);
  if (scope !== expectedScope) {
    errors.push(`scope 应与输入一致，期望 "${expectedScope}"，实际 "${scope}"。`);
  }

  return {
    ok: true,
    value: {
      kind: "writing_diagnosis",
      title,
      scope,
      sourceType,
      charCount,
      score: {
        band,
        reason,
      },
      logic,
      vocabulary,
      structure,
      optimization: {
        rewrite,
        explanations,
      },
      weakExpressionSet,
      revisionFocus,
      upgradePrioritySummary,
      notes: notes ?? undefined,
    },
    rawJson: input,
  };
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
  return readStringArray(value, label, errors, 1) ?? undefined;
}

function readOptionalString(
  value: unknown,
  label: string,
  errors: string[],
): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  return readString(value, label, errors) ?? undefined;
}

function readPositiveInteger(value: unknown, label: string, errors: string[]): number | null {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    errors.push(`${label} 必须是正整数。`);
    return null;
  }
  return value;
}

function extractJsonObject(rawText: string): string | null {
  const trimmed = rawText.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  return trimmed.slice(start, end + 1);
}

function readOptionalWeakExpressionSet(
  value: unknown,
  errors: string[],
  expectedTitle: string | null,
  expectedScope: ToeflWritingScope | null,
): WeakExpressionSet | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  const record = asRecord(value, "weakExpressionSet", errors);
  if (!record) {
    return undefined;
  }

  const kind = readString(record.kind, "weakExpressionSet.kind", errors);
  if (kind !== "weak_expression_set") {
    errors.push(
      `weakExpressionSet.kind 必须是 "weak_expression_set"，实际为 "${kind ?? "undefined"}"。`,
    );
  }

  const title = readString(record.title, "weakExpressionSet.title", errors);
  const scope = readEnum(record.scope, "weakExpressionSet.scope", SCOPE_VALUES, errors);
  const targetRegister = readEnum(
    record.targetRegister,
    "weakExpressionSet.targetRegister",
    TARGET_VALUES,
    errors,
  );
  const sourceText = readString(record.sourceText, "weakExpressionSet.sourceText", errors);
  const summary = readString(record.summary, "weakExpressionSet.summary", errors);
  const items = readWeakExpressionItems(record.items, "weakExpressionSet.items", errors);
  const notes = readOptionalStringArray(record.notes, "weakExpressionSet.notes", errors);

  if (!title || !scope || !targetRegister || !sourceText || !summary || !items) {
    return undefined;
  }

  if (expectedTitle && title !== expectedTitle) {
    errors.push(`weakExpressionSet.title 应与 title 一致，期望 "${expectedTitle}"，实际 "${title}"。`);
  }

  if (expectedScope && scope !== expectedScope) {
    errors.push(
      `weakExpressionSet.scope 应与 scope 一致，期望 "${expectedScope}"，实际 "${scope}"。`,
    );
  }

  return {
    kind: "weak_expression_set",
    title,
    scope,
    targetRegister,
    sourceText,
    summary,
    items,
    notes,
  };
}

function readWeakExpressionItems(
  value: unknown,
  label: string,
  errors: string[],
): WeakExpression[] | null {
  if (!Array.isArray(value)) {
    errors.push(`${label} 必须是对象数组。`);
    return null;
  }

  const items = value
    .map((item, index) => readWeakExpression(item, `${label}[${index}]`, errors))
    .filter((item): item is WeakExpression => item !== null);

  if (items.length === 0) {
    errors.push(`${label} 至少需要 1 个弱表达对象。`);
    return null;
  }

  return items;
}

function readWeakExpression(
  value: unknown,
  label: string,
  errors: string[],
): WeakExpression | null {
  const record = asRecord(value, label, errors);
  if (!record) {
    return null;
  }

  const text = readString(record.text, `${label}.text`, errors);
  const category = readEnum(
    record.category,
    `${label}.category`,
    WEAK_EXPRESSION_CATEGORIES,
    errors,
  );
  const severity = readEnum(
    record.severity,
    `${label}.severity`,
    WEAK_EXPRESSION_SEVERITIES,
    errors,
  );
  const reason = readString(record.reason, `${label}.reason`, errors);
  const targetRegister = readEnum(
    record.targetRegister,
    `${label}.targetRegister`,
    TARGET_VALUES,
    errors,
  );
  const sourceSentence = readString(record.sourceSentence, `${label}.sourceSentence`, errors);
  const sourceFragment = readOptionalString(record.sourceFragment, `${label}.sourceFragment`, errors);
  const rewriteGoal = readString(record.rewriteGoal, `${label}.rewriteGoal`, errors);
  const coachNote = readOptionalString(record.coachNote, `${label}.coachNote`, errors);

  if (
    !text ||
    !category ||
    !severity ||
    !reason ||
    !targetRegister ||
    !sourceSentence ||
    !rewriteGoal
  ) {
    return null;
  }

  return {
    text,
    category,
    severity,
    reason,
    targetRegister,
    sourceSentence,
    sourceFragment,
    rewriteGoal,
    coachNote,
  };
}

export function formatToeflWritingValidationErrors(errors: string[]): string {
  return errors.map((error, index) => `${index + 1}. ${error}`).join("\n");
}
