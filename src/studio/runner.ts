import type { ToeflSlangClientOptions } from "../platform/client";
import type { StudioSession } from "./session";
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
