import { ToeflSlangClient, ToeflSlangClientOptions } from "../platform/client";
import { runValidatedJsonGeneration } from "../platform/runtime/validated-json";
import {
  buildDictionaryProPrompts,
  buildDictionaryProRepairPrompts,
} from "./prompt";
import { renderDictionaryProResponse } from "./render";
import { DictionaryProStructuredResponse } from "./schema";
import { DictionaryProQuery } from "./types";
import {
  formatDictionaryProValidationErrors,
  parseAndValidateDictionaryProResponse,
} from "./validator";

const MAX_GENERATION_ATTEMPTS = 3;

export type DictionaryProRunResult = {
  structured: DictionaryProStructuredResponse;
  markdown: string;
  rawText: string;
  attempts: number;
  repaired: boolean;
};

export async function runDictionaryProQuery(params: {
  query: DictionaryProQuery;
  clientOptions: ToeflSlangClientOptions;
}): Promise<DictionaryProRunResult> {
  const client = await ToeflSlangClient.create(params.clientOptions);
  const validated = await runValidatedJsonGeneration({
    maxAttempts: MAX_GENERATION_ATTEMPTS,
    failureLabel: "Dictionary Pro",
    generate: async ({ attempt, previousOutput, validationErrors }) => {
      const prompts =
        attempt === 1
        ? buildDictionaryProPrompts(params.query, { outputMode: "json" })
        : buildDictionaryProRepairPrompts({
            query: params.query,
            previousOutput,
            validationErrors,
          });

      return client.chat(prompts.systemPrompt, prompts.userPrompt);
    },
    parseAndValidate: (rawText) => parseAndValidateDictionaryProResponse(rawText, params.query),
    formatValidationErrors: formatDictionaryProValidationErrors,
  });

  return {
    structured: validated.value,
    markdown: renderDictionaryProResponse(validated.value),
    rawText: validated.rawText,
    attempts: validated.attempts,
    repaired: validated.repaired,
  };
}
