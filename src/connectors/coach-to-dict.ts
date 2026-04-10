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
export function mapCoachToDictSeeds(weakSet: WeakExpressionSet, scope?: string): ExpressionCardSeed[] {
  if (!weakSet || !weakSet.items) return [];
  const targetRegister = scope === 'sentence' ? 'general-academic' : 'toefl-writing';

  return weakSet.items.map(item => {
    return {
      seedExpression: item.weakExpression,
      seedContext: item.contextSentence || '',
      sourceOrigin: 'TOEFLCoach',
      targetRegister: targetRegister as any,
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
  
  const weakSet = coachResult.structured.weakExpressionSet || { items: [] };

  let reportMd = coachResult.markdown;
  if (weakSet.items.length > 0) {
    reportMd += `\n\n## 🔧 提取的弱表达池\n\n| 弱表达 | 建议替换 | 问题类型 |\n|---|---|---|\n`;
    weakSet.items.forEach(i => {
      reportMd += `| **${i.weakExpression}** | ${i.suggestedReplacement} | ${i.issueType} |\n`;
    });
    reportMd += "\n> 系统已为您将这些弱表达丢入 Dictionary Pro 生成复习卡片！";
  }

  OutputManager.writeMarkdown(path.join(outDir, "report.md"), reportMd);

  const seeds = mapCoachToDictSeeds(weakSet, coachResult.structured.scope);
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
    OutputManager.writeJson(path.join(cardDir, "card.json"), {
      ...dpResult.structured,
      relatedDiagnosisSlug: slug
    });
    const traceString = `\n\n> 👋 本卡片追踪自诊断记录: ${slug}`;
    OutputManager.writeMarkdown(path.join(cardDir, "index.md"), dpResult.markdown + traceString);
  }

  // Hook for pipeline 3 indexing
  indexKnowledgeBase();

  console.log(`>> [Pipeline 2] Output Correction Complete. Artifacts saved to data/diagnoses/${slug}/`);
}
