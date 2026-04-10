import { ProviderApi } from "../platform/providers/types";

export type DictionaryProMode = "meaning" | "conversion" | "upgrade" | "comparison";

export type DictionaryProTarget =
  | "toefl-writing"
  | "toefl-speaking"
  | "general-academic"
  | "daily-english"
  | "ielts-academic";

export interface DictionaryProQuery {
  text?: string;
  context?: string;
  mode?: DictionaryProMode;
  target?: DictionaryProTarget;
  dryRun?: boolean;
  jsonOutput?: boolean;
  listProviders?: boolean;
  provider?: string;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  protocol?: ProviderApi;
  maxTokens?: number;
  cloudflareAccountId?: string;
  cloudflareGatewayId?: string;
}
