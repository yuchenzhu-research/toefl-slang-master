import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";
import type { LearningTargetChoice } from "./session";
import { STUDIO_TARGET_LABELS } from "./target-map";

/**
 * All terminal I/O for the Studio workflow is abstracted here.
 * Uses Node.js built-in readline — no external dependencies.
 */

function createRl(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function ask(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

// ─────────────────────────────────────────────
// Step 1: File path input
// ─────────────────────────────────────────────

const SUPPORTED_EXTENSIONS = [".pdf", ".md", ".txt", ".markdown"];

export async function promptFilePath(defaultPath?: string): Promise<string> {
  const rl = createRl();
  let filePath: string;

  try {
    while (true) {
      const input = await ask(
        rl,
        defaultPath
          ? `  Source file [${defaultPath}]: `
          : "  Source file path (.pdf / .md / .txt): ",
      );
      filePath = input || defaultPath || "";

      if (!filePath) {
        console.log("  ✗ Please provide a file path.");
        continue;
      }

      const resolved = path.resolve(filePath);
      if (!fs.existsSync(resolved)) {
        console.log(`  ✗ File not found: ${resolved}`);
        continue;
      }

      const ext = path.extname(resolved).toLowerCase();
      if (!SUPPORTED_EXTENSIONS.includes(ext)) {
        console.log(`  ✗ Unsupported file type: ${ext}. Supported: ${SUPPORTED_EXTENSIONS.join(", ")}`);
        continue;
      }

      return resolved;
    }
  } finally {
    rl.close();
  }
}

// ─────────────────────────────────────────────
// Step 2: Candidate selection
// ─────────────────────────────────────────────

/**
 * Parse a selection string into 0-indexed positions.
 *
 * Accepts:
 *   "all"        → all indices
 *   "top N"      → first N indices
 *   "1,3,5"      → 1-indexed → converted to 0-indexed [0,2,4]
 *   ""           → all (default)
 */
export function parseCandidateSelection(input: string, total: number): number[] {
  const normalized = input.trim().toLowerCase();

  if (!normalized || normalized === "all") {
    return Array.from({ length: total }, (_, i) => i);
  }

  const topMatch = normalized.match(/^top\s+(\d+)$/);
  if (topMatch) {
    const n = Math.min(parseInt(topMatch[1], 10), total);
    return Array.from({ length: n }, (_, i) => i);
  }

  // Parse comma-separated 1-indexed numbers
  const parts = normalized.split(",").map((s) => s.trim()).filter(Boolean);
  const indices: number[] = [];
  for (const part of parts) {
    const num = parseInt(part, 10);
    if (isNaN(num) || num < 1 || num > total) {
      // Skip invalid entries
      continue;
    }
    const idx = num - 1;
    if (!indices.includes(idx)) {
      indices.push(idx);
    }
  }

  return indices.length > 0 ? indices.sort((a, b) => a - b) : Array.from({ length: total }, (_, i) => i);
}

export async function promptCandidateSelection(
  candidates: Array<{ expression: string; category: string; difficulty: string }>,
): Promise<number[]> {
  if (candidates.length === 0) {
    console.log("  (no candidates found)");
    return [];
  }

  console.log("\n  Expression Candidates:\n");
  candidates.forEach((c, i) => {
    const label = `[${i + 1}]`.padEnd(5);
    const diff = c.difficulty ? ` (${c.difficulty})` : "";
    const cat = c.category ? ` [${c.category}]` : "";
    console.log(`  ${label} ${c.expression}${cat}${diff}`);
  });

  console.log(`\n  Select items to study:`);
  console.log(`    all        → all ${candidates.length} candidates`);
  console.log(`    top N      → first N (e.g. "top 5")`);
  console.log(`    1,3,5      → specific numbers`);
  console.log(`    (Enter)    → all\n`);

  const rl = createRl();
  try {
    const input = await ask(rl, "  Your selection: ");
    const selected = parseCandidateSelection(input, candidates.length);
    console.log(`  ✓ Selected ${selected.length} candidate(s).`);
    return selected;
  } finally {
    rl.close();
  }
}

// ─────────────────────────────────────────────
// Step 3: Learning target selection
// ─────────────────────────────────────────────

const TARGET_CHOICES: LearningTargetChoice[] = [
  "toefl-writing",
  "economist-style",
  "american-spoken",
];

export async function promptLearningTarget(): Promise<LearningTargetChoice> {
  console.log("\n  Learning Target:\n");
  TARGET_CHOICES.forEach((choice, i) => {
    console.log(`  [${i + 1}] ${STUDIO_TARGET_LABELS[choice]}`);
  });
  console.log();

  const rl = createRl();
  try {
    while (true) {
      const input = await ask(rl, "  Select target [1]: ");
      const num = parseInt(input || "1", 10);
      if (num >= 1 && num <= TARGET_CHOICES.length) {
        return TARGET_CHOICES[num - 1];
      }
      console.log(`  ✗ Enter a number between 1 and ${TARGET_CHOICES.length}.`);
    }
  } finally {
    rl.close();
  }
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

export async function confirmProceed(message: string): Promise<boolean> {
  const rl = createRl();
  try {
    const input = await ask(rl, `  ${message} [Y/n]: `);
    return input.toLowerCase() !== "n";
  } finally {
    rl.close();
  }
}
