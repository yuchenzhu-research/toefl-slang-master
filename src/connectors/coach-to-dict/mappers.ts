import type { DictionaryProTarget } from "../../dictionary-pro/types";
import type { ToeflWritingStructuredResponse } from "../../toefl-writing/schema";
import {
  ExpressionCardSeed,
  ExpressionCardSeedSource,
  WeakExpression,
  WeakExpressionSet,
  WeakExpressionSetBuildInput,
} from "./schema";

const SEVERITY_WEIGHT: Record<WeakExpression["severity"], number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export function buildWeakExpressionSet(input: WeakExpressionSetBuildInput): WeakExpressionSet {
  const sortedItems = sortWeakExpressions(input.items);
  const mergedNotes = mergeNotes(input.diagnosis.notes, input.notes);

  return {
    kind: "weak_expression_set",
    title: input.diagnosis.title,
    scope: input.diagnosis.scope,
    targetRegister: input.targetRegister ?? "toefl-writing",
    sourceText: input.sourceText.trim(),
    summary: input.summary?.trim() || defaultWeakExpressionSummary(sortedItems),
    items: sortedItems,
    notes: mergedNotes,
  };
}

export function toExpressionCardSeed(item: WeakExpression): ExpressionCardSeed {
  const normalized = normalizeWeakExpressionSource(item);

  return {
    query: normalized.query,
    mode: "upgrade",
    target: normalized.targetRegister,
    context: normalized.context,
    problem: normalized.problem,
    upgradeGoal: normalized.upgradeGoal,
    source: {
      module: "toefl-writing",
      category: normalized.category,
      severity: normalized.severity,
    },
  };
}

export function toExpressionCardSeeds(set: WeakExpressionSet): ExpressionCardSeed[] {
  return set.items.map((item) => toExpressionCardSeed(item));
}

export function buildConnectorView(
  diagnosis: ToeflWritingStructuredResponse,
  weakExpressionSet?: WeakExpressionSet,
): import("./schema").WritingDiagnosisConnectorView {
  const revisionFocus = weakExpressionSet
    ? weakExpressionSet.items.slice(0, 3).map((item) => item.sourceFragment ?? item.text)
    : undefined;

  return {
    ...diagnosis,
    weakExpressionSet,
    revisionFocus,
    upgradePrioritySummary: weakExpressionSet
      ? `${weakExpressionSet.items.length} expression issue(s) should be upgraded first.`
      : undefined,
  };
}

export function normalizeWeakExpressionSource(item: WeakExpression): ExpressionCardSeedSource {
  const query = resolveWeakExpressionQuery(item);
  const context = item.sourceSentence.trim();
  const problem = [item.reason.trim(), item.coachNote?.trim()].filter(Boolean).join(" ");

  return {
    query,
    context,
    problem,
    upgradeGoal: item.rewriteGoal.trim(),
    category: item.category,
    severity: item.severity,
    targetRegister: item.targetRegister,
  };
}

export function resolveWeakExpressionQuery(item: WeakExpression): string {
  const text = item.text.trim();
  const fragment = item.sourceFragment?.trim();

  if (!fragment) {
    return text;
  }

  if (fragment.length > text.length) {
    return fragment;
  }

  if (fragment.toLowerCase() !== text.toLowerCase() && fragment.includes(" ")) {
    return fragment;
  }

  return text;
}

export function sortWeakExpressions(items: WeakExpression[]): WeakExpression[] {
  return [...items].sort((left, right) => {
    const severityGap = SEVERITY_WEIGHT[right.severity] - SEVERITY_WEIGHT[left.severity];
    if (severityGap !== 0) {
      return severityGap;
    }

    const leftQuery = resolveWeakExpressionQuery(left);
    const rightQuery = resolveWeakExpressionQuery(right);
    const specificityGap = scoreQuerySpecificity(rightQuery) - scoreQuerySpecificity(leftQuery);
    if (specificityGap !== 0) {
      return specificityGap;
    }

    return leftQuery.localeCompare(rightQuery);
  });
}

export function inferTargetRegister(
  target?: DictionaryProTarget,
  fallback: DictionaryProTarget = "toefl-writing",
): DictionaryProTarget {
  return target ?? fallback;
}

function defaultWeakExpressionSummary(items: WeakExpression[]): string {
  if (items.length === 0) {
    return "No expression-level issues were extracted.";
  }

  const highPriorityCount = items.filter((item) => item.severity === "high").length;
  if (highPriorityCount > 0) {
    return `${highPriorityCount} high-priority expression issue(s) should be upgraded first.`;
  }

  return `${items.length} expression issue(s) were extracted for focused upgrade.`;
}

function mergeNotes(
  diagnosisNotes: string[] | undefined,
  connectorNotes: string[] | undefined,
): string[] | undefined {
  const merged = [...(connectorNotes ?? []), ...(diagnosisNotes ?? [])].map((item) => item.trim());
  const unique = merged.filter((item, index) => item.length > 0 && merged.indexOf(item) === index);
  return unique.length > 0 ? unique : undefined;
}

function scoreQuerySpecificity(query: string): number {
  return query.split(/\s+/).filter(Boolean).length;
}
