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
  assert.ok(output.includes("spark x --help"));
  assert.ok(!output.includes("pipeline:input"));
});

test("experimental help stays namespaced under spark x", async () => {
  const output = await captureConsoleLog(() => runTopLevelCli(["x", "help"]));

  assert.ok(output.includes("Workflow Commands:"));
  assert.ok(output.includes("pipeline:input <filepath>"));
  assert.ok(output.includes("review"));
  assert.ok(output.includes("batch:coach <dir>"));
});

test("top-level app CLI stays isolated from pipeline and experimental implementation details", () => {
  const appCliSource = fs.readFileSync(path.join(process.cwd(), "src", "app-cli.ts"), "utf-8");

  assert.ok(appCliSource.includes('from "./experimental/cli"'));
  assert.ok(!appCliSource.includes('from "./pipelines/input-learning"'));
  assert.ok(!appCliSource.includes('from "./pipelines/output-correction"'));
  assert.ok(!appCliSource.includes('from "./experimental/dashboard"'));
});
