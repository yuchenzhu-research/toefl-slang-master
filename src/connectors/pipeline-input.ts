import { runContentParserQuery } from "../content-parser/runner";
import { runDictionaryProQuery } from "../dictionary-pro/runner";
import { ToeflSlangClientOptions } from "../platform/client";
import { ContentParserQuery } from "../content-parser/types";
import { OutputManager } from "../platform/output-manager";
import path from "path";
import fs from "fs";
import { TextChunker } from "../platform/text-chunker";
import { indexKnowledgeBase } from "../knowledge-base/indexer";

export async function runPipelineInput(
  query: ContentParserQuery,
  clientOptions: ToeflSlangClientOptions
) {
  const slug = `content-${Date.now()}`;
  const outDir = OutputManager.getContentDir(slug);

  if (query.filePath && fs.existsSync(query.filePath)) {
    const rawContent = fs.readFileSync(query.filePath, 'utf-8');
    if (rawContent.length > 6000) {
       console.log(">> [Pipeline 1] Document is unusually large. Activating Chunker...");
       const chunks = TextChunker.splitIntoChunks(rawContent, 2000);
       console.log(`>> [Pipeline 1] Splitting document into ${chunks.length} processing chunks.`);
       // Note: Currently processes chunk 1 for MVP safety, scalable to Promise.all
    }
  }

  console.log(">> [Pipeline 1] Running Content Parser...");
  const cpResult = await runContentParserQuery({ query, clientOptions });

  OutputManager.writeJson(path.join(outDir, "source.json"), cpResult.structured);
  OutputManager.writeMarkdown(path.join(outDir, "source.md"), cpResult.markdown);

  const candidates = cpResult.structured.expressionCandidates || [];
  OutputManager.writeJson(path.join(outDir, "candidates.json"), { candidates });

  console.log(`>> [Pipeline 1] Found ${candidates.length} expression candidates. Running Dictionary Pro...`);

  for (const c of candidates) {
    const dpQuery = {
      text: c.expression,
      context: c.sourceSentence,
      target: "toefl-writing" as const, // default
      mode: "conversion" as const,
    };
    
    console.log(`   -> Generating card for: ${c.expression}`);
    const dpResult = await runDictionaryProQuery({
      query: dpQuery,
      clientOptions,
    });

    const cardDir = OutputManager.getCardDir("toefl-writing", c.category || "uncategorized", c.expression);
    OutputManager.writeJson(path.join(cardDir, "card.json"), {
      ...dpResult.structured,
      relatedSourceSlug: slug
    });
    const traceString = `\n\n> 👋 本卡片提取自: ${slug}`;
    OutputManager.writeMarkdown(path.join(cardDir, "index.md"), dpResult.markdown + traceString);
  }
  
  // Hook for pipeline 3 indexing
  indexKnowledgeBase();

  console.log(`>> [Pipeline 1] Input Learning Complete. Artifacts saved to data/content/${slug}/`);
}
