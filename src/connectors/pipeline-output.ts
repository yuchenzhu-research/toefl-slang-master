import { runDictionaryProQuery } from "../dictionary-pro/runner";
import type { ToeflSlangClientOptions } from "../platform/client";
import type { ExpressionCardSeed, WeakExpressionSet } from "../platform/contracts";
import { OutputManager } from "../platform/output-manager";
import path from "path";
import { indexKnowledgeBase } from "../knowledge-base/indexer";
import { resolveToeflWritingSource } from "../toefl-writing/cli";
import { runToeflWritingQuery } from "../toefl-writing/runner";
import { buildCoachToDictBridgeBundle, toExpressionCardSeeds } from "./coach-to-dict";

export function mapCoachToDictSeeds(weakSet: WeakExpressionSet): ExpressionCardSeed[] {
  return toExpressionCardSeeds(weakSet);
}

export async function runPipelineOutput(
  text: string,
  clientOptions: ToeflSlangClientOptions,
): Promise<void> {
  const slug = `essay-${Date.now()}`;
  const outDir = OutputManager.getDiagnosisDir(slug);
  const source = resolveToeflWritingSource({ text });

  console.log(">> [Pipeline 2] Running TOEFL Coach Diagnosis...");
  const coachResult = await runToeflWritingQuery({
    query: { text },
    clientOptions,
    source,
  });

  OutputManager.writeJson(path.join(outDir, "diagnosis.json"), coachResult.structured);
  const bundle = buildCoachToDictBridgeBundle(coachResult.structured);
  const weakSet = bundle?.weakExpressionSet;

  let reportMd = coachResult.markdown;
  if (weakSet && weakSet.items.length > 0) {
    reportMd += `\n\n## 表达升级池\n\n`;
    reportMd += `- ${weakSet.summary}\n`;
    weakSet.items.forEach((item) => {
      const anchor = item.sourceFragment ?? item.text;
      reportMd += `- [${item.severity}] ${anchor}: ${item.reason} -> ${item.rewriteGoal}\n`;
    });
  }

  OutputManager.writeMarkdown(path.join(outDir, "report.md"), reportMd);

  const seeds = bundle?.seeds ?? [];
  const queries = bundle?.queries ?? [];
  console.log(`>> [Pipeline 2] Found ${seeds.length} weak expressions. Translating to Dictionary Cards...`);

  for (let index = 0; index < seeds.length; index += 1) {
    const seed = seeds[index];
    const dpQuery = queries[index];

    if (!dpQuery) {
      continue;
    }

    console.log(`   -> Generating card for weak expression: ${seed.query}`);
    const dpResult = await runDictionaryProQuery({
      query: dpQuery,
      clientOptions,
    });

    const cardDir = OutputManager.getCardDir(seed.target, "weak-expression-fix", seed.query);
    OutputManager.writeJson(path.join(cardDir, "card.json"), {
      ...dpResult.structured,
      relatedDiagnosisSlug: slug,
    });
    const traceString = `\n\n> Source diagnosis: ${slug}`;
    OutputManager.writeMarkdown(path.join(cardDir, "index.md"), dpResult.markdown + traceString);
  }

  indexKnowledgeBase();

  console.log(`>> [Pipeline 2] Output Correction Complete. Artifacts saved to outputs/coach/${slug}/`);
}
