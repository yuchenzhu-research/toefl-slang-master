import type { WeakExpressionSet } from "../platform/contracts";
import { ToeflWritingSourcePayload } from "./types";

export type ToeflWritingScope = "sentence" | "paragraph" | "essay";

export type ToeflWritingStructuredResponse = {
  kind: "writing_diagnosis";
  title: string;
  scope: ToeflWritingScope;
  sourceType: ToeflWritingSourcePayload["sourceType"];
  charCount: number;
  score: {
    band: string;
    reason: string;
  };
  logic: string[];
  vocabulary: string[];
  structure: string[];
  optimization: {
    rewrite: string;
    explanations: string[];
  };
  weakExpressionSet?: WeakExpressionSet;
  revisionFocus?: string[];
  upgradePrioritySummary?: string;
  notes?: string[];
};

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
