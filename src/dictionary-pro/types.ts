import type { TargetRegister } from "../platform/contracts";
import { ProviderApi } from "../platform/providers/types";

export type DictionaryProMode = "meaning" | "conversion" | "upgrade" | "comparison";

export type DictionaryProTarget = TargetRegister;

export interface DictionaryProQuery {
  text?: string;
  context?: string;
  mode?: DictionaryProMode;
  target?: DictionaryProTarget;
  dryRun?: boolean;
  jsonOutput?: boolean;
  listProviders?: boolean;
  provider?: string;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  protocol?: ProviderApi;
  maxTokens?: number;
  cloudflareAccountId?: string;
  cloudflareGatewayId?: string;
}

// ── Merged from schema.ts ──


export type DictionaryProActiveMode = DictionaryProMode | "auto-detect";

export type DictionaryProAlignmentItem = {
  expression: string;
  note: string;
};

export type DictionaryProSlangBlock = {
  register: string;
  tone: string;
  variants: string[];
};

export type DictionaryProAnalysisBlock = {
  sourceExample: string;
  sourceExplanation: string;
  toeflExample: string;
  toeflExplanation: string;
};

export type DictionaryProBaseResponse = {
  kind: DictionaryProResponseKind;
  query: string;
  mode: DictionaryProActiveMode;
  target: DictionaryProTarget;
  context?: string;
  notes?: string[];
};

export type DictionaryProWordPhraseResponse = DictionaryProBaseResponse & {
  kind: "word_phrase";
  translation: string[];
  slang: DictionaryProSlangBlock;
  alignment: DictionaryProAlignmentItem[];
  frequency: string;
  analysis: DictionaryProAnalysisBlock;
};

export type DictionaryProSentenceUpgradeResponse = DictionaryProBaseResponse & {
  kind: "sentence_upgrade";
  problem: string;
  replacements: Array<{
    source: string;
    replacement: string;
    reason: string;
  }>;
  recommendedRewrite: string;
  explanation: string;
};

export type DictionaryProComparisonResponse = DictionaryProBaseResponse & {
  kind: "comparison";
  items: Array<{
    expression: string;
    register: string;
    toeflSuitability: "yes" | "no" | "caution";
    difference: string;
  }>;
  summary?: string;
};

export type DictionaryProAmbiguousResponse = DictionaryProBaseResponse & {
  kind: "ambiguous";
  possibleSenses: string[];
  clarificationPrompt: string;
  resolvedCard: DictionaryProWordPhraseResponse | null;
};

export type DictionaryProStructuredResponse =
  | DictionaryProWordPhraseResponse
  | DictionaryProSentenceUpgradeResponse
  | DictionaryProComparisonResponse
  | DictionaryProAmbiguousResponse;

export type DictionaryProResponseKind =
  | "word_phrase"
  | "sentence_upgrade"
  | "comparison"
  | "ambiguous";

export function resolveActiveMode(query: DictionaryProQuery): DictionaryProActiveMode {
  return query.mode ?? "auto-detect";
}

export function resolveActiveTarget(query: DictionaryProQuery): DictionaryProTarget {
  return query.target ?? "toefl-writing";
}
