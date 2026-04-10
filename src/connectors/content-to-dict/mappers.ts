import type { ExpressionCardSeed } from "../../platform/contracts";
import type { ContentToDictInput, ContentToDictBundle } from "./schema";

export function toExpressionCardSeed(item: ContentToDictInput): ExpressionCardSeed {
  return {
    query: item.expression.trim(),
    mode: "upgrade",
    target: (item.downstreamTarget as any) || "toefl-writing",
    context: item.sourceSentence.trim(),
    problem: item.whyWorthLearning.trim(),
    upgradeGoal: `Master the usage of "${item.expression}" in ${item.registerHint || 'academic'} contexts.`,
    source: {
      module: "content-parser",
      category: item.category,
      severity: "medium", // Default for content mining
    },
  };
}

export function toExpressionCardSeeds(items: ContentToDictInput[]): ExpressionCardSeed[] {
  return items.map(toExpressionCardSeed);
}

export function buildContentToDictBundle(items: ContentToDictInput[]): ContentToDictBundle {
  return {
    seeds: toExpressionCardSeeds(items),
  };
}
