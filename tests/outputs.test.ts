import test from "node:test";
import assert from "node:assert";
import { OutputManager } from "../src/platform/output-manager";
import fs from "fs";
import os from "os";
import path from "path";

test("OutputManager generates correct canonical output directories", () => {
  const originalCwd = process.cwd();
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "spark-outputs-"));

  try {
    process.chdir(tempDir);

    const root = path.join(fs.realpathSync(tempDir), "outputs");
    const contentDir = OutputManager.getContentDir("test-slug");
    assert.strictEqual(contentDir, path.join(root, "content", "test-slug"));

    const coachDir = OutputManager.getDiagnosisDir("test-diagnosis");
    assert.strictEqual(coachDir, path.join(root, "coach", "test-diagnosis"));

    const dictDir = OutputManager.getCardDir("toefl-writing", "informal", "gonna make it");
    assert.strictEqual(dictDir, path.join(root, "dict", "gonna-make-it"));
  } finally {
    process.chdir(originalCwd);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("OutputManager writes canonical content filenames", () => {
  const originalCwd = process.cwd();
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "spark-content-"));

  try {
    process.chdir(tempDir);

    OutputManager.saveContentDigest("content-slug", { title: "Demo" }, "# digest");
    OutputManager.saveContentCandidates("content-slug", { candidates: [] });

    const outDir = path.join(fs.realpathSync(tempDir), "outputs", "content", "content-slug");
    assert.ok(fs.existsSync(path.join(outDir, "digest.json")));
    assert.ok(fs.existsSync(path.join(outDir, "index.md")));
    assert.ok(fs.existsSync(path.join(outDir, "candidates.json")));
    assert.ok(!fs.existsSync(path.join(outDir, "source.json")));
    assert.ok(!fs.existsSync(path.join(outDir, "source.md")));
  } finally {
    process.chdir(originalCwd);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
