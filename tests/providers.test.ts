import test from "node:test";
import assert from "node:assert";
import { getProviderCatalogEntry } from "../src/platform/providers/catalog";
import { formatProviderCatalog, resolveProviderConfig } from "../src/platform/providers/runtime";

test("siliconflow-hosted minimax resolves to the siliconflow gateway shape", () => {
  const resolved = resolveProviderConfig({
    provider: "siliconflow-minimax",
    apiKey: "test-key",
  });

  assert.strictEqual(resolved.provider, "siliconflow-minimax");
  assert.strictEqual(resolved.api, "openai-completions");
  assert.strictEqual(resolved.baseUrl, "https://api.siliconflow.cn/v1");
  assert.strictEqual(resolved.model, "Pro/MiniMaxAI/MiniMax-M2.5");
  assert.strictEqual(resolved.apiKeySource, "cli");
});

test("official minimax provider keeps the direct anthropic-compatible endpoint", () => {
  const resolved = resolveProviderConfig({
    provider: "minimax",
    apiKey: "test-key",
  });

  assert.strictEqual(resolved.provider, "minimax");
  assert.strictEqual(resolved.api, "anthropic-messages");
  assert.strictEqual(resolved.baseUrl, "https://api.minimax.io/anthropic");
  assert.strictEqual(resolved.model, "MiniMax-M2.5");
});

test("provider catalog exposes the siliconflow minimax preset and aliases", () => {
  const entry = getProviderCatalogEntry("minimax-siliconflow");

  assert.ok(entry);
  assert.strictEqual(entry?.id, "siliconflow-minimax");
  assert.deepStrictEqual(entry?.envVars, ["SILICONFLOW_API_KEY", "MINIMAX_API_KEY"]);

  const catalog = formatProviderCatalog();
  assert.ok(catalog.includes("siliconflow-minimax: SiliconFlow MiniMax"));
  assert.ok(catalog.includes("siliconflow: SiliconFlow"));
});
