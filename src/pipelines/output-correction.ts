import { runDictionaryProQuery } from "../dictionary-pro/runner";
import { toExpressionCard } from "../connectors/dict-to-card";
import type { ToeflSlangClientOptions } from "../platform/client";
import { OutputManager } from "../platform/output-manager";
import { resolveToeflWritingSource } from "../toefl-writing/cli";
import { runToeflWritingQuery } from "../toefl-writing/runner";
import { buildCoachToDictBridgeBundle } from "../connectors/coach-to-dict";

/**
 * Pipeline 2: Output Correction Workflow
 * Orchestrates TOEFL Coach -> Coach-to-Dict Mapping -> Dictionary Pro Card Generation
 * Handles all side-effects (I/O, Indexing, Slugs)
 */
export async function runPipelineOutput(
  text: string,
  clientOptions: ToeflSlangClientOptions,
): Promise<void> {
  const slug = `essay-${Date.now()}`;
  const source = resolveToeflWritingSource({ text });

  // 1. Core Execution: TOEFL Coach
  console.log(">> [Pipeline 2] Running TOEFL Coach Diagnosis...");
  const coachResult = await runToeflWritingQuery({
    query: { text },
    clientOptions,
    source,
  });

  // 2. Bridge: Map Diagnosis to Seeds
  const bundle = buildCoachToDictBridgeBundle(coachResult.structured);
  const weakSet = bundle?.weakExpressionSet;
  const seeds = bundle?.seeds ?? [];
  const queries = bundle?.queries ?? [];

  // 3. Side Effects: Enrich and Save Report
  let reportMd = coachResult.markdown;
  if (weakSet && weakSet.items.length > 0) {
    reportMd += `\n\n## 表达升级池\n\n`;
    reportMd += `- ${weakSet.summary}\n`;
    weakSet.items.forEach((item) => {
      const anchor = item.sourceFragment ?? item.text;
      reportMd += `- [${item.severity}] ${anchor}: ${item.reason} -> ${item.rewriteGoal}\n`;
    });
  }

  OutputManager.saveCoachDiagnosis(slug, coachResult.structured, reportMd);

  // 4. Core Execution: Dictionary Pro Loop
  console.log(`>> [Pipeline 2] Found ${seeds.length} weak expressions. Translating to Dictionary Cards...`);

  for (let index = 0; index < seeds.length; index += 1) {
    const seed = seeds[index];
    const dpQuery = queries[index];

    if (!dpQuery) continue;

    console.log(`   -> Generating card for weak expression: ${seed.query}`);
    const dpResult = await runDictionaryProQuery({
      query: {
        text: dpQuery.text,
        context: dpQuery.context,
        mode: dpQuery.mode,
        target: dpQuery.target,
      },
      clientOptions,
    });

    // 5. Side Effects: Map to Standard ExpressionCard and Save with Sidecar
    const traceMetadata = { relatedDiagnosisSlug: slug };
    const standardizedCard = toExpressionCard(dpResult.structured, traceMetadata);

    console.log(`   -> Saving standardized card and sidecar for: ${seed.query}`);
    OutputManager.saveDictionaryCard(
      standardizedCard,
      dpResult.markdown + `\n\n> Source diagnosis: ${slug}`
    );
  }

  // 6. Side Effects: Update Knowledge Base Index (Optional/Experimental)
  try {
    const { indexKnowledgeBase } = require("../experimental/knowledge-base/indexer");
    indexKnowledgeBase();
  } catch (e) {
    // Silent skip if experimental indexer is missing or fails
  }

  console.log(`>> [Pipeline 2] Output Correction Complete. Artifacts saved to outputs/coach/${slug}/`);
}
