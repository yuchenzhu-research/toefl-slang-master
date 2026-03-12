import {
  DictionaryProActiveMode,
  DictionaryProAmbiguousResponse,
  DictionaryProAnalysisBlock,
  DictionaryProComparisonResponse,
  DictionaryProResponseKind,
  DictionaryProSentenceUpgradeResponse,
  DictionaryProSlangBlock,
  DictionaryProStructuredResponse,
  DictionaryProWordPhraseResponse,
  resolveActiveMode,
  resolveActiveTarget,
} from "./schema";
import { DictionaryProQuery, DictionaryProTarget } from "./types";

const RESPONSE_KINDS: DictionaryProResponseKind[] = [
  "word_phrase",
  "sentence_upgrade",
  "comparison",
  "ambiguous",
];

const TARGETS: DictionaryProTarget[] = [
  "toefl-writing",
  "toefl-speaking",
  "general-academic",
  "daily-english",
];

const MODES: DictionaryProActiveMode[] = [
  "meaning",
  "conversion",
  "upgrade",
  "comparison",
  "auto-detect",
];

type DictionaryProValidatedBase = {
  kind: DictionaryProResponseKind;
  query: string;
  mode: DictionaryProActiveMode;
  target: DictionaryProTarget;
  context?: string;
  notes?: string[];
};

export type DictionaryProValidationResult =
  | {
      ok: true;
      value: DictionaryProStructuredResponse;
      rawJson: unknown;
    }
  | {
      ok: false;
      errors: string[];
      rawJson?: unknown;
    };

export function parseAndValidateDictionaryProResponse(
  rawText: string,
  query: DictionaryProQuery,
): DictionaryProValidationResult {
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

  const normalized = validateDictionaryProResponse(parsed, query);
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

function validateDictionaryProResponse(
  input: unknown,
  query: DictionaryProQuery,
): DictionaryProValidationResult {
  const errors: string[] = [];
  const record = asRecord(input, "root", errors);
  if (!record) {
    return { ok: false, errors };
  }

  const kind = readEnum(record.kind, "kind", RESPONSE_KINDS, errors);
  if (!kind) {
    return { ok: false, errors, rawJson: input };
  }

  const base = validateBase(record, query, errors, kind);
  if (!base) {
    return { ok: false, errors, rawJson: input };
  }

  if (kind === "word_phrase") {
    const value = validateWordPhrase(record, base, errors);
    return value ? { ok: true, value, rawJson: input } : { ok: false, errors, rawJson: input };
  }

  if (kind === "sentence_upgrade") {
    const value = validateSentenceUpgrade(record, base, errors);
    return value ? { ok: true, value, rawJson: input } : { ok: false, errors, rawJson: input };
  }

  if (kind === "comparison") {
    const value = validateComparison(record, base, query, errors);
    return value ? { ok: true, value, rawJson: input } : { ok: false, errors, rawJson: input };
  }

  const value = validateAmbiguous(record, base, query, errors);
  return value ? { ok: true, value, rawJson: input } : { ok: false, errors, rawJson: input };
}

function validateBase(
  record: Record<string, unknown>,
  query: DictionaryProQuery,
  errors: string[],
  kind: DictionaryProResponseKind,
): DictionaryProValidatedBase | null {
  const mode = readEnum(record.mode, "mode", MODES, errors);
  const target = readEnum(record.target, "target", TARGETS, errors);
  const normalizedQuery = readString(record.query, "query", errors);
  const context = readOptionalString(record.context, "context", errors);
  const notes = readOptionalStringArray(record.notes, "notes", errors);

  if (!normalizedQuery || !mode || !target) {
    return null;
  }

  const expectedMode = resolveActiveMode(query);
  if (query.mode && mode !== expectedMode) {
    errors.push(`mode 应该与请求一致，期望 "${expectedMode}"，实际 "${mode}"。`);
  }

  const expectedTarget = resolveActiveTarget(query);
  if (target !== expectedTarget) {
    errors.push(`target 应该与请求一致，期望 "${expectedTarget}"，实际 "${target}"。`);
  }

  return {
    kind,
    query: normalizedQuery,
    mode,
    target,
    context,
    notes,
  };
}

function validateWordPhrase(
  record: Record<string, unknown>,
  base: DictionaryProValidatedBase,
  errors: string[],
): DictionaryProWordPhraseResponse | null {
  const slangRecord = asRecord(record.slang, "slang", errors);
  const analysisRecord = asRecord(record.analysis, "analysis", errors);

  const translation = readStringArray(record.translation, "translation", errors, 1);
  const slang = slangRecord ? validateSlangBlock(slangRecord, errors) : null;
  const alignment = readAlignment(record.alignment, "alignment", errors);
  const frequency = readString(record.frequency, "frequency", errors);
  const analysis = analysisRecord ? validateAnalysisBlock(analysisRecord, errors) : null;

  if (!translation || !slang || !alignment || !frequency || !analysis) {
    return null;
  }

  return {
    ...base,
    kind: "word_phrase",
    translation,
    slang,
    alignment,
    frequency,
    analysis,
  };
}

function validateSentenceUpgrade(
  record: Record<string, unknown>,
  base: DictionaryProValidatedBase,
  errors: string[],
): DictionaryProSentenceUpgradeResponse | null {
  const replacements = readArray(record.replacements, "replacements", errors);
  const normalizedReplacements =
    replacements?.map((item, index) => {
      const replacementRecord = asRecord(item, `replacements[${index}]`, errors);
      if (!replacementRecord) {
        return null;
      }
      const source = readString(replacementRecord.source, `replacements[${index}].source`, errors);
      const replacement = readString(
        replacementRecord.replacement,
        `replacements[${index}].replacement`,
        errors,
      );
      const reason = readString(replacementRecord.reason, `replacements[${index}].reason`, errors);
      return source && replacement && reason ? { source, replacement, reason } : null;
    }) ?? null;

  if (!normalizedReplacements || normalizedReplacements.length === 0 || normalizedReplacements.some((item) => item === null)) {
    errors.push("replacements 必须是至少包含 1 条完整替换建议的数组。");
    return null;
  }

  const filteredReplacements = normalizedReplacements.filter(
    (item): item is NonNullable<typeof item> => item !== null,
  );

  const problem = readString(record.problem, "problem", errors);
  const recommendedRewrite = readString(record.recommendedRewrite, "recommendedRewrite", errors);
  const explanation = readString(record.explanation, "explanation", errors);

  if (!problem || !recommendedRewrite || !explanation) {
    return null;
  }

  return {
    ...base,
    kind: "sentence_upgrade",
    problem,
    replacements: filteredReplacements,
    recommendedRewrite,
    explanation,
  };
}

function validateComparison(
  record: Record<string, unknown>,
  base: DictionaryProValidatedBase,
  query: DictionaryProQuery,
  errors: string[],
): DictionaryProComparisonResponse | null {
  const items = readArray(record.items, "items", errors);
  const normalizedItems =
    items?.map((item, index) => {
      const itemRecord = asRecord(item, `items[${index}]`, errors);
      if (!itemRecord) {
        return null;
      }
      const expression = readString(itemRecord.expression, `items[${index}].expression`, errors);
      const register = readString(itemRecord.register, `items[${index}].register`, errors);
      const toeflSuitability = readEnum(
        itemRecord.toeflSuitability,
        `items[${index}].toeflSuitability`,
        ["yes", "no", "caution"] as const,
        errors,
      );
      const difference = readString(itemRecord.difference, `items[${index}].difference`, errors);

      return expression && register && toeflSuitability && difference
        ? { expression, register, toeflSuitability, difference }
        : null;
    }) ?? null;

  if (!normalizedItems || normalizedItems.length < 2 || normalizedItems.some((item) => item === null)) {
    errors.push("comparison.items 必须是至少 2 条完整比较项。");
    return null;
  }

  return {
    ...base,
    kind: "comparison",
    items: normalizedItems.filter((item): item is NonNullable<typeof item> => item !== null),
    summary: readOptionalString(record.summary, "summary", errors),
  };
}

function validateAmbiguous(
  record: Record<string, unknown>,
  base: DictionaryProValidatedBase,
  query: DictionaryProQuery,
  errors: string[],
): DictionaryProAmbiguousResponse | null {
  const possibleSenses = readStringArray(record.possibleSenses, "possibleSenses", errors, 2);
  const clarificationPrompt = readString(record.clarificationPrompt, "clarificationPrompt", errors);
  const resolvedCardValue = record.resolvedCard;

  let resolvedCard: DictionaryProWordPhraseResponse | null = null;
  if (resolvedCardValue !== null && resolvedCardValue !== undefined) {
    const resolvedRecord = asRecord(resolvedCardValue, "resolvedCard", errors);
    if (resolvedRecord) {
      const nestedBase = validateBase(
        resolvedRecord,
        { ...query, mode: query.mode ?? "meaning" },
        errors,
        "word_phrase",
      );
      resolvedCard = nestedBase ? validateWordPhrase(resolvedRecord, nestedBase, errors) : null;
    }
  }

  if (!possibleSenses || !clarificationPrompt) {
    return null;
  }

  return {
    ...base,
    kind: "ambiguous",
    possibleSenses,
    clarificationPrompt,
    resolvedCard,
  };
}

function validateSlangBlock(
  record: Record<string, unknown>,
  errors: string[],
): DictionaryProSlangBlock | null {
  const register = readString(record.register, "slang.register", errors);
  const tone = readString(record.tone, "slang.tone", errors);
  const variants = readStringArray(record.variants, "slang.variants", errors, 1);

  return register && tone && variants ? { register, tone, variants } : null;
}

function validateAnalysisBlock(
  record: Record<string, unknown>,
  errors: string[],
): DictionaryProAnalysisBlock | null {
  const sourceExample = readString(record.sourceExample, "analysis.sourceExample", errors);
  const sourceExplanation = readString(
    record.sourceExplanation,
    "analysis.sourceExplanation",
    errors,
  );
  const toeflExample = readString(record.toeflExample, "analysis.toeflExample", errors);
  const toeflExplanation = readString(
    record.toeflExplanation,
    "analysis.toeflExplanation",
    errors,
  );

  return sourceExample && sourceExplanation && toeflExample && toeflExplanation
    ? { sourceExample, sourceExplanation, toeflExample, toeflExplanation }
    : null;
}

function readAlignment(
  value: unknown,
  path: string,
  errors: string[],
): Array<{ expression: string; note: string }> | null {
  const items = readArray(value, path, errors);
  if (!items || items.length === 0) {
    errors.push(`${path} 必须至少包含 1 条对标建议。`);
    return null;
  }

  const normalized = items.map((item, index) => {
    const record = asRecord(item, `${path}[${index}]`, errors);
    if (!record) {
      return null;
    }
    const expression = readString(record.expression, `${path}[${index}].expression`, errors);
    const note = readString(record.note, `${path}[${index}].note`, errors);
    return expression && note ? { expression, note } : null;
  });

  if (normalized.some((item) => item === null)) {
    return null;
  }

  return normalized.filter((item): item is NonNullable<typeof item> => item !== null);
}

function asRecord(
  value: unknown,
  path: string,
  errors: string[],
): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    errors.push(`${path} 必须是 object。`);
    return null;
  }
  return value as Record<string, unknown>;
}

function readString(value: unknown, path: string, errors: string[]): string | null {
  if (typeof value !== "string") {
    errors.push(`${path} 必须是非空字符串。`);
    return null;
  }

  const normalized = value.trim();
  if (!normalized) {
    errors.push(`${path} 不能为空。`);
    return null;
  }

  return normalized;
}

function readOptionalString(value: unknown, path: string, errors: string[]): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  return readString(value, path, errors) ?? undefined;
}

function readStringArray(
  value: unknown,
  path: string,
  errors: string[],
  minItems: number,
): string[] | null {
  const items = readArray(value, path, errors);
  if (!items || items.length < minItems) {
    errors.push(`${path} 必须至少包含 ${minItems} 条非空字符串。`);
    return null;
  }

  const normalized = items.map((item, index) => readString(item, `${path}[${index}]`, errors));
  if (normalized.some((item) => item === null)) {
    return null;
  }
  return normalized.filter((item): item is string => item !== null);
}

function readOptionalStringArray(
  value: unknown,
  path: string,
  errors: string[],
): string[] | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  return readStringArray(value, path, errors, 1) ?? undefined;
}

function readArray(value: unknown, path: string, errors: string[]): unknown[] | null {
  if (!Array.isArray(value)) {
    errors.push(`${path} 必须是数组。`);
    return null;
  }
  return value;
}

function readEnum<T extends string>(
  value: unknown,
  path: string,
  allowed: readonly T[],
  errors: string[],
): T | null {
  const normalized = readString(value, path, errors);
  if (!normalized) {
    return null;
  }
  if (!allowed.includes(normalized as T)) {
    errors.push(`${path} 必须是 ${allowed.join(" / ")} 之一。`);
    return null;
  }
  return normalized as T;
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

export function formatDictionaryProValidationErrors(errors: string[]): string {
  return errors.map((error, index) => `${index + 1}. ${error}`).join("\n");
}
