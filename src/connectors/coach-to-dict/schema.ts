import type { DictionaryProQuery } from "../../dictionary-pro/types";
import type {
  ExpressionCardSeed,
  TargetRegister,
  WeakExpression,
  WeakExpressionCategory,
  WeakExpressionSet,
  WeakExpressionSeverity,
  WritingDiagnosis,
  WritingScope,
} from "../../platform/contracts";

export {
  WEAK_EXPRESSION_CATEGORIES,
  WEAK_EXPRESSION_SEVERITIES,
} from "../../platform/contracts";
export type {
  ExpressionCardSeed,
  TargetRegister,
  WeakExpression,
  WeakExpressionCategory,
  WeakExpressionSet,
  WeakExpressionSeverity,
  WritingDiagnosis,
  WritingScope,
} from "../../platform/contracts";

export type ConnectorWritingScope = WritingScope;
export type WritingDiagnosisConnectorView = WritingDiagnosis;

export type WeakExpressionSetBuildInput = {
  diagnosis: {
    title: string;
    scope: ConnectorWritingScope;
    notes?: string[];
  };
  sourceText: string;
  targetRegister?: TargetRegister;
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
  targetRegister: TargetRegister;
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
