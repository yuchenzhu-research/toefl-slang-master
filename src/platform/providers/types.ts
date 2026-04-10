export const PROVIDER_APIS = [
  "openai-completions",
  "openai-responses",
  "anthropic-messages",
  "google-generative-ai",
  "ollama",
] as const;

export type ProviderApi = (typeof PROVIDER_APIS)[number];

export type ProviderCatalogEntry = {
  id: string;
  label: string;
  api: ProviderApi | "dynamic";
  defaultBaseUrl?: string;
  defaultModel: string;
  envVars: string[];
  aliases?: string[];
  authHeader?: boolean;
  defaultMaxTokens?: number;
  resolveApi?: (model: string) => ProviderApi;
  resolveBaseUrl?: (params: {
    baseUrl?: string;
    accountId?: string;
    gatewayId?: string;
  }) => string | undefined;
  notes?: string;
};

export type ProviderResolutionOptions = {
  provider: string;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  protocol?: ProviderApi;
  maxTokens?: number;
  accountId?: string;
  gatewayId?: string;
  headers?: Record<string, string>;
};

export type ResolvedProvider = {
  entry: ProviderCatalogEntry;
  provider: string;
  api: ProviderApi;
  apiKey?: string;
  apiKeySource?: string;
  model: string;
  baseUrl: string;
  maxTokens: number;
  authHeader: boolean;
  headers: Record<string, string>;
};

export type GenerationRequest = {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  signal?: AbortSignal;
};

export type GenerationResponse = {
  text: string;
  raw: unknown;
};

export type ProviderProtocol = {
  generate(params: {
    provider: ResolvedProvider;
    request: GenerationRequest;
  }): Promise<GenerationResponse>;
};
