import { getLocalProviderConfig, resolveProviderApiKey } from "../auth/manager";
import {
  getProviderCatalogEntry,
  listProviderCatalog,
  normalizeProviderId,
  resolveProviderApi,
} from "./catalog";
import { anthropicMessagesProtocol } from "./protocols/anthropic-messages";
import { googleGenerativeAiProtocol } from "./protocols/google-generative-ai";
import { ollamaProtocol } from "./protocols/ollama";
import { openAiCompletionsProtocol } from "./protocols/openai-completions";
import { openAiResponsesProtocol } from "./protocols/openai-responses";
import {
  GenerationRequest,
  GenerationResponse,
  ProviderApi,
  ProviderProtocol,
  ProviderResolutionOptions,
  ResolvedProvider,
} from "./types";

const protocolMap: Record<ProviderApi, ProviderProtocol> = {
  "openai-completions": openAiCompletionsProtocol,
  "openai-responses": openAiResponsesProtocol,
  "anthropic-messages": anthropicMessagesProtocol,
  "google-generative-ai": googleGenerativeAiProtocol,
  ollama: ollamaProtocol,
};

export function resolveProviderConfig(
  options: ProviderResolutionOptions,
  config?: { requireApiKey?: boolean },
): ResolvedProvider {
  const providerId = normalizeProviderId(options.provider);
  const entry = getProviderCatalogEntry(providerId);

  if (!entry) {
    const supported = listProviderCatalog()
      .map((item) => item.id)
      .join(", ");
    throw new Error(`Unsupported provider "${options.provider}". Supported: ${supported}`);
  }

  const localConfig = getLocalProviderConfig(entry.id);
  const model = options.model?.trim() || localConfig?.model?.trim() || entry.defaultModel;
  const api = options.protocol ?? resolveProviderApi(entry, model);

  const resolvedBaseUrl =
    options.baseUrl?.trim() ||
    localConfig?.baseUrl?.trim() ||
    entry.resolveBaseUrl?.({
      baseUrl: options.baseUrl,
      accountId: options.accountId,
      gatewayId: options.gatewayId,
    }) ||
    entry.defaultBaseUrl ||
    "";

  if (!resolvedBaseUrl) {
    throw new Error(
      entry.notes ??
        `Provider "${entry.id}" requires --base-url or additional provider-specific config.`,
    );
  }

  const requireApiKey = config?.requireApiKey ?? true;
  const apiKeyResolution = resolveProviderApiKey({
    provider: entry.id,
    envVars: entry.envVars,
    explicitApiKey: options.apiKey,
    configApiKey: localConfig?.apiKey,
    legacyFallback: entry.id === "openai" ? getLocalProviderConfig("legacy-openai")?.apiKey : undefined,
    requireApiKey,
  });

  return {
    entry,
    provider: entry.id,
    api,
    apiKey: apiKeyResolution.apiKey,
    apiKeySource: apiKeyResolution.source,
    model,
    baseUrl: resolvedBaseUrl,
    maxTokens: options.maxTokens ?? entry.defaultMaxTokens ?? defaultMaxTokensForApi(api),
    authHeader: entry.authHeader ?? false,
    headers: { ...(options.headers ?? {}) },
  };
}

export async function generateTextWithProvider(params: {
  provider: ProviderResolutionOptions;
  request: GenerationRequest;
}): Promise<GenerationResponse> {
  const resolved = resolveProviderConfig(params.provider, { requireApiKey: true });
  const protocol = protocolMap[resolved.api];
  return protocol.generate({ provider: resolved, request: params.request });
}

export function formatProviderCatalog(): string {
  const lines = ["Supported providers:"];

  for (const entry of listProviderCatalog()) {
    const baseUrl = entry.defaultBaseUrl ?? "(resolve at runtime)";
    const envVars = entry.envVars.join(", ");
    const apiLabel = entry.api === "dynamic" ? "dynamic" : entry.api;
    lines.push(
      `- ${entry.id}: ${entry.label} | api=${apiLabel} | model=${entry.defaultModel} | env=${envVars} | base=${baseUrl}`,
    );
  }

  return lines.join("\n");
}

export function formatResolvedProviderPreview(resolved: ResolvedProvider): string {
  return [
    `provider: ${resolved.provider}`,
    `protocol: ${resolved.api}`,
    `model: ${resolved.model}`,
    `baseUrl: ${resolved.baseUrl}`,
    `apiKey: ${resolved.apiKeySource ?? "not set"}`,
  ].join("\n");
}

function defaultMaxTokensForApi(api: ProviderApi): number {
  if (api === "anthropic-messages") {
    return 4096;
  }
  if (api === "ollama") {
    return 8192;
  }
  return 4096;
}
