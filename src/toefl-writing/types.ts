import { ProviderApi } from "../platform/providers/types";

export type ToeflWritingSourceType = "text" | "file";

export interface ToeflWritingQuery {
  text?: string;
  filePath?: string;
  title?: string;
  dryRun?: boolean;
  jsonOutput?: boolean;
  listProviders?: boolean;
  provider?: string;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  protocol?: ProviderApi;
  maxTokens?: number;
  maxChars?: number;
  cloudflareAccountId?: string;
  cloudflareGatewayId?: string;
}

export type ToeflWritingSourcePayload = {
  title: string;
  sourceType: ToeflWritingSourceType;
  sourceName: string;
  text: string;
  charCount: number;
  truncated: boolean;
  warnings: string[];
};

// ── Merged from schema.ts ──

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
