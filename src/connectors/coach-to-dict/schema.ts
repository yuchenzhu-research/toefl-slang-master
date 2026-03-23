import type { DictionaryProQuery, DictionaryProTarget } from "../../dictionary-pro/types";

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
export type ConnectorWritingScope = "sentence" | "paragraph" | "essay";

export type WeakExpression = {
  text: string;
  category: WeakExpressionCategory;
  severity: WeakExpressionSeverity;
  reason: string;
  targetRegister: DictionaryProTarget;
  sourceSentence: string;
  sourceFragment?: string;
  rewriteGoal: string;
  coachNote?: string;
};

export type WeakExpressionSet = {
  kind: "weak_expression_set";
  title: string;
  scope: ConnectorWritingScope;
  targetRegister: DictionaryProTarget;
  sourceText: string;
  summary: string;
  items: WeakExpression[];
  notes?: string[];
};

export type ExpressionCardSeed = {
  query: string;
  mode: "upgrade";
  target: DictionaryProTarget;
  context: string;
  problem: string;
  upgradeGoal: string;
  source: {
    module: "toefl-writing";
    category: WeakExpressionCategory;
    severity: WeakExpressionSeverity;
  };
};

export type WritingDiagnosisConnectorView = {
  title: string;
  scope: ConnectorWritingScope;
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
  notes?: string[];
  weakExpressionSet?: WeakExpressionSet;
  revisionFocus?: string[];
  upgradePrioritySummary?: string;
};

export type WeakExpressionSetBuildInput = {
  diagnosis: {
    title: string;
    scope: ConnectorWritingScope;
    notes?: string[];
  };
  sourceText: string;
  targetRegister?: DictionaryProTarget;
  summary?: string;
  items: WeakExpression[];
  notes?: string[];
};

export type ExpressionCardSeedSource = {
  query: string;
  context: string;
  problem: string;
  upgradeGoal: string;
  category: WeakExpressionCategory;
  severity: WeakExpressionSeverity;
  targetRegister: DictionaryProTarget;
};

export type CoachToDictDictionaryQuery = Pick<
  DictionaryProQuery,
  "text" | "context" | "mode" | "target"
>;

export type CoachToDictBridgeBundle = {
  weakExpressionSet: WeakExpressionSet;
  seeds: ExpressionCardSeed[];
  queries: CoachToDictDictionaryQuery[];
};
