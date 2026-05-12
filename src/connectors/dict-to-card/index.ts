import { DictionaryProStructuredResponse } from "../../dictionary-pro/types";
import { ExpressionCard } from "../../platform/contracts";

/**
 * Connector: Dictionary Pro Result -> Platform ExpressionCard
 * Ensures that varied Dictionary Pro response kinds are flattened into 
 * the stable ExpressionCard contract for long-term persistence and SRS.
 */
export function toExpressionCard(
  response: DictionaryProStructuredResponse,
  metadata: { relatedSourceSlug?: string; relatedDiagnosisSlug?: string } = {}
): ExpressionCard {
  // If it's a standard word_phrase response, mapping is mostly 1:1
  if (response.kind === "word_phrase") {
    return {
      headword: response.query,
      context: response.context || "",
      translation: response.translation.join(", "),
      slangOrInformal: response.slang.variants,
      academicAlignment: response.alignment.map(a => a.expression),
      frequency: response.frequency,
      analysis: `${response.analysis.sourceExplanation}\n\n${response.analysis.toeflExplanation}`,
      tags: response.notes || [],
      ...metadata
    };
  }

  // If it's a sentence upgrade, we treat the query as the headword
  // and extract the specific improvements as academic alignment.
  if (response.kind === "sentence_upgrade") {
    return {
      headword: response.query,
      context: response.context || "",
      translation: "Sentence Refinement",
      slangOrInformal: response.replacements.map(r => r.source),
      academicAlignment: [response.recommendedRewrite],
      frequency: "varies",
      analysis: response.explanation,
      tags: ["sentence-upgrade", ...(response.notes || [])],
      ...metadata
    };
  }

  // Fallback for comparison or ambiguous results
  // We take the query as the headword and provide a summary analysis
  return {
    headword: response.query,
    context: response.context || "",
    translation: "Compound Comparison",
    slangOrInformal: [],
    academicAlignment: [],
    frequency: "N/A",
    analysis: "See original comparison report for details.",
    tags: ["aggregated", ...(response.notes || [])],
    ...metadata
  };
}
