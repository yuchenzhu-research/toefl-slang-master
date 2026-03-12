import { ToeflSlangClient, ToeflSlangClientOptions } from "../api/client";
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
  const client = new ToeflSlangClient(params.clientOptions);
  let rawText = "";
  let validationErrors: string[] = [];

  for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const prompts =
      attempt === 1
        ? buildDictionaryProPrompts(params.query, { outputMode: "json" })
        : buildDictionaryProRepairPrompts({
            query: params.query,
            previousOutput: rawText,
            validationErrors,
          });

    rawText = await client.chat(prompts.systemPrompt, prompts.userPrompt);
    const parsed = parseAndValidateDictionaryProResponse(rawText, params.query);

    if (parsed.ok) {
      return {
        structured: parsed.value,
        markdown: renderDictionaryProResponse(parsed.value),
        rawText,
        attempts: attempt,
        repaired: attempt > 1,
      };
    }

    validationErrors = parsed.errors;
  }

  throw new Error(
    [
      `Dictionary Pro failed validation after ${MAX_GENERATION_ATTEMPTS} attempts.`,
      "Validation errors:",
      formatDictionaryProValidationErrors(validationErrors),
      "",
      "Last model output:",
      rawText,
    ].join("\n"),
  );
}
