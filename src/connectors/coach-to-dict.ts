import { runToeflWritingQuery } from "../toefl-writing/runner";
import { runDictionaryProQuery } from "../dictionary-pro/runner";
import { ToeflSlangClientOptions } from "../platform/client";
import { WeakExpressionSet, ExpressionCardSeed } from "../platform/contracts";
import { OutputManager } from "../platform/output-manager";
import path from "path";
import { indexKnowledgeBase } from "../knowledge-base/indexer";

/**
 * Connector 转换纯函数
 */
export function mapCoachToDictSeeds(weakSet: WeakExpressionSet): ExpressionCardSeed[] {
  if (!weakSet || !weakSet.items) return [];

  return weakSet.items.map(item => {
    return {
      seedExpression: item.weakExpression,
      seedContext: item.contextSentence || '',
      sourceOrigin: 'TOEFLCoach',
      targetRegister: 'toefl-writing',
    } as ExpressionCardSeed;
  });
}

/**
 * Pipeline 2: Output Correction Workflow
 */
export async function runPipelineOutput(
  text: string,
  clientOptions: ToeflSlangClientOptions
) {
  const slug = `essay-${Date.now()}`;
  const outDir = OutputManager.getDiagnosisDir(slug);

  console.log(">> [Pipeline 2] Running TOEFL Coach Diagnosis...");
  const coachResult = await runToeflWritingQuery({ query: { text }, clientOptions });

  OutputManager.writeJson(path.join(outDir, "diagnosis.json"), coachResult.structured);
  OutputManager.writeMarkdown(path.join(outDir, "report.md"), coachResult.markdown);

  const weakSet = coachResult.structured.weakExpressionSet || { items: [] };
  OutputManager.writeJson(path.join(outDir, "weak-expressions.json"), weakSet);

  const seeds = mapCoachToDictSeeds(weakSet);
  console.log(`>> [Pipeline 2] Found ${seeds.length} weak expressions. Translating to Dictionary Cards...`);

  for (const seed of seeds) {
    const dpQuery = {
      text: seed.seedExpression,
      context: seed.seedContext,
      target: seed.targetRegister,
      mode: "conversion" as const,
    };
    
    console.log(`   -> Generating card for weak expression: ${seed.seedExpression}`);
    const dpResult = await runDictionaryProQuery({
      query: dpQuery,
      clientOptions,
    });

    const cardDir = OutputManager.getCardDir(seed.targetRegister, "weak-expression-fix", seed.seedExpression);
    OutputManager.writeJson(path.join(cardDir, "card.json"), dpResult.structured);
    OutputManager.writeMarkdown(path.join(cardDir, "index.md"), dpResult.markdown);
  }

  // Hook for pipeline 3 indexing
  indexKnowledgeBase();

  console.log(`>> [Pipeline 2] Output Correction Complete. Artifacts saved to data/diagnoses/${slug}/`);
}
