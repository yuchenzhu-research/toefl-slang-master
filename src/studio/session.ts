import type { ContentParserRunResult } from "../content-parser/runner";
import type { TargetRegister } from "../platform/contracts";

/**
 * User-facing learning target choices presented in the Studio menu.
 * These do NOT map 1:1 to internal TargetRegister values.
 * See src/studio/target-map.ts for the conservative mapping layer.
 */
export type LearningTargetChoice =
  | "toefl-writing"
  | "economist-style"
  | "american-spoken";

export type StudioSessionStatus =
  | "pending"
  | "parsed"
  | "candidates-selected"
  | "target-selected"
  | "generating"
  | "done";

/**
 * StudioSession captures the full state of a single guided SPARK session.
 * It is purely in-memory for Phase 1 — not persisted between runs.
 */
export interface StudioSession {
  sessionId: string;
  /** Absolute path to the source file */
  filePath: string;
  status: StudioSessionStatus;
  /** Result from Content Parser runner */
  parseResult?: ContentParserRunResult;
  /** 0-indexed positions of selected candidates */
  selectedIndices?: number[];
  /** What the user chose from the menu */
  learningTarget?: LearningTargetChoice;
  /** Resolved internal target after mapping */
  resolvedTarget?: TargetRegister;
  /**
   * Shown to user when the chosen style is a fallback mapping,
   * not a fully implemented engine.
   */
  targetNote?: string;
  /** Headwords of dictionary cards that were generated this session */
  generatedCards?: string[];
}

export function createStudioSession(filePath: string): StudioSession {
  return {
    sessionId: `studio-${Date.now()}`,
    filePath,
    status: "pending",
  };
}
