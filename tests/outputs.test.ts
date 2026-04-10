import test from "node:test";
import assert from "node:assert";
import { OutputManager } from "../src/platform/output-manager";
import path from "path";

test("OutputManager generates correct canonical output directories", () => {
  const root = path.join(process.cwd(), "outputs");

  const contentDir = OutputManager.getContentDir("test-slug");
  assert.strictEqual(contentDir, path.join(root, "content", "test-slug"));

  const coachDir = OutputManager.getDiagnosisDir("test-diagnosis");
  assert.strictEqual(coachDir, path.join(root, "coach", "test-diagnosis"));

  const dictDir = OutputManager.getCardDir("toefl-writing", "informal", "gonna make it");
  assert.strictEqual(dictDir, path.join(root, "dict", "gonna-make-it"));
});
