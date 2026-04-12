import test from "node:test";
import assert from "node:assert";
import { resolveStudioTarget } from "../src/studio/target-map";
import { parseCandidateSelection } from "../src/studio/prompts";
import { createStudioSession } from "../src/studio/session";

// ─────────────────────────────────────────────
// Learning target mapping
// ─────────────────────────────────────────────

test("resolveStudioTarget: toefl-writing maps directly with no fallback note", () => {
  const result = resolveStudioTarget("toefl-writing");
  assert.strictEqual(result.target, "toefl-writing");
  assert.ok(!result.note, "Expected no fallback note for toefl-writing");
});

test("resolveStudioTarget: economist-style maps to general-academic with a fallback note", () => {
  const result = resolveStudioTarget("economist-style");
  assert.strictEqual(result.target, "general-academic");
  assert.ok(typeof result.note === "string" && result.note.length > 0, "Expected a fallback note");
  assert.ok(result.note.toLowerCase().includes("fallback") || result.note.toLowerCase().includes("not yet"));
});

test("resolveStudioTarget: american-spoken maps to daily-english with a fallback note", () => {
  const result = resolveStudioTarget("american-spoken");
  assert.strictEqual(result.target, "daily-english");
  assert.ok(typeof result.note === "string" && result.note.length > 0, "Expected a fallback note");
});

// ─────────────────────────────────────────────
// Candidate selection parsing
// ─────────────────────────────────────────────

test("parseCandidateSelection: empty input selects all", () => {
  const result = parseCandidateSelection("", 5);
  assert.deepStrictEqual(result, [0, 1, 2, 3, 4]);
});

test("parseCandidateSelection: 'all' selects all", () => {
  const result = parseCandidateSelection("all", 5);
  assert.deepStrictEqual(result, [0, 1, 2, 3, 4]);
});

test("parseCandidateSelection: 'top 3' selects first 3", () => {
  const result = parseCandidateSelection("top 3", 5);
  assert.deepStrictEqual(result, [0, 1, 2]);
});

test("parseCandidateSelection: 'top N' is clamped to total", () => {
  const result = parseCandidateSelection("top 10", 3);
  assert.deepStrictEqual(result, [0, 1, 2]);
});

test("parseCandidateSelection: comma-separated 1-indexed converts to 0-indexed", () => {
  const result = parseCandidateSelection("1,3,5", 5);
  assert.deepStrictEqual(result, [0, 2, 4]);
});

test("parseCandidateSelection: comma list ignores out-of-bounds and deduplicates", () => {
  const result = parseCandidateSelection("1,1,99,2", 3);
  assert.deepStrictEqual(result, [0, 1]);
});

test("parseCandidateSelection: invalid input falls back to all", () => {
  const result = parseCandidateSelection("xyz", 3);
  assert.deepStrictEqual(result, [0, 1, 2]);
});

// ─────────────────────────────────────────────
// Session object
// ─────────────────────────────────────────────

test("createStudioSession: creates session with pending status and correct filePath", () => {
  const session = createStudioSession("/tmp/test.md");
  assert.strictEqual(session.filePath, "/tmp/test.md");
  assert.strictEqual(session.status, "pending");
  assert.ok(session.sessionId.startsWith("studio-"), "sessionId should start with 'studio-'");
  assert.ok(!session.parseResult);
  assert.ok(!session.selectedIndices);
  assert.ok(!session.generatedCards);
});
