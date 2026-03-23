import type { DictionaryProRunResult } from "../../dictionary-pro/runner";
import { runDictionaryProQuery } from "../../dictionary-pro/runner";
import type { ToeflSlangClientOptions } from "../../platform/client";
import type { ToeflWritingStructuredResponse } from "../../toefl-writing/schema";
import { buildCoachToDictBridgeBundle } from "./mappers";
import type { CoachToDictBridgeBundle, CoachToDictDictionaryQuery, ExpressionCardSeed } from "./schema";

export type CoachToDictBridgeItem = {
  seed: ExpressionCardSeed;
  query: CoachToDictDictionaryQuery;
  result: DictionaryProRunResult;
};

export type CoachToDictBridgeRunResult =
  | {
      ok: true;
      bundle: CoachToDictBridgeBundle;
      items: CoachToDictBridgeItem[];
      totalAvailable: number;
      totalExecuted: number;
    }
  | {
      ok: false;
      reason: "missing_weak_expression_set";
      bundle: null;
      items: [];
      totalAvailable: 0;
      totalExecuted: 0;
    };

export async function runCoachToDictBridge(params: {
  diagnosis: ToeflWritingStructuredResponse;
  clientOptions: ToeflSlangClientOptions;
  limit?: number;
}): Promise<CoachToDictBridgeRunResult> {
  const bundle = buildCoachToDictBridgeBundle(params.diagnosis);
  if (!bundle) {
    return {
      ok: false,
      reason: "missing_weak_expression_set",
      bundle: null,
      items: [],
      totalAvailable: 0,
      totalExecuted: 0,
    };
  }

  const limit = resolveBridgeLimit(params.limit, bundle.queries.length);
  const seeds = bundle.seeds.slice(0, limit);
  const queries = bundle.queries.slice(0, limit);
  const items: CoachToDictBridgeItem[] = [];

  for (let index = 0; index < queries.length; index += 1) {
    const query = queries[index];
    const seed = seeds[index];
    const result = await runDictionaryProQuery({
      query: {
        text: query.text,
        context: query.context,
        mode: query.mode,
        target: query.target,
      },
      clientOptions: params.clientOptions,
    });

    items.push({
      seed,
      query,
      result,
    });
  }

  return {
    ok: true,
    bundle,
    items,
    totalAvailable: bundle.queries.length,
    totalExecuted: items.length,
  };
}

function resolveBridgeLimit(limit: number | undefined, totalAvailable: number): number {
  if (limit === undefined) {
    return totalAvailable;
  }

  if (!Number.isInteger(limit) || limit <= 0) {
    return totalAvailable;
  }

  return Math.min(limit, totalAvailable);
}
