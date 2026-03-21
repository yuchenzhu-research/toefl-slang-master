import { ToeflSlangClient, ToeflSlangClientOptions } from "../api/client";
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
  const client = new ToeflSlangClient(params.clientOptions);
  let rawText = "";
  let validationErrors: string[] = [];

  for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const prompts =
      attempt === 1
        ? buildToeflWritingPrompts(params.query, params.source, { outputMode: "json" })
        : buildToeflWritingRepairPrompts({
            query: params.query,
            source: params.source,
            previousOutput: rawText,
            validationErrors,
          });

    rawText = await client.chat(prompts.systemPrompt, prompts.userPrompt);
    const parsed = parseAndValidateToeflWritingResponse(rawText, params.query, params.source);

    if (parsed.ok) {
      return {
        source: params.source,
        structured: parsed.value,
        markdown: renderToeflWritingResponse(parsed.value),
        rawText,
        attempts: attempt,
        repaired: attempt > 1,
      };
    }

    validationErrors = parsed.errors;
  }

  throw new Error(
    [
      `TOEFL Coach failed validation after ${MAX_GENERATION_ATTEMPTS} attempts.`,
      "Validation errors:",
      formatToeflWritingValidationErrors(validationErrors),
      "",
      "Last model output:",
      rawText,
    ].join("\n"),
  );
}
