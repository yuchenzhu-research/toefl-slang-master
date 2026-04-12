import type { ToeflSlangClientOptions } from "../platform/client";
import type { StudioSession } from "./session";

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

  // Lazy-import to avoid loading ESM-only pi-tui at module resolution time.
  // This prevents ERR_REQUIRE_ESM when cli.test.ts imports app-cli in CJS mode.
  const { runTui } = await import("./tui/SPARKTui");

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
