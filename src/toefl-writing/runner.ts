import { ToeflSlangClient, ToeflSlangClientOptions } from "../platform/client";
import { runValidatedJsonGeneration } from "../platform/runtime/validated-json";
import { buildToeflWritingPrompts, buildToeflWritingRepairPrompts } from "./prompt";
import { renderToeflWritingResponse } from "./render";
import { ToeflWritingStructuredResponse } from "./schema";
import { ToeflWritingQuery, ToeflWritingSourcePayload } from "./types";
import {
  formatToeflWritingValidationErrors,
  parseAndValidateToeflWritingResponse,
} from "./validator";

const MAX_GENERATION_ATTEMPTS = 3;

export type ToeflWritingRunResult = {
  source: ToeflWritingSourcePayload;
  structured: ToeflWritingStructuredResponse;
  markdown: string;
  rawText: string;
  attempts: number;
  repaired: boolean;
};

export async function runToeflWritingQuery(params: {
  query: ToeflWritingQuery;
  clientOptions: ToeflSlangClientOptions;
  source: ToeflWritingSourcePayload;
}): Promise<ToeflWritingRunResult> {
  const client = await ToeflSlangClient.create(params.clientOptions);
  const validated = await runValidatedJsonGeneration({
    maxAttempts: MAX_GENERATION_ATTEMPTS,
    failureLabel: "TOEFL Coach",
    generate: async ({ attempt, previousOutput, validationErrors }) => {
      const prompts =
        attempt === 1
        ? buildToeflWritingPrompts(params.query, params.source, { outputMode: "json" })
        : buildToeflWritingRepairPrompts({
            query: params.query,
            source: params.source,
            previousOutput,
            validationErrors,
          });

      return client.chat(prompts.systemPrompt, prompts.userPrompt);
    },
    parseAndValidate: (rawText) =>
      parseAndValidateToeflWritingResponse(rawText, params.query, params.source),
    formatValidationErrors: formatToeflWritingValidationErrors,
  });

  return {
    source: params.source,
    structured: validated.value,
    markdown: renderToeflWritingResponse(validated.value),
    rawText: validated.rawText,
    attempts: validated.attempts,
    repaired: validated.repaired,
  };
}
