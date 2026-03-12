import { normalizeOllamaBaseUrl, postJson, requireText } from "../http";
import { ProviderProtocol } from "../types";

type OllamaResponse = {
  message?: {
    content?: string;
  };
};

export const ollamaProtocol: ProviderProtocol = {
  async generate({ provider, request }) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...provider.headers,
    };

    if (provider.apiKey && provider.apiKey !== "ollama-local") {
      headers.Authorization = `Bearer ${provider.apiKey}`;
    }

    const payload = (await postJson({
      url: `${normalizeOllamaBaseUrl(provider.baseUrl)}/api/chat`,
      headers,
      body: {
        model: provider.model,
        stream: false,
        messages: [
          { role: "system", content: request.systemPrompt },
          { role: "user", content: request.userPrompt },
        ],
        options: {
          temperature: request.temperature ?? 0.3,
          num_predict: provider.maxTokens,
        },
      },
      signal: request.signal,
    })) as OllamaResponse;

    return {
      text: requireText(payload.message?.content ?? "", provider.provider),
      raw: payload,
    };
  },
};
