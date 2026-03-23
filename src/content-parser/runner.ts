import { ToeflSlangClient, ToeflSlangClientOptions } from "../platform/client";
import { runValidatedJsonGeneration } from "../platform/runtime/validated-json";
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
  const validated = await runValidatedJsonGeneration({
    maxAttempts: MAX_GENERATION_ATTEMPTS,
    failureLabel: "Content Parser",
    generate: async ({ attempt, previousOutput, validationErrors }) => {
      const prompts =
        attempt === 1
        ? buildContentParserPrompts(params.query, source, { outputMode: "json" })
        : buildContentParserRepairPrompts({
            query: params.query,
            source,
            previousOutput,
            validationErrors,
          });

      return client.chat(prompts.systemPrompt, prompts.userPrompt);
    },
    parseAndValidate: (rawText) =>
      parseAndValidateContentParserResponse(rawText, params.query, source),
    formatValidationErrors: formatContentParserValidationErrors,
  });

  return {
    source,
    structured: validated.value,
    markdown: renderContentParserResponse(validated.value),
    rawText: validated.rawText,
    attempts: validated.attempts,
    repaired: validated.repaired,
  };
}
