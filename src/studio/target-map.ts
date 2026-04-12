import type { TargetRegister } from "../platform/contracts";
import type { LearningTargetChoice } from "./session";

/**
 * Conservative mapping from user-facing studio style choices
 * to stable internal TargetRegister values.
 *
 * IMPORTANT: This is NOT a full style intelligence system.
 * - "toefl-writing"   → direct, fully supported
 * - "economist-style" → FALLBACK: maps to general-academic register
 * - "american-spoken" → FALLBACK: maps to daily-english register
 *
 * Economist and American-Spoken are user-facing labels only.
 * No separate prompt engine or style corpus backs them in Phase 1.
 */
export interface TargetResolution {
  target: TargetRegister;
  /**
   * If set, this should be shown to the user to clarify that the chosen
   * style is a conservative fallback, not a fully implemented engine.
   */
  note?: string;
}

const STYLE_MAP: Record<LearningTargetChoice, TargetResolution> = {
  "toefl-writing": {
    target: "toefl-writing",
    // No note — this is fully supported
  },
  "economist-style": {
    target: "general-academic",
    note:
      "[Note] Economist Style is mapped to the General Academic register. " +
      "A dedicated Economist engine is not yet implemented in Phase 1.",
  },
  "american-spoken": {
    target: "daily-english",
    note:
      "[Note] American Spoken is mapped to the Daily English register. " +
      "A dedicated spoken-English engine is not yet implemented in Phase 1.",
  },
};

export function resolveStudioTarget(choice: LearningTargetChoice): TargetResolution {
  return STYLE_MAP[choice];
}

/**
 * Exported for use in tests and the studio runner's dry-run mode.
 */
export const STUDIO_TARGET_LABELS: Record<LearningTargetChoice, string> = {
  "toefl-writing": "TOEFL Writing",
  "economist-style": "Economist Style (→ general-academic fallback)",
  "american-spoken": "American Spoken (→ daily-english fallback)",
};
