import { runContentParserQuery } from "../content-parser/runner";
import { runDictionaryProQuery } from "../dictionary-pro/runner";
import { ToeflSlangClientOptions } from "../platform/client";
import { ContentParserQuery } from "../content-parser/types";
import { OutputManager } from "../platform/output-manager";
import path from "path";
import fs from "fs";
import { TextChunker } from "../platform/text-chunker";
import { indexKnowledgeBase } from "../knowledge-base/indexer";
import { toExpressionCardSeeds } from "../connectors/content-to-dict";

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
  const outDir = OutputManager.getContentDir(slug);

  // 1. Initial Content Handling
  if (query.filePath && fs.existsSync(query.filePath)) {
    const rawContent = fs.readFileSync(query.filePath, 'utf-8');
    if (rawContent.length > 6000) {
       console.log(">> [Pipeline 1] Document is unusually large. Activating Chunker...");
       const chunks = TextChunker.splitIntoChunks(rawContent, 2000);
       console.log(`>> [Pipeline 1] Splitting document into ${chunks.length} processing chunks.`);
    }
  }

  // 2. Core Execution: Content Parser
  console.log(">> [Pipeline 1] Running Content Parser...");
  const cpResult = await runContentParserQuery({ query, clientOptions });

  // 3. Side Effects: Save Parser Outputs
  OutputManager.writeJson(path.join(outDir, "source.json"), cpResult.structured);
  OutputManager.writeMarkdown(path.join(outDir, "source.md"), cpResult.markdown);

  const candidates = cpResult.structured.expressionCandidates || [];
  OutputManager.writeJson(path.join(outDir, "candidates.json"), { candidates });

  // 4. Bridge: Map Candidates to Seeds
  console.log(`>> [Pipeline 1] Found ${candidates.length} expression candidates. Translating to Seeds...`);
  const seeds = toExpressionCardSeeds(candidates);

  // 5. Core Execution: Dictionary Pro Loop
  for (let i = 0; i < seeds.length; i++) {
    const seed = seeds[i];
    const candidate = candidates[i];
    
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

    // 6. Side Effects: Save Dictionary Cards
    const cardDir = OutputManager.getCardDir(seed.target, seed.source.category || "uncategorized", seed.query);
    OutputManager.writeJson(path.join(cardDir, "card.json"), {
      ...dpResult.structured,
      relatedSourceSlug: slug
    });
    const traceString = `\n\n> 👋 本卡片提取自: ${slug}`;
    OutputManager.writeMarkdown(path.join(cardDir, "index.md"), dpResult.markdown + traceString);
  }
  
  // 7. Side Effects: Update Knowledge Base Index
  indexKnowledgeBase();

  console.log(`>> [Pipeline 1] Input Learning Complete. Artifacts saved to outputs/content/${slug}/`);
}
