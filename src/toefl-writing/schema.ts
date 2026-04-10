import type { WritingDiagnosis } from "../platform/contracts";

export type ToeflWritingScope = "sentence" | "paragraph" | "essay";

export type ToeflWritingStructuredResponse = WritingDiagnosis;

export function inferWritingScope(text: string): ToeflWritingScope {
  const normalized = text.trim();
  const sentenceCount = normalized
    .split(/[.!?]+/)
    .map((item) => item.trim())
    .filter(Boolean).length;
  const wordCount = normalized.split(/\s+/).filter(Boolean).length;

  if (sentenceCount <= 1 && wordCount <= 40) {
    return "sentence";
  }
  if (sentenceCount <= 5 && wordCount <= 220) {
    return "paragraph";
  }
  return "essay";
}
