import { ECONOMIST_PROFILE, StyleProfile } from "./profiles";
import type { StyleAnalysisResult, StyleMetric, StyleSignal, StyleSuggestion } from "./types";

const WORD_PATTERN = /[A-Za-z]+(?:[-'][A-Za-z]+)?/g;
const SENTENCE_SPLIT_PATTERN = /(?<=[.!?])\s+/;

export function analyzeEconomistStyle(text: string): StyleAnalysisResult {
  return analyzeStyle(text, ECONOMIST_PROFILE);
}

export function analyzeStyle(text: string, profile: StyleProfile = ECONOMIST_PROFILE): StyleAnalysisResult {
  const normalizedText = normalizeText(text);
  const sentences = splitSentences(normalizedText);
  const words = extractWords(normalizedText);
  const averageSentenceLength = sentences.length > 0 ? words.length / sentences.length : 0;

  const contrast = countMarkers(normalizedText, profile.contrastMarkers);
  const causal = countMarkers(normalizedText, profile.causalMarkers);
  const hedges = countMarkers(normalizedText, profile.hedgeMarkers);
  const lexical = countMarkers(normalizedText, profile.lexicalMarkers);
  const semicolonCount = countLiteral(normalizedText, ";");
  const colonCount = countLiteral(normalizedText, ":");

  const metrics: StyleMetric[] = [
    sentenceLengthMetric(averageSentenceLength, profile),
    densityMetric("contrast", "Contrast turns", contrast.count, words.length, ">= 1 per 120 words"),
    densityMetric("causality", "Causal logic", causal.count, words.length, ">= 1 per 140 words"),
    densityMetric("hedging", "Analytical hedging", hedges.count, words.length, ">= 1 per 160 words"),
    densityMetric("lexical", "Policy/economics vocabulary", lexical.count, words.length, ">= 1 per 100 words"),
    punctuationMetric(semicolonCount + colonCount, sentences.length),
  ];

  const overallScore = Math.round(
    metrics.reduce((total, metric) => total + metric.score, 0) / Math.max(metrics.length, 1),
  );

  return {
    profile: profile.id,
    title: profile.title,
    summary: buildSummary(overallScore, sentences.length, words.length),
    overallScore,
    metrics,
    signals: [
      { label: "Contrast markers", ...contrast },
      { label: "Causal markers", ...causal },
      { label: "Hedging markers", ...hedges },
      { label: "Economics/policy markers", ...lexical },
    ],
    suggestions: buildSuggestions(metrics),
  };
}

function normalizeText(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();
}

function splitSentences(text: string): string[] {
  if (!text) return [];
  return text
    .split(SENTENCE_SPLIT_PATTERN)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function extractWords(text: string): string[] {
  return text.match(WORD_PATTERN) ?? [];
}

function countMarkers(text: string, markers: string[]): { count: number; examples: string[] } {
  const lowerText = text.toLowerCase();
  const examples: string[] = [];
  let count = 0;

  for (const marker of markers) {
    const escaped = escapeRegExp(marker.toLowerCase()).replace(/\\ /g, "\\s+");
    const pattern = new RegExp(`\\b${escaped}\\b`, "g");
    const matches = lowerText.match(pattern) ?? [];
    if (matches.length > 0) {
      count += matches.length;
      examples.push(marker);
    }
  }

  return { count, examples: examples.slice(0, 6) };
}

function countLiteral(text: string, literal: string): number {
  return text.split(literal).length - 1;
}

function sentenceLengthMetric(value: number, profile: StyleProfile): StyleMetric {
  const { min, max } = profile.preferredSentenceLength;
  let score = 100;
  if (value < min) {
    score = Math.max(0, Math.round((value / min) * 100));
  } else if (value > max) {
    score = Math.max(0, Math.round((max / value) * 100));
  }

  return {
    id: "sentence-length",
    label: "Sentence rhythm",
    value: roundOne(value),
    target: `${min}-${max} words/sentence`,
    score,
    note:
      value < min
        ? "Sentences are too short for layered analytical prose."
        : value > max
          ? "Sentences are too long; tighten clauses before adding style."
          : "Sentence length is in the target range.",
  };
}

function densityMetric(
  id: string,
  label: string,
  count: number,
  wordCount: number,
  target: string,
): StyleMetric {
  const normalized = wordCount > 0 ? (count / wordCount) * 120 : 0;
  const score = Math.min(100, Math.round(normalized * 100));
  return {
    id,
    label,
    value: count,
    target,
    score,
    note: count > 0 ? "Signal present." : "Signal missing or too sparse.",
  };
}

function punctuationMetric(count: number, sentenceCount: number): StyleMetric {
  const ratio = sentenceCount > 0 ? count / sentenceCount : 0;
  return {
    id: "punctuation",
    label: "Clause punctuation",
    value: count,
    target: "Some colon/semicolon use, but not required",
    score: Math.min(100, Math.round(ratio * 180)),
    note: count > 0 ? "Clause punctuation can support compressed argument." : "No clause punctuation signal.",
  };
}

function buildSummary(score: number, sentenceCount: number, wordCount: number): string {
  if (wordCount === 0) {
    return "No analyzable English text was provided.";
  }
  if (score >= 75) {
    return `Strong analytical style signal across ${sentenceCount} sentence(s).`;
  }
  if (score >= 45) {
    return `Partial Economist-style signal across ${sentenceCount} sentence(s); the argument needs sharper contrast and causality.`;
  }
  return `Weak Economist-style signal across ${sentenceCount} sentence(s); start with argument structure before polishing vocabulary.`;
}

function buildSuggestions(metrics: StyleMetric[]): StyleSuggestion[] {
  return metrics
    .filter((metric) => metric.score < 70)
    .sort((left, right) => left.score - right.score)
    .slice(0, 4)
    .map((metric) => ({
      priority: metric.score < 35 ? "high" : metric.score < 55 ? "medium" : "low",
      issue: metric.label,
      action: suggestionForMetric(metric.id),
    }));
}

function suggestionForMetric(id: string): string {
  switch (id) {
    case "sentence-length":
      return "Combine simple claims into one sentence with a controlled subordinate clause.";
    case "contrast":
      return "Add a contrast turn such as 'although', 'yet', or 'whereas' to create tension.";
    case "causality":
      return "Make the cause-effect chain explicit with 'because', 'in turn', or 'therefore'.";
    case "hedging":
      return "Use cautious analytical verbs such as 'suggests', 'may', or 'is unlikely to'.";
    case "lexical":
      return "Replace generic words with policy, market, incentive, or institutional vocabulary.";
    case "punctuation":
      return "Use a colon or semicolon only when it compresses explanation or contrast.";
    default:
      return "Revise this feature toward the target profile.";
  }
}

function roundOne(value: number): number {
  return Math.round(value * 10) / 10;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
