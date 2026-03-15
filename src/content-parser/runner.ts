import { ToeflSlangClient, ToeflSlangClientOptions } from "../api/client";
import { resolveContentParserSource } from "./extractor";
import { buildContentParserPrompts, buildContentParserRepairPrompts } from "./prompt";
import { renderContentParserResponse } from "./render";
import { ContentParserStructuredResponse } from "./schema";
import { ContentParserQuery, ContentParserSourcePayload } from "./types";
import {
  formatContentParserValidationErrors,
  parseAndValidateContentParserResponse,
} from "./validator";

const MAX_GENERATION_ATTEMPTS = 3;

export type ContentParserRunResult = {
  source: ContentParserSourcePayload;
  structured: ContentParserStructuredResponse;
  markdown: string;
  rawText: string;
  attempts: number;
  repaired: boolean;
};

export async function runContentParserQuery(params: {
  query: ContentParserQuery;
  clientOptions: ToeflSlangClientOptions;
  source?: ContentParserSourcePayload;
}): Promise<ContentParserRunResult> {
  const client = new ToeflSlangClient(params.clientOptions);
  const source = params.source ?? (await resolveContentParserSource(params.query));
  let rawText = "";
  let validationErrors: string[] = [];

  for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const prompts =
      attempt === 1
        ? buildContentParserPrompts(params.query, source, { outputMode: "json" })
        : buildContentParserRepairPrompts({
            query: params.query,
            source,
            previousOutput: rawText,
            validationErrors,
          });

    rawText = await client.chat(prompts.systemPrompt, prompts.userPrompt);
    const parsed = parseAndValidateContentParserResponse(rawText, params.query, source);

    if (parsed.ok) {
      return {
        source,
        structured: parsed.value,
        markdown: renderContentParserResponse(parsed.value),
        rawText,
        attempts: attempt,
        repaired: attempt > 1,
      };
    }

    validationErrors = parsed.errors;
  }

  throw new Error(
    [
      `Content Parser failed validation after ${MAX_GENERATION_ATTEMPTS} attempts.`,
      "Validation errors:",
      formatContentParserValidationErrors(validationErrors),
      "",
      "Last model output:",
      rawText,
    ].join("\n"),
  );
}
