import * as fs from "fs";
import * as path from "path";
import { spawnSync } from "child_process";
import { ContentParserQuery, ContentParserSourcePayload, ContentParserSourceType } from "./types";

const DEFAULT_MAX_CHARS = 12000;
const PDF_SCRIPT_PATH = path.join(
  __dirname,
  "..",
  "..",
  "skills",
  "content-parser",
  "scripts",
  "extract_pdf_text.py",
);

export async function resolveContentParserSource(
  query: ContentParserQuery,
): Promise<ContentParserSourcePayload> {
  if (query.text?.trim()) {
    return buildInlineTextSource(query.text, query.title, query.maxChars);
  }

  const inputPath = query.pdfPath ?? query.filePath;
  if (!inputPath) {
    throw new Error("Missing source. Provide --pdf, --file, or --text.");
  }

  const absolutePath = path.resolve(inputPath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Source file not found: ${absolutePath}`);
  }

  const extension = path.extname(absolutePath).toLowerCase();
  if (query.pdfPath || extension === ".pdf") {
    return extractPdfSource(absolutePath, query.maxChars);
  }

  return extractTextFileSource(absolutePath, query.maxChars, query.title);
}

function buildInlineTextSource(
  rawText: string,
  title?: string,
  maxChars?: number,
): ContentParserSourcePayload {
  const normalized = normalizeText(rawText);
  const trimmed = clipText(normalized, maxChars);
  return {
    title: title?.trim() || "Inline Text",
    sourceType: "text",
    sourceName: "inline-text",
    text: trimmed.text,
    charCount: trimmed.text.length,
    truncated: trimmed.truncated,
    extractionEngine: "inline",
    warnings: trimmed.truncated ? ["Source text was truncated before prompt assembly."] : [],
  };
}

function extractTextFileSource(
  absolutePath: string,
  maxChars?: number,
  title?: string,
): ContentParserSourcePayload {
  const fileContents = fs.readFileSync(absolutePath, "utf-8");
  const normalized = normalizeText(fileContents);
  const trimmed = clipText(normalized, maxChars);
  return {
    title: title?.trim() || path.basename(absolutePath, path.extname(absolutePath)),
    sourceType: resolveTextSourceType(absolutePath),
    sourceName: path.basename(absolutePath),
    text: trimmed.text,
    charCount: trimmed.text.length,
    truncated: trimmed.truncated,
    extractionEngine: "fs",
    warnings: trimmed.truncated ? ["Source text was truncated before prompt assembly."] : [],
  };
}

function extractPdfSource(absolutePath: string, maxChars?: number): ContentParserSourcePayload {
  const pythonBinary = resolvePythonBinary();
  const effectiveMaxChars = normalizeMaxChars(maxChars);
  const result = spawnSync(
    pythonBinary,
    [PDF_SCRIPT_PATH, absolutePath, "--json", "--max-chars", String(effectiveMaxChars)],
    {
      encoding: "utf-8",
      maxBuffer: 4 * 1024 * 1024,
    },
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const errorText = (result.stderr || result.stdout || "").trim();
    throw new Error(errorText || "PDF extraction failed.");
  }

  let payload: unknown;
  try {
    payload = JSON.parse(result.stdout);
  } catch (error) {
    throw new Error(`Failed to parse PDF extraction output: ${(error as Error).message}`);
  }

  const record = payload as Record<string, unknown>;
  const text = typeof record.text === "string" ? record.text.trim() : "";
  if (!text) {
    throw new Error("PDF extraction returned empty text.");
  }

  const warnings = Array.isArray(record.warnings)
    ? record.warnings.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];

  return {
    title:
      typeof record.title === "string" && record.title.trim().length > 0
        ? record.title.trim()
        : path.basename(absolutePath, path.extname(absolutePath)),
    sourceType: "pdf",
    sourceName: path.basename(absolutePath),
    text,
    charCount: typeof record.charCount === "number" ? record.charCount : text.length,
    truncated: Boolean(record.truncated),
    pageCount: typeof record.pageCount === "number" ? record.pageCount : undefined,
    extractionEngine:
      typeof record.engine === "string" && record.engine.trim().length > 0
        ? record.engine.trim()
        : "python",
    warnings,
  };
}

function resolvePythonBinary(): string {
  const candidates = ["python3", "python"];
  for (const candidate of candidates) {
    const result = spawnSync(candidate, ["--version"], { encoding: "utf-8" });
    if (result.status === 0) {
      return candidate;
    }
  }
  throw new Error("Python is required for PDF extraction but neither python3 nor python was found.");
}

function resolveTextSourceType(absolutePath: string): ContentParserSourceType {
  const extension = path.extname(absolutePath).toLowerCase();
  if (extension === ".md" || extension === ".markdown") {
    return "markdown";
  }
  return "text";
}

function normalizeText(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

function clipText(text: string, maxChars?: number): { text: string; truncated: boolean } {
  const effectiveMaxChars = normalizeMaxChars(maxChars);
  if (text.length <= effectiveMaxChars) {
    return { text, truncated: false };
  }

  return {
    text: text.slice(0, effectiveMaxChars).trimEnd(),
    truncated: true,
  };
}

function normalizeMaxChars(maxChars?: number): number {
  if (!maxChars || !Number.isInteger(maxChars) || maxChars <= 0) {
    return DEFAULT_MAX_CHARS;
  }
  return maxChars;
}
