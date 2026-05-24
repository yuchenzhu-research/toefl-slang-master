import test from "node:test";
import assert from "node:assert";
import fs from "fs";
import path from "path";
import { runTopLevelCli } from "../src/app-cli";
import { printWorkspaceHelp, executeWorkspaceCliCommand } from "../src/platform/workspace-cli";

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

test("bare spark CLI with no arguments enters workspace CLI mode", async () => {
  process.env.SPARK_TEST_MODE = "true";
  try {
    const output = await captureConsoleLog(() => runTopLevelCli([]));
    assert.ok(output.includes("SPARK Agent Workspace CLI"));
    assert.ok(output.includes("[TEST MODE] Exiting workspace CLI loop immediately."));
  } finally {
    delete process.env.SPARK_TEST_MODE;
  }
});

test("workspace CLI help lists all supported commands and dict example", async () => {
  const output = await captureConsoleLog(async () => printWorkspaceHelp());

  assert.ok(output.includes("/dict <phrase>"));
  assert.ok(output.includes("/style <text>"));
  assert.ok(output.includes("/coach <text>"));
  assert.ok(output.includes("/content <file>"));
  assert.ok(output.includes("/clear"));
  assert.ok(output.includes("/exit"));
  assert.ok(output.includes("/dict a big deal"));
});

test("workspace CLI executes /dict in dry-run mode and prints events and summary", async () => {
  const output = await captureConsoleLog(async () => {
    await executeWorkspaceCliCommand("/dict piece of cake");
  });

  assert.ok(output.includes("[Event] [COMMAND-SUBMITTED]"));
  assert.ok(output.includes("Submitted command: /dict piece of cake"));
  assert.ok(output.includes("[Event] [TOOL-RUNNING]"));
  assert.ok(output.includes("Running Dictionary Pro in dry-run mode..."));
  assert.ok(output.includes("[Event] [ARTIFACT-CREATED]"));
  assert.ok(output.includes("Created artifact 'Expression Card: piece of cake (Dry Run)'"));
  assert.ok(output.includes("[Event] [COMPLETE]"));
  assert.ok(output.includes("Generated Artifacts:"));
  assert.ok(output.includes("- [MARKDOWN] ID: art-"));
  assert.ok(output.includes("Title: Expression Card: piece of cake (Dry Run)"));
});

