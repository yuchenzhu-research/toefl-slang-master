/**
 * Provider config 管理模块
 * 优先级：显式参数 > 环境变量 > 本地配置文件
 */

import * as fs from "fs";
import * as path from "path";
import { normalizeProviderId } from "../providers/catalog";

export const CONFIG_PATH = path.join(process.env.HOME || "~", ".toefl-slang", "config.json");

export interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export interface Config {
  apiKey?: string;
  providers?: Record<string, ProviderConfig>;
}

type ApiKeyResolutionOptions = {
  provider: string;
  envVars: string[];
  explicitApiKey?: string;
  configApiKey?: string;
  legacyFallback?: string;
  requireApiKey?: boolean;
};

type ApiKeyResolution = {
  apiKey?: string;
  source?: string;
};

export function readConfig(): Config {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      return {};
    }
    const content = fs.readFileSync(CONFIG_PATH, "utf-8");
    return JSON.parse(content) as Config;
  } catch {
    return {};
  }
}

export function getLocalProviderConfig(provider: string): ProviderConfig | undefined {
  const normalized = normalizeProviderId(provider);
  const config = readConfig();
  const providers = config.providers ?? {};

  if (normalized === "legacy-openai" && config.apiKey?.trim()) {
    return { apiKey: config.apiKey.trim() };
  }

  const direct = providers[normalized];
  if (direct) {
    return sanitizeProviderConfig(direct);
  }

  const matchedEntry = Object.entries(providers).find(
    ([key]) => normalizeProviderId(key) === normalized,
  );
  return matchedEntry ? sanitizeProviderConfig(matchedEntry[1]) : undefined;
}

export function resolveProviderApiKey(options: ApiKeyResolutionOptions): ApiKeyResolution {
  const explicit = options.explicitApiKey?.trim();
  if (explicit) {
    return { apiKey: explicit, source: "cli" };
  }

  for (const envVar of options.envVars) {
    const value = process.env[envVar]?.trim();
    if (value) {
      return { apiKey: value, source: `env:${envVar}` };
    }
  }

  const configApiKey = options.configApiKey?.trim();
  if (configApiKey) {
    return { apiKey: configApiKey, source: "config" };
  }

  const legacyFallback = options.legacyFallback?.trim();
  if (legacyFallback) {
    return { apiKey: legacyFallback, source: "config:legacy" };
  }

  if (options.requireApiKey === false) {
    return { source: `missing:${options.provider}` };
  }

  const envHint = options.envVars.length > 0 ? options.envVars.join(" / ") : "API key";
  throw new Error(
    `Missing API key for provider "${options.provider}". Set ${envHint}, pass --api-key, or configure ${CONFIG_PATH}.`,
  );
}

export function getApiKey(): string {
  const openAiConfig = getLocalProviderConfig("openai");
  const legacyConfig = getLocalProviderConfig("legacy-openai");
  return (
    resolveProviderApiKey({
      provider: "openai",
      envVars: ["OPENAI_API_KEY"],
      configApiKey: openAiConfig?.apiKey,
      legacyFallback: legacyConfig?.apiKey,
      requireApiKey: true,
    }).apiKey ?? ""
  );
}

export function setApiKey(apiKey: string): void {
  const configDir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const existing = readConfig();
  const config: Config = {
    ...existing,
    apiKey: apiKey.trim(),
    providers: {
      ...(existing.providers ?? {}),
      openai: {
        ...(existing.providers?.openai ?? {}),
        apiKey: apiKey.trim(),
      },
    },
  };

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  console.log(`API key saved to ${CONFIG_PATH}`);
}

function sanitizeProviderConfig(config: ProviderConfig): ProviderConfig {
  return {
    apiKey: config.apiKey?.trim() || undefined,
    baseUrl: config.baseUrl?.trim() || undefined,
    model: config.model?.trim() || undefined,
  };
}
