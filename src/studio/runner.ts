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

import { runTui } from "./tui/SPARKTui";

/**
 * The main orchestrator for the guided SPARK Studio workflow.
 * Now running as an advanced Terminal UI!
 */
export async function runStudio(options: {
  clientOptions: ToeflSlangClientOptions;
  dryRun?: boolean;
  filePathHint?: string;
}): Promise<StudioSession> {
  const { clientOptions, dryRun = false } = options;

  console.log("Launching SPARK TUI Studio...");
  await runTui({ clientOptions, dryRun });

  // Mock return to satisfy contract
  return {
    sessionId: "tui-session",
    filePath: "",
    status: "done",
    selectedIndices: [],
    generatedCards: [],
  };
}
