import { ContentParserFocus, ContentParserSourceType } from "./types";

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
  notes?: string[];
};

export function resolveActiveFocus(focus?: ContentParserFocus): ContentParserFocus {
  return focus ?? "full";
}
