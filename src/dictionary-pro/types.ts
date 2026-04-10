import type { TargetRegister } from "../platform/contracts";
import { ProviderApi } from "../platform/providers/types";

export type DictionaryProMode = "meaning" | "conversion" | "upgrade" | "comparison";

export type DictionaryProTarget = TargetRegister;

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
