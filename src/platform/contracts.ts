/**
 * Core Domain Contracts
 * 这些是贯穿 TOEFL Slang Master 的标准数据对象（契约）。
 * JSON keys、schema 字段名、enum、内部 ID 一律保持英文。
 */

export type TargetRegister =
  | "toefl-writing"
  | "toefl-speaking"
  | "general-academic"
  | "daily-english"
  | "ielts-academic"
  | "gre-verbal";

export type WritingScope = "sentence" | "paragraph" | "essay";
export type WritingSourceType = "text" | "file";

export const WEAK_EXPRESSION_CATEGORIES = [
  "low_precision_word",
  "spoken_opinion_marker",
  "informal_phrase",
  "weak_collocation",
  "flat_transition",
  "overgeneral_claim",
] as const;

export const WEAK_EXPRESSION_SEVERITIES = ["high", "medium", "low"] as const;

export type WeakExpressionCategory = (typeof WEAK_EXPRESSION_CATEGORIES)[number];
export type WeakExpressionSeverity = (typeof WEAK_EXPRESSION_SEVERITIES)[number];

// ---------------------------------------------------------
// 1. Content Parser -> Dictionary Pro & TOEFL Coach 的输出
// ---------------------------------------------------------

export interface SourceDigest {
  title: string;
  sourceType: string;
  summary: string;
  culturalNotes: string[];
  keySyntaxPatterns: string[];
}

export interface ExpressionCandidateItem {
  expression: string;
  sourceSentence: string;
  whyWorthLearning: string;
  registerHint: string;
  category: string;
  transferPotential: string;
  difficulty: string;
  downstreamTarget: string;
}

export interface ExpressionCandidates {
  candidates: ExpressionCandidateItem[];
  sourceReference?: string;
}

// ---------------------------------------------------------
// 2. Dictionary Pro 的主产物
// ---------------------------------------------------------

export interface ExpressionCard {
  headword: string;
  context: string;
  translation: string;
  slangOrInformal: string[];
  academicAlignment: string[];
  frequency: string;
  analysis: string;
  tags: string[];
  relatedSourceSlug?: string;
  relatedDiagnosisSlug?: string;
  srsData?: {
    efactor: number;
    interval: number;
    repetitions: number;
    nextReview: string;
  };
}

// ---------------------------------------------------------
// 3. TOEFL Coach -> Dictionary Pro 的输出
// ---------------------------------------------------------

export interface WeakExpression {
  text: string;
  category: WeakExpressionCategory;
  severity: WeakExpressionSeverity;
  reason: string;
  targetRegister: TargetRegister;
  sourceSentence: string;
  sourceFragment?: string;
  rewriteGoal: string;
  coachNote?: string;
}

export interface WeakExpressionSet {
  kind: "weak_expression_set";
  title: string;
  scope: WritingScope;
  targetRegister: TargetRegister;
  sourceText: string;
  summary: string;
  items: WeakExpression[];
  notes?: string[];
}

export interface WritingDiagnosis {
  kind: "writing_diagnosis";
  title: string;
  scope: WritingScope;
  sourceType: WritingSourceType;
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
}

// ---------------------------------------------------------
// 4. Connector 层专用（衔接对象）
// ---------------------------------------------------------

export interface ExpressionCardSeed {
  query: string;
  mode: "upgrade";
  target: TargetRegister;
  context: string;
  problem: string;
  upgradeGoal: string;
  source: {
    module: "toefl-writing" | "content-parser" | "manual";
    category?: WeakExpressionCategory | string;
    severity?: WeakExpressionSeverity;
  };
}
