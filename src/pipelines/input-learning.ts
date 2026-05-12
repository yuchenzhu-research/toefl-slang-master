import { runContentParserQuery } from "../content-parser/runner";
import { runDictionaryProQuery } from "../dictionary-pro/runner";
import { ToeflSlangClientOptions } from "../platform/client";
import { ContentParserQuery } from "../content-parser/types";
import { OutputManager } from "../platform/output-manager";
import { toExpressionCardSeeds } from "../connectors/content-to-dict";
import { toExpressionCard } from "../connectors/dict-to-card";
import { resolveContentParserSource } from "../content-parser/extractor";
import { resolveActiveFocus } from "../content-parser/types";

/**
 * Pipeline 1: Input Learning Workflow
 * Orchestrates Content Parser -> Content-to-Dict Mapping -> Dictionary Pro Card Generation
 * Handles all side-effects (I/O, Indexing, Slugs)
 */
export async function runPipelineInput(
  query: ContentParserQuery,
  clientOptions: ToeflSlangClientOptions
) {
  const slug = `content-${Date.now()}`;

  // 1. Core Execution: Content Parser
  console.log(">> [Pipeline 1] Running Content Parser...");
  const cpResult = await runContentParserQuery({ query, clientOptions });

  // 2. Side Effects: Save Parser Outputs via Sidecar Saver
  OutputManager.saveContentDigest(slug, cpResult.structured, cpResult.markdown);

  const candidates = cpResult.structured.expressionCandidates || [];
  OutputManager.saveContentCandidates(slug, { candidates });

  // 3. Bridge: Map Candidates to Seeds
  console.log(`>> [Pipeline 1] Found ${candidates.length} expression candidates. Translating to Seeds...`);
  const seeds = toExpressionCardSeeds(candidates);

  // 4. Core Execution: Dictionary Pro Loop
  for (let i = 0; i < seeds.length; i++) {
    const seed = seeds[i];

    console.log(`   -> Generating card for: ${seed.query}`);
    const dpResult = await runDictionaryProQuery({
      query: {
        text: seed.query,
        context: seed.context,
        target: seed.target,
        mode: seed.mode,
      },
      clientOptions,
    });

    // 5. Side Effects: Map to Standard ExpressionCard and Save with Sidecar
    const traceMetadata = { relatedSourceSlug: slug };
    const standardizedCard = toExpressionCard(dpResult.structured, traceMetadata);
    
    console.log(`   -> Saving standardized card and sidecar for: ${seed.query}`);
    OutputManager.saveDictionaryCard(
       standardizedCard, 
       dpResult.markdown + `\n\n> 👋 本卡片提取自素材: ${slug}`
    );
  }
  
  // 6. Side Effects: Update Knowledge Base Index (Optional/Experimental)
  try {
    const { indexKnowledgeBase } = require("../experimental/knowledge-base/indexer");
    indexKnowledgeBase();
  } catch (e) {
    // Silent skip if experimental indexer is missing or fails
  }

  console.log(`>> [Pipeline 1] Input Learning Complete. Artifacts saved to outputs/content/${slug}/`);
}

export async function dryRunPipelineInput(
  query: ContentParserQuery,
  clientOptions: ToeflSlangClientOptions,
): Promise<void> {
  const source = await resolveContentParserSource(query);

  console.log("[DRY RUN] spark x pipeline:input");
  console.log(`sourceName: ${source.sourceName}`);
  console.log(`sourceType: ${source.sourceType}`);
  console.log(`focus: ${resolveActiveFocus(query.focus)}`);
  console.log(`charCount: ${source.charCount}`);
  console.log(`truncated: ${source.truncated ? "yes" : "no"}`);
  console.log(`provider: ${clientOptions.provider ?? "auto"}`);
  if (clientOptions.model) {
    console.log(`model: ${clientOptions.model}`);
  }
  console.log("planned: Content Parser -> ExpressionCandidates -> Dictionary Pro -> ExpressionCard");
  console.log("writes: outputs/content/<slug>/{digest.json,index.md,candidates.json}");
  console.log("writes: outputs/dict/<headword>/{card.json,index.md}");
}
