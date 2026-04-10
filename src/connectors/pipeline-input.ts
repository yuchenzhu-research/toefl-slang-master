import { runContentParserQuery } from "../content-parser/runner";
import { runDictionaryProQuery } from "../dictionary-pro/runner";
import { ToeflSlangClientOptions } from "../platform/client";
import { ContentParserQuery } from "../content-parser/types";
import { OutputManager } from "../platform/output-manager";
import path from "path";
import { indexKnowledgeBase } from "../knowledge-base/indexer";

export async function runPipelineInput(
  query: ContentParserQuery,
  clientOptions: ToeflSlangClientOptions
) {
  const slug = `content-${Date.now()}`;
  const outDir = OutputManager.getContentDir(slug);

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
    OutputManager.writeJson(path.join(cardDir, "card.json"), dpResult.structured);
    OutputManager.writeMarkdown(path.join(cardDir, "index.md"), dpResult.markdown);
  }
  
  // Hook for pipeline 3 indexing
  indexKnowledgeBase();

  console.log(`>> [Pipeline 1] Input Learning Complete. Artifacts saved to data/content/${slug}/`);
}
