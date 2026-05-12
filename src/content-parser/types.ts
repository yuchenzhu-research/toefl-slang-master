import { ProviderApi } from "../platform/providers/types";

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

// ── Merged from schema.ts ──


export type ContentParserStructuredResponse = {
  kind: "content_note";
  title: string;
  sourceType: ContentParserSourceType;
  focus: ContentParserFocus;
  sourceName?: string;
  extraction: {
    charCount: number;
    truncated: boolean;
    pageCount?: number;
  };
  overview: string[];
  breakdown: string[];
  slang: string[];
  culture: string[];
  conversion: string[];
  expressionCandidates: Array<{
    expression: string;
    sourceSentence: string;
    whyWorthLearning: string;
    registerHint: string;
    category: string;
    transferPotential: string;
    difficulty: string;
    downstreamTarget: string;
  }>;
  notes?: string[];
};

export function resolveActiveFocus(focus?: ContentParserFocus): ContentParserFocus {
  return focus ?? "full";
}
