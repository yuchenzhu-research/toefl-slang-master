import { flattenText, normalizeBaseUrl, postJson, requireText } from "../http";
import { ProviderProtocol } from "../types";

type GoogleResponse = {
  candidates?: Array<{
    content?: {
      parts?: unknown[];
    };
  }>;
};

export const googleGenerativeAiProtocol: ProviderProtocol = {
  async generate({ provider, request }) {
    const payload = (await postJson({
      url: `${normalizeBaseUrl(provider.baseUrl)}/models/${provider.model}:generateContent`,
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": provider.apiKey ?? "",
        ...provider.headers,
      },
      body: {
        systemInstruction: {
          parts: [{ text: request.systemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: request.userPrompt }],
          },
        ],
        generationConfig: {
          temperature: request.temperature ?? 0.3,
          maxOutputTokens: provider.maxTokens,
        },
      },
      signal: request.signal,
    })) as GoogleResponse;

    const text = extractGoogleText(payload);
    return { text: requireText(text, provider.provider), raw: payload };
  },
};

function extractGoogleText(payload: GoogleResponse): string {
  const candidate = Array.isArray(payload.candidates) ? payload.candidates[0] : undefined;
  return flattenText(candidate?.content?.parts ?? []);
}
