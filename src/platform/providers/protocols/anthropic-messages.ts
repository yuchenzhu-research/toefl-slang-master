import {
  flattenText,
  normalizeAnthropicBaseUrl,
  postJson,
  requireText,
} from "../http";
import { ProviderProtocol } from "../types";

type AnthropicResponse = {
  content?: Array<{
    type?: string;
    text?: string;
  }>;
};

export const anthropicMessagesProtocol: ProviderProtocol = {
  async generate({ provider, request }) {
    const headers: Record<string, string> = {
      "Anthropic-Version": "2023-06-01",
      "Content-Type": "application/json",
      ...provider.headers,
    };

    if (provider.authHeader) {
      headers.Authorization = `Bearer ${provider.apiKey ?? ""}`;
    } else {
      headers["x-api-key"] = provider.apiKey ?? "";
    }

    const payload = (await postJson({
      url: `${normalizeAnthropicBaseUrl(provider.baseUrl)}/v1/messages`,
      headers,
      body: {
        model: provider.model,
        system: request.systemPrompt,
        messages: [
          {
            role: "user",
            content: [{ type: "text", text: request.userPrompt }],
          },
        ],
        temperature: request.temperature ?? 0.3,
        max_tokens: provider.maxTokens,
      },
      signal: request.signal,
    })) as AnthropicResponse;

    const text = extractAnthropicText(payload);
    return { text: requireText(text, provider.provider), raw: payload };
  },
};

function extractAnthropicText(payload: AnthropicResponse): string {
  if (!Array.isArray(payload.content)) {
    return "";
  }
  return payload.content
    .map((item) => (item.type === "text" ? flattenText(item.text) : ""))
    .filter(Boolean)
    .join("\n");
}
