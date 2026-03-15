import { ProviderApi } from "../providers/types";

export type ContentParserFocus = "full" | "syntax" | "slang" | "culture" | "conversion";
export type ContentParserSourceType = "pdf" | "markdown" | "text";

export interface ContentParserQuery {
  pdfPath?: string;
  filePath?: string;
  text?: string;
  title?: string;
  focus?: ContentParserFocus;
  dryRun?: boolean;
  jsonOutput?: boolean;
  extractOnly?: boolean;
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

export type ContentParserSourcePayload = {
  title: string;
  sourceType: ContentParserSourceType;
  sourceName: string;
  text: string;
  charCount: number;
  truncated: boolean;
  pageCount?: number;
  extractionEngine: string;
  warnings: string[];
};
