function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/+$/, "");
}

export function normalizeAnthropicBaseUrl(baseUrl: string): string {
  return normalizeBaseUrl(baseUrl).replace(/\/v1$/i, "");
}

export function normalizeOllamaBaseUrl(baseUrl: string): string {
  return normalizeBaseUrl(baseUrl).replace(/\/v1$/i, "");
}

export async function postJson(params: {
  url: string;
  headers: Record<string, string>;
  body: unknown;
  signal?: AbortSignal;
}): Promise<unknown> {
  const response = await fetch(params.url, {
    method: "POST",
    headers: params.headers,
    body: JSON.stringify(params.body),
    signal: params.signal,
  });

  const text = await response.text();
  const payload = tryParseJson(text);

  if (!response.ok) {
    const errorMessage = extractErrorMessage(payload) || text || `HTTP ${response.status}`;
    throw new Error(`${response.status} ${response.statusText}: ${errorMessage}`);
  }

  return payload ?? text;
}

function tryParseJson(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) {
    return {};
  }
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

export function extractErrorMessage(payload: unknown): string {
  if (typeof payload === "string") {
    return payload.trim();
  }

  if (!isRecord(payload)) {
    return "";
  }

  const error = payload.error;
  if (typeof error === "string") {
    return error.trim();
  }
  if (isRecord(error) && typeof error.message === "string") {
    return error.message.trim();
  }
  if (typeof payload.message === "string") {
    return payload.message.trim();
  }
  return "";
}

export function flattenText(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => flattenText(item)).filter(Boolean).join("\n");
  }

  if (!isRecord(value)) {
    return "";
  }

  if (typeof value.text === "string") {
    return value.text;
  }

  if (typeof value.content === "string") {
    return value.content;
  }

  if (Array.isArray(value.content)) {
    return flattenText(value.content);
  }

  if (Array.isArray(value.parts)) {
    return flattenText(value.parts);
  }

  return "";
}

export function requireText(text: string, provider: string): string {
  const normalized = text.trim();
  if (!normalized) {
    throw new Error(`Provider "${provider}" returned an empty text payload.`);
  }
  return normalized;
}
