export type DictionaryProMode = "meaning" | "conversion" | "upgrade" | "comparison";

export type DictionaryProTarget =
  | "toefl-writing"
  | "toefl-speaking"
  | "general-academic"
  | "daily-english";

export interface DictionaryProQuery {
  text: string;
  context?: string;
  mode?: DictionaryProMode;
  target?: DictionaryProTarget;
  dryRun?: boolean;
}

