// Shared API client for SPARK desktop frontend
// Provides typed functions for local SPARK backend APIs

export type DictionaryProMode = "meaning" | "conversion" | "upgrade" | "comparison";
export type DictionaryProTarget = "toefl-writing" | "toefl-speaking" | "general-academic" | "daily-english";

/**
 * API client configuration
 */
export interface ApiClientConfig {
  baseUrl: string;
}

/**
 * Default configuration - uses local SPARK backend
 */
const defaultConfig: ApiClientConfig = {
  baseUrl: "http://localhost:4173",
};

/**
 * Current client configuration
 */
let currentConfig: ApiClientConfig = { ...defaultConfig };

/**
 * Set the API client configuration
 */
export function configureApiClient(config: Partial<ApiClientConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

/**
 * Get current API client configuration
 */
export function getApiClientConfig(): ApiClientConfig {
  return { ...currentConfig };
}

/**
 * Structured API response wrapper
 */
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

/**
 * Health check response from backend
 */
export interface HealthResponse {
  ok: boolean;
  service: string;
  endpoints: string[];
}

/**
 * Dictionary lookup request payload
 */
export interface DictLookupRequest {
  text: string;
  context?: string;
  mode?: DictionaryProMode;
  target?: DictionaryProTarget;
  dryRun?: boolean;
  provider?: string;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

/**
 * Dictionary lookup response
 */
export interface DictLookupResponse {
  dryRun?: boolean;
  query?: {
    text: string;
    context?: string;
    mode?: string;
    target?: string;
    dryRun?: boolean;
  };
  markdown?: string;
  error?: string;
  [key: string]: unknown;
}

/**
 * Internal: Execute an API request
 */
async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  timeout: number = 15000
): Promise<ApiResponse<T>> {
  const url = `${currentConfig.baseUrl}${path}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        ok: false,
        error: `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      ok: true,
      data: data as T,
    };
  } catch (e) {
    if (e instanceof Error) {
      if (e.name === "AbortError") {
        return {
          ok: false,
          error: "Request timed out",
        };
      }
      return {
        ok: false,
        error: e.message,
      };
    }
    return {
      ok: false,
      error: "Unknown error occurred",
    };
  }
}

/**
 * Check backend health status
 */
export async function checkHealth(): Promise<ApiResponse<HealthResponse>> {
  return request<HealthResponse>("GET", "/api/health");
}

/**
 * Perform a dictionary lookup
 */
export async function lookupDictionary(
  payload: DictLookupRequest
): Promise<ApiResponse<DictLookupResponse>> {
  if (!payload.text.trim()) {
    return {
      ok: false,
      error: "Text is required",
    };
  }

  return request<DictLookupResponse>("POST", "/api/dict/lookup", payload);
}