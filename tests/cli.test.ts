import test from "node:test";
import assert from "node:assert";
import fs from "fs";
import path from "path";
import { runTopLevelCli } from "../src/app-cli";

async function captureConsoleLog(run: () => Promise<void>): Promise<string> {
  const originalConsoleLog = console.log;
  const lines: string[] = [];

  console.log = (...args: unknown[]) => {
    lines.push(args.map((value) => String(value)).join(" "));
  };

  try {
    await run();
  } finally {
    console.log = originalConsoleLog;
  }

  return lines.join("\n");
}

test("top-level help stays focused on core command surface", async () => {
  const output = await captureConsoleLog(() => runTopLevelCli(["help"]));

  assert.ok(output.includes('spark dict "<expression>" [options]'));
  assert.ok(output.includes("spark web [--port <port>]"));
  assert.ok(output.includes('spark style --text "<paragraph>" [--json]'));
  assert.ok(output.includes("spark x --help"));
  assert.ok(output.includes("spark studio"), "Expected spark studio to appear in top-level help");
  assert.ok(!output.includes("pipeline:input"));
});


test("experimental help stays namespaced under spark x", async () => {
  const output = await captureConsoleLog(() => runTopLevelCli(["x", "help"]));

  assert.ok(output.includes("Workflow Commands:"));
  assert.ok(output.includes("pipeline:input <filepath>"));
  assert.ok(output.includes("pipeline:input --file <path> [--focus <focus>] [--dry-run]"));
  assert.ok(output.includes("pipeline:output --text <text> [--dry-run]"));
  assert.ok(output.includes("review"));
  assert.ok(output.includes("batch:coach <dir>"));
});

test("pipeline input dry-run resolves source without API calls", async () => {
  const tempDir = fs.mkdtempSync(path.join(process.cwd(), "tmp-pipeline-input-"));
  const inputPath = path.join(tempDir, "article.md");

  try {
    fs.writeFileSync(inputPath, "# Demo\n\nRising prices take a toll on families.", "utf-8");

    const output = await captureConsoleLog(() =>
      runTopLevelCli(["x", "pipeline:input", "--file", inputPath, "--focus", "full", "--dry-run"]),
    );

    assert.ok(output.includes("[DRY RUN] spark x pipeline:input"));
    assert.ok(output.includes("sourceName: article.md"));
    assert.ok(output.includes("planned: Content Parser -> ExpressionCandidates -> Dictionary Pro -> ExpressionCard"));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("pipeline output dry-run keeps text arguments separate from flags", async () => {
  const output = await captureConsoleLog(() =>
    runTopLevelCli([
      "x",
      "pipeline:output",
      "I think technology is good.",
      "--provider",
      "siliconflow-minimax",
      "--dry-run",
    ]),
  );

  assert.ok(output.includes("[DRY RUN] spark x pipeline:output"));
  assert.ok(output.includes("provider: siliconflow-minimax"));
  assert.ok(output.includes("planned: TOEFL Coach -> WeakExpressionSet -> Dictionary Pro -> ExpressionCard"));
});

test("top-level app CLI stays isolated from pipeline and experimental implementation details", () => {
  const appCliSource = fs.readFileSync(path.join(process.cwd(), "src", "app-cli.ts"), "utf-8");

  assert.ok(appCliSource.includes('from "./experimental/cli"'));
  assert.ok(!appCliSource.includes('from "./pipelines/input-learning"'));
  assert.ok(!appCliSource.includes('from "./pipelines/output-correction"'));
  assert.ok(!appCliSource.includes('from "./experimental/dashboard"'));
});
