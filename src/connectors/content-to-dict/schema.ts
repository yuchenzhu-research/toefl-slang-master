import type { ExpressionCardSeed, TargetRegister } from "../../platform/contracts";

export type ContentToDictInput = {
  expression: string;
  sourceSentence: string;
  whyWorthLearning: string;
  registerHint: string;
  category: string;
  transferPotential: string;
  difficulty: string;
  downstreamTarget: string;
};

export type ContentToDictBundle = {
  seeds: ExpressionCardSeed[];
};
