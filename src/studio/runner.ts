import * as path from "path";
import type { ToeflSlangClientOptions } from "../platform/client";
import { resolveContentParserSource } from "../content-parser/extractor";
import { runContentParserQuery } from "../content-parser/runner";
import { toExpressionCardSeeds } from "../connectors/content-to-dict";
import { toExpressionCard } from "../connectors/dict-to-card";
import { runDictionaryProQuery } from "../dictionary-pro/runner";
import { OutputManager } from "../platform/output-manager";
import { createStudioSession, type StudioSession } from "./session";
import {
  promptFilePath,
  promptCandidateSelection,
  promptLearningTarget,
  confirmProceed,
} from "./prompts";
import { resolveStudioTarget } from "./target-map";

const SEPARATOR = "─".repeat(60);

function printSeparator() {
  console.log(`\n  ${SEPARATOR}`);
}

function printStep(n: number, label: string) {
  console.log(`\n  ◆ Step ${n}: ${label}`);
  console.log(`  ${"─".repeat(label.length + 10)}`);
}

/**
 * The main orchestrator for the guided SPARK Studio workflow.
 *
 * Calls existing module runners in sequence, collecting user input
 * at each gate. Side-effects flow through OutputManager as usual.
 */
export async function runStudio(options: {
  clientOptions: ToeflSlangClientOptions;
  dryRun?: boolean;
  filePathHint?: string;
}): Promise<StudioSession> {
  const { clientOptions, dryRun = false } = options;

  console.log(`\n  ${SEPARATOR}`);
  console.log("  ✦ SPARK Studio — Guided Learning Session");
  console.log(`  ${SEPARATOR}`);
  if (dryRun) {
    console.log("  [dry-run mode — no API calls will be made]\n");
  }

  // ─── Step 1: File selection ────────────────────────────────────
  printStep(1, "Source File");
  const filePath = await promptFilePath(options.filePathHint);
  const session = createStudioSession(filePath);
  const slug = session.sessionId;

  // ─── Step 2: Parse the source ─────────────────────────────────
  printStep(2, "Parsing Source");
  const query = {
    filePath,
    focus: "full" as const,
  };

  if (dryRun) {
    console.log(`  [dry-run] Would parse: ${path.basename(filePath)}`);
    console.log("  [dry-run] Skipping API call.\n");
    session.status = "parsed";
    session.selectedIndices = [];
    session.generatedCards = [];
    return session;
  }

  console.log(`  Parsing ${path.basename(filePath)}...`);
  const source = await resolveContentParserSource(query);
  const parseResult = await runContentParserQuery({ query, clientOptions, source });
  session.parseResult = parseResult;
  session.status = "parsed";

  // Save parse output immediately
  OutputManager.saveContentDigest(slug, parseResult.structured, parseResult.markdown);
  const candidates = parseResult.structured.expressionCandidates ?? [];
  OutputManager.saveContentCandidates(slug, { candidates });

  // ─── Step 2 preview ───────────────────────────────────────────
  printSeparator();
  console.log(`\n  Parse Preview:\n`);
  console.log(`    Title      : ${parseResult.structured.title}`);
  console.log(`    Type       : ${parseResult.structured.sourceType}`);
  console.log(`    Chars      : ${source.charCount.toLocaleString()}`);
  if (source.truncated) {
    console.log("    ⚠ Source was truncated before analysis.");
  }
  console.log(`    Candidates : ${candidates.length} expression(s) found`);

  if (candidates.length === 0) {
    console.log("\n  No expression candidates found. Session ended.\n");
    session.status = "done";
    return session;
  }

  // ─── Step 3: Select candidates ────────────────────────────────
  printStep(3, "Select Expressions to Study");
  const selectedIndices = await promptCandidateSelection(candidates);
  session.selectedIndices = selectedIndices;
  session.status = "candidates-selected";

  if (selectedIndices.length === 0) {
    console.log("  No items selected. Session ended.\n");
    session.status = "done";
    return session;
  }

  // ─── Step 4: Learning target ──────────────────────────────────
  printStep(4, "Learning Target");
  const targetChoice = await promptLearningTarget();
  const resolution = resolveStudioTarget(targetChoice);
  session.learningTarget = targetChoice;
  session.resolvedTarget = resolution.target;
  session.targetNote = resolution.note;
  session.status = "target-selected";

  if (resolution.note) {
    console.log(`\n  ⚠ ${resolution.note}`);
  }

  // ─── Confirm before generating ────────────────────────────────
  printSeparator();
  console.log(`\n  Ready to generate ${selectedIndices.length} card(s) targeting "${resolution.target}".`);
  const proceed = await confirmProceed("Proceed?");
  if (!proceed) {
    console.log("  Session cancelled.\n");
    session.status = "done";
    return session;
  }

  // ─── Step 5: Generate cards ───────────────────────────────────
  printStep(5, "Generating Learning Cards");
  session.status = "generating";
  const selectedCandidates = selectedIndices.map((i) => candidates[i]);
  const seeds = toExpressionCardSeeds(selectedCandidates).map((seed) => ({
    ...seed,
    target: resolution.target,
  }));

  const generatedHeadwords: string[] = [];

  for (let i = 0; i < seeds.length; i++) {
    const seed = seeds[i];
    console.log(`  [${i + 1}/${seeds.length}] Generating card: "${seed.query}"`);

    const dpResult = await runDictionaryProQuery({
      query: {
        text: seed.query,
        context: seed.context,
        target: seed.target,
        mode: seed.mode,
      },
      clientOptions,
    });

    const card = toExpressionCard(dpResult.structured, { relatedSourceSlug: slug });
    OutputManager.saveDictionaryCard(card, dpResult.markdown);
    generatedHeadwords.push(card.headword);
  }

  session.generatedCards = generatedHeadwords;
  session.status = "done";

  // ─── Summary ──────────────────────────────────────────────────
  printSeparator();
  console.log(`\n  ✦ Session complete!\n`);
  console.log(`    Cards generated : ${generatedHeadwords.length}`);
  console.log(`    Headwords       : ${generatedHeadwords.join(", ")}`);
  console.log(`    Saved to        : outputs/dict/<headword>/`);
  console.log(`    Source digest   : outputs/content/${slug}/`);
  console.log();

  return session;
}
