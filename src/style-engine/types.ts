export type StyleProfileId = "economist";

export type StyleMetric = {
  id: string;
  label: string;
  value: number;
  target: string;
  score: number;
  note: string;
};

export type StyleSignal = {
  label: string;
  count: number;
  examples: string[];
};

export type StyleSuggestion = {
  priority: "high" | "medium" | "low";
  issue: string;
  action: string;
};

export type StyleAnalysisResult = {
  profile: StyleProfileId;
  title: string;
  summary: string;
  overallScore: number;
  metrics: StyleMetric[];
  signals: StyleSignal[];
  suggestions: StyleSuggestion[];
};
