import { ProviderApi } from "../providers/types";

export type ToeflWritingSourceType = "text" | "file";

export interface ToeflWritingQuery {
  text?: string;
  filePath?: string;
  title?: string;
  dryRun?: boolean;
  jsonOutput?: boolean;
  listProviders?: boolean;
  provider?: string;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  protocol?: ProviderApi;
  maxTokens?: number;
  maxChars?: number;
  cloudflareAccountId?: string;
  cloudflareGatewayId?: string;
}

export type ToeflWritingSourcePayload = {
  title: string;
  sourceType: ToeflWritingSourceType;
  sourceName: string;
  text: string;
  charCount: number;
  truncated: boolean;
  warnings: string[];
};
