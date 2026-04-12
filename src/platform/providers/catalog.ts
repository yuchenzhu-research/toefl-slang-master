import { ProviderApi, ProviderCatalogEntry } from "./types";

const ZAI_CODING_GLOBAL_BASE_URL = "https://api.z.ai/api/coding/paas/v4";
const ZAI_CODING_CN_BASE_URL = "https://open.bigmodel.cn/api/coding/paas/v4";
const ZAI_GLOBAL_BASE_URL = "https://api.z.ai/api/paas/v4";
const ZAI_CN_BASE_URL = "https://open.bigmodel.cn/api/paas/v4";

const providerCatalog: ProviderCatalogEntry[] = [
  {
    id: "openai",
    label: "OpenAI",
    api: "openai-responses",
    defaultBaseUrl: "https://api.openai.com/v1",
    defaultModel: "gpt-4o",
    envVars: ["OPENAI_API_KEY"],
    defaultMaxTokens: 4096,
  },
  {
    id: "anthropic",
    label: "Anthropic",
    api: "anthropic-messages",
    defaultBaseUrl: "https://api.anthropic.com",
    defaultModel: "claude-sonnet-4-5",
    envVars: ["ANTHROPIC_API_KEY"],
    defaultMaxTokens: 4096,
  },
  {
    id: "google",
    label: "Google Gemini",
    api: "google-generative-ai",
    defaultBaseUrl: "https://generativelanguage.googleapis.com/v1beta",
    defaultModel: "gemini-3-pro",
    envVars: ["GEMINI_API_KEY"],
    defaultMaxTokens: 4096,
  },
  {
    id: "minimax",
    label: "MiniMax (official direct)",
    api: "anthropic-messages",
    defaultBaseUrl: "https://api.minimax.io/anthropic",
    defaultModel: "MiniMax-M2.5",
    envVars: ["MINIMAX_API_KEY"],
    authHeader: true,
    defaultMaxTokens: 8192,
  },
  {
    id: "minimax-cn",
    label: "MiniMax China (official direct)",
    api: "anthropic-messages",
    defaultBaseUrl: "https://api.minimaxi.com/anthropic",
    defaultModel: "MiniMax-M2.5",
    envVars: ["MINIMAX_API_KEY"],
    authHeader: true,
    defaultMaxTokens: 8192,
  },
  {
    id: "siliconflow",
    label: "SiliconFlow",
    api: "openai-completions",
    defaultBaseUrl: "https://api.siliconflow.cn/v1",
    defaultModel: "Pro/zai-org/GLM-5.1",
    envVars: ["SILICONFLOW_API_KEY"],
    aliases: ["silicon", "siliconcloud", "sf"],
    defaultMaxTokens: 8192,
    notes: "Gateway provider. Pass --model to select hosted models such as Pro/MiniMaxAI/MiniMax-M2.5.",
  },
  {
    id: "siliconflow-minimax",
    label: "SiliconFlow MiniMax",
    api: "openai-completions",
    defaultBaseUrl: "https://api.siliconflow.cn/v1",
    defaultModel: "Pro/MiniMaxAI/MiniMax-M2.5",
    envVars: ["SILICONFLOW_API_KEY", "MINIMAX_API_KEY"],
    aliases: ["sf-minimax", "silicon-minimax", "siliconcloud-minimax", "minimax-siliconflow"],
    defaultMaxTokens: 8192,
    notes:
      "Uses SiliconFlow's OpenAI-compatible gateway for hosted MiniMax. Prefer SILICONFLOW_API_KEY; MINIMAX_API_KEY is accepted for compatibility.",
  },
  {
    id: "moonshot",
    label: "Moonshot",
    api: "openai-completions",
    defaultBaseUrl: "https://api.moonshot.ai/v1",
    defaultModel: "kimi-k2.5",
    envVars: ["MOONSHOT_API_KEY"],
    defaultMaxTokens: 8192,
  },
  {
    id: "moonshot-cn",
    label: "Moonshot China",
    api: "openai-completions",
    defaultBaseUrl: "https://api.moonshot.cn/v1",
    defaultModel: "kimi-k2.5",
    envVars: ["MOONSHOT_API_KEY"],
    defaultMaxTokens: 8192,
  },
  {
    id: "kimi-coding",
    label: "Kimi Coding",
    api: "anthropic-messages",
    defaultBaseUrl: "https://api.kimi.com/coding/",
    defaultModel: "k2p5",
    envVars: ["KIMI_API_KEY", "KIMICODE_API_KEY"],
    aliases: ["kimi-code"],
    defaultMaxTokens: 32768,
  },
  {
    id: "qwen-portal",
    label: "Qwen Portal",
    api: "openai-completions",
    defaultBaseUrl: "https://portal.qwen.ai/v1",
    defaultModel: "coder-model",
    envVars: ["QWEN_PORTAL_API_KEY"],
    aliases: ["qwen"],
    defaultMaxTokens: 8192,
  },
  {
    id: "zai",
    label: "Z.AI",
    api: "openai-completions",
    defaultBaseUrl: ZAI_GLOBAL_BASE_URL,
    defaultModel: "glm-5",
    envVars: ["ZAI_API_KEY", "Z_AI_API_KEY"],
    aliases: ["z.ai", "z-ai", "zai-global"],
    defaultMaxTokens: 131072,
  },
  {
    id: "zai-cn",
    label: "Z.AI China",
    api: "openai-completions",
    defaultBaseUrl: ZAI_CN_BASE_URL,
    defaultModel: "glm-5",
    envVars: ["ZAI_API_KEY", "Z_AI_API_KEY"],
    defaultMaxTokens: 131072,
  },
  {
    id: "zai-coding-global",
    label: "Z.AI Coding Global",
    api: "openai-completions",
    defaultBaseUrl: ZAI_CODING_GLOBAL_BASE_URL,
    defaultModel: "glm-5",
    envVars: ["ZAI_API_KEY", "Z_AI_API_KEY"],
    defaultMaxTokens: 131072,
  },
  {
    id: "zai-coding-cn",
    label: "Z.AI Coding China",
    api: "openai-completions",
    defaultBaseUrl: ZAI_CODING_CN_BASE_URL,
    defaultModel: "glm-5",
    envVars: ["ZAI_API_KEY", "Z_AI_API_KEY"],
    defaultMaxTokens: 131072,
  },
  {
    id: "xiaomi",
    label: "Xiaomi MiMo",
    api: "anthropic-messages",
    defaultBaseUrl: "https://api.xiaomimimo.com/anthropic",
    defaultModel: "mimo-v2-flash",
    envVars: ["XIAOMI_API_KEY"],
    defaultMaxTokens: 8192,
  },
  {
    id: "synthetic",
    label: "Synthetic",
    api: "anthropic-messages",
    defaultBaseUrl: "https://api.synthetic.new/anthropic",
    defaultModel: "hf:MiniMaxAI/MiniMax-M2.1",
    envVars: ["SYNTHETIC_API_KEY"],
    defaultMaxTokens: 8192,
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    api: "openai-completions",
    defaultBaseUrl: "https://openrouter.ai/api/v1",
    defaultModel: "auto",
    envVars: ["OPENROUTER_API_KEY"],
    defaultMaxTokens: 8192,
  },
  {
    id: "volcengine",
    label: "Volcano Engine",
    api: "openai-completions",
    defaultBaseUrl: "https://ark.cn-beijing.volces.com/api/v3",
    defaultModel: "doubao-seed-1-8-251228",
    envVars: ["VOLCANO_ENGINE_API_KEY"],
    aliases: ["bytedance", "doubao"],
    defaultMaxTokens: 4096,
  },
  {
    id: "volcengine-plan",
    label: "Volcano Engine Coding",
    api: "openai-completions",
    defaultBaseUrl: "https://ark.cn-beijing.volces.com/api/coding/v3",
    defaultModel: "ark-code-latest",
    envVars: ["VOLCANO_ENGINE_API_KEY"],
    defaultMaxTokens: 4096,
  },
  {
    id: "byteplus",
    label: "BytePlus",
    api: "openai-completions",
    defaultBaseUrl: "https://ark.ap-southeast.bytepluses.com/api/v3",
    defaultModel: "seed-1-8-251228",
    envVars: ["BYTEPLUS_API_KEY"],
    defaultMaxTokens: 4096,
  },
  {
    id: "byteplus-plan",
    label: "BytePlus Coding",
    api: "openai-completions",
    defaultBaseUrl: "https://ark.ap-southeast.bytepluses.com/api/coding/v3",
    defaultModel: "ark-code-latest",
    envVars: ["BYTEPLUS_API_KEY"],
    defaultMaxTokens: 4096,
  },
  {
    id: "venice",
    label: "Venice",
    api: "openai-completions",
    defaultBaseUrl: "https://api.venice.ai/api/v1",
    defaultModel: "llama-3.3-70b",
    envVars: ["VENICE_API_KEY"],
    defaultMaxTokens: 8192,
  },
  {
    id: "together",
    label: "Together AI",
    api: "openai-completions",
    defaultBaseUrl: "https://api.together.xyz/v1",
    defaultModel: "moonshotai/Kimi-K2.5",
    envVars: ["TOGETHER_API_KEY"],
    defaultMaxTokens: 8192,
  },
  {
    id: "huggingface",
    label: "Hugging Face Router",
    api: "openai-completions",
    defaultBaseUrl: "https://router.huggingface.co/v1",
    defaultModel: "deepseek-ai/DeepSeek-R1",
    envVars: ["HUGGINGFACE_HUB_TOKEN", "HF_TOKEN"],
    defaultMaxTokens: 8192,
  },
  {
    id: "qianfan",
    label: "Qianfan",
    api: "openai-completions",
    defaultBaseUrl: "https://qianfan.baidubce.com/v2",
    defaultModel: "deepseek-v3.2",
    envVars: ["QIANFAN_API_KEY"],
    defaultMaxTokens: 32768,
  },
  {
    id: "nvidia",
    label: "NVIDIA",
    api: "openai-completions",
    defaultBaseUrl: "https://integrate.api.nvidia.com/v1",
    defaultModel: "nvidia/llama-3.1-nemotron-70b-instruct",
    envVars: ["NVIDIA_API_KEY"],
    defaultMaxTokens: 4096,
  },
  {
    id: "kilocode",
    label: "Kilo Gateway",
    api: "openai-completions",
    defaultBaseUrl: "https://api.kilo.ai/api/gateway/",
    defaultModel: "anthropic/claude-opus-4.6",
    envVars: ["KILOCODE_API_KEY"],
    defaultMaxTokens: 128000,
  },
  {
    id: "opencode",
    label: "OpenCode Zen",
    api: "dynamic",
    defaultBaseUrl: "https://opencode.ai/zen/v1",
    defaultModel: "claude-opus-4-6",
    envVars: ["OPENCODE_API_KEY", "OPENCODE_ZEN_API_KEY"],
    aliases: ["opencode-zen"],
    defaultMaxTokens: 128000,
    resolveApi(model: string): ProviderApi {
      const lower = model.trim().toLowerCase();
      if (lower.startsWith("gpt-")) {
        return "openai-responses";
      }
      if (lower.startsWith("claude-") || lower.startsWith("minimax-")) {
        return "anthropic-messages";
      }
      if (lower.startsWith("gemini-")) {
        return "google-generative-ai";
      }
      return "openai-completions";
    },
  },
  {
    id: "groq",
    label: "Groq",
    api: "openai-completions",
    defaultBaseUrl: "https://api.groq.com/openai/v1",
    defaultModel: "llama3-70b-8192",
    envVars: ["GROQ_API_KEY"],
    defaultMaxTokens: 8192,
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    api: "openai-completions",
    defaultBaseUrl: "https://api.deepseek.com/v1",
    defaultModel: "deepseek-chat",
    envVars: ["DEEPSEEK_API_KEY"],
    defaultMaxTokens: 8192,
  },
  {
    id: "perplexity",
    label: "Perplexity",
    api: "openai-completions",
    defaultBaseUrl: "https://api.perplexity.ai",
    defaultModel: "sonar",
    envVars: ["PERPLEXITY_API_KEY"],
    defaultMaxTokens: 4096,
  },
  {
    id: "cerebras",
    label: "Cerebras",
    api: "openai-completions",
    defaultBaseUrl: "https://api.cerebras.ai/v1",
    defaultModel: "llama3.1-70b",
    envVars: ["CEREBRAS_API_KEY"],
    defaultMaxTokens: 8192,
  },
  {
    id: "fireworks",
    label: "Fireworks AI",
    api: "openai-completions",
    defaultBaseUrl: "https://api.fireworks.ai/inference/v1",
    defaultModel: "accounts/fireworks/models/llama-v3p1-70b-instruct",
    envVars: ["FIREWORKS_API_KEY"],
    defaultMaxTokens: 8192,
  },
  {
    id: "novita",
    label: "Novita AI",
    api: "openai-completions",
    defaultBaseUrl: "https://api.novita.ai/v3/openai",
    defaultModel: "meta-llama/llama-3.1-70b-instruct",
    envVars: ["NOVITA_API_KEY"],
    defaultMaxTokens: 8192,
  },
  {
    id: "xai",
    label: "xAI",
    api: "openai-completions",
    defaultBaseUrl: "https://api.x.ai/v1",
    defaultModel: "grok-4",
    envVars: ["XAI_API_KEY"],
    defaultMaxTokens: 8192,
  },
  {
    id: "mistral",
    label: "Mistral",
    api: "openai-completions",
    defaultBaseUrl: "https://api.mistral.ai/v1",
    defaultModel: "mistral-large-latest",
    envVars: ["MISTRAL_API_KEY"],
    defaultMaxTokens: 8192,
  },
  {
    id: "litellm",
    label: "LiteLLM",
    api: "openai-completions",
    defaultBaseUrl: "http://localhost:4000",
    defaultModel: "claude-opus-4-6",
    envVars: ["LITELLM_API_KEY"],
    defaultMaxTokens: 8192,
  },
  {
    id: "vllm",
    label: "vLLM",
    api: "openai-completions",
    defaultBaseUrl: "http://127.0.0.1:8000/v1",
    defaultModel: "local-model",
    envVars: ["VLLM_API_KEY"],
    defaultMaxTokens: 8192,
  },
  {
    id: "ollama",
    label: "Ollama",
    api: "ollama",
    defaultBaseUrl: "http://127.0.0.1:11434",
    defaultModel: "qwen3:32b",
    envVars: ["OLLAMA_API_KEY"],
    defaultMaxTokens: 8192,
  },
  {
    id: "cloudflare-ai-gateway",
    label: "Cloudflare AI Gateway",
    api: "anthropic-messages",
    defaultModel: "claude-sonnet-4-5",
    envVars: ["CLOUDFLARE_AI_GATEWAY_API_KEY"],
    defaultMaxTokens: 64000,
    resolveBaseUrl(params): string | undefined {
      if (params.baseUrl?.trim()) {
        return params.baseUrl.trim();
      }
      const accountId = params.accountId?.trim();
      const gatewayId = params.gatewayId?.trim();
      if (!accountId || !gatewayId) {
        return undefined;
      }
      return `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/anthropic`;
    },
    notes: "Requires --cloudflare-account-id and --cloudflare-gateway-id, or --base-url.",
  },
  {
    id: "vercel-ai-gateway",
    label: "Vercel AI Gateway",
    api: "openai-completions",
    defaultBaseUrl: "https://ai-gateway.vercel.sh/v1",
    defaultModel: "anthropic/claude-opus-4.6",
    envVars: ["AI_GATEWAY_API_KEY"],
    aliases: ["ai-gateway"],
    defaultMaxTokens: 8192,
  },
];

const providerMap = new Map(providerCatalog.map((entry) => [entry.id, entry] as const));
const aliasMap = new Map<string, string>();

for (const entry of providerCatalog) {
  aliasMap.set(entry.id, entry.id);
  for (const alias of entry.aliases ?? []) {
    aliasMap.set(alias, entry.id);
  }
}

export function normalizeProviderId(provider: string): string {
  return aliasMap.get(provider.trim().toLowerCase()) ?? provider.trim().toLowerCase();
}

export function getProviderCatalogEntry(provider: string): ProviderCatalogEntry | undefined {
  return providerMap.get(normalizeProviderId(provider));
}

export function listProviderCatalog(): ProviderCatalogEntry[] {
  return [...providerCatalog];
}

export function resolveProviderApi(entry: ProviderCatalogEntry, model: string): ProviderApi {
  if (entry.api === "dynamic") {
    return entry.resolveApi?.(model) ?? "openai-completions";
  }
  return entry.api;
}
