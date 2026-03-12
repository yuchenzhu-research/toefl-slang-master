import { flattenText, postJson, requireText, normalizeBaseUrl } from "../http";
import { ProviderProtocol } from "../types";

export const openAiCompletionsProtocol: ProviderProtocol = {
  async generate({ provider, request }) {
    const payload = await postJson({
      url: `${normalizeBaseUrl(provider.baseUrl)}/chat/completions`,
      headers: {
        Authorization: `Bearer ${provider.apiKey ?? ""}`,
        "Content-Type": "application/json",
        ...provider.headers,
      },
      body: {
        model: provider.model,
        messages: [
          { role: "system", content: request.systemPrompt },
          { role: "user", content: request.userPrompt },
        ],
        temperature: request.temperature ?? 0.3,
        max_tokens: provider.maxTokens,
      },
      signal: request.signal,
    });

    const text = extractOpenAiCompletionsText(payload);
    return { text: requireText(text, provider.provider), raw: payload };
  },
};

function extractOpenAiCompletionsText(payload: unknown): string {
  const choices = (payload as { choices?: Array<{ message?: { content?: unknown }; text?: unknown }> })
    ?.choices;
  if (!Array.isArray(choices) || choices.length === 0) {
    return "";
  }

  const first = choices[0];
  return flattenText(first?.message?.content ?? first?.text);
}
