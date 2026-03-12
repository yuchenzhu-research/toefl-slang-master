import { flattenText, postJson, requireText, normalizeBaseUrl } from "../http";
import { ProviderProtocol } from "../types";

type OpenAiResponsesPayload = {
  output_text?: unknown;
  output?: Array<{
    content?: unknown;
  }>;
};

export const openAiResponsesProtocol: ProviderProtocol = {
  async generate({ provider, request }) {
    const payload = (await postJson({
      url: `${normalizeBaseUrl(provider.baseUrl)}/responses`,
      headers: {
        Authorization: `Bearer ${provider.apiKey ?? ""}`,
        "Content-Type": "application/json",
        ...provider.headers,
      },
      body: {
        model: provider.model,
        instructions: request.systemPrompt,
        input: request.userPrompt,
        temperature: request.temperature ?? 0.3,
        max_output_tokens: provider.maxTokens,
      },
      signal: request.signal,
    })) as OpenAiResponsesPayload;

    const text = extractOpenAiResponsesText(payload);
    return { text: requireText(text, provider.provider), raw: payload };
  },
};

function extractOpenAiResponsesText(payload: OpenAiResponsesPayload): string {
  const direct = flattenText(payload.output_text);
  if (direct.trim()) {
    return direct;
  }

  const output = Array.isArray(payload.output) ? payload.output : [];
  return output.map((item) => flattenText(item.content)).filter(Boolean).join("\n");
}
