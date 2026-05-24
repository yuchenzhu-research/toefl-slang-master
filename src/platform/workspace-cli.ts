import * as readline from "readline";
import * as fs from "fs";
import {
  parseWorkspaceCommand,
  createCommandSubmittedEvent,
  createToolRunningEvent,
  createArtifactCreatedEvent,
  createWorkspaceCompleteEvent,
  normalizeDictionaryLookup,
  createMarkdownArtifact,
  createWorkspaceErrorEvent,
  createErrorArtifact
} from "./workspace-helpers";
import { WorkspaceCommandResult } from "./contracts";
import { analyzeEconomistStyle, renderStyleAnalysis } from "../style-engine/analyzer";


/**
 * Renders a workspace event with a compact symbol and label suitable for CLI.
 */
export function renderWorkspaceEvent(evt: any): void {
  let symbol = " ";
  switch (evt.type) {
    case "command-submitted":
      symbol = "➜";
      break;
    case "backend-checking":
    case "tool-running":
      symbol = "⚙";
      break;
    case "artifact-created":
      symbol = "▤";
      break;
    case "complete":
      symbol = "✔";
      break;
    case "error":
      symbol = "✘";
      break;
  }
  const typeLabel = evt.type.toUpperCase();
  console.log(`[Event] [${typeLabel}]  ${symbol}  ${evt.message}`);
}

/**
 * Renders workspace artifacts with their titles, types, previews, or JSON summaries.
 */
export function renderWorkspaceArtifacts(artifacts: any[]): void {
  if (!artifacts || artifacts.length === 0) return;

  console.log("\nGenerated Artifacts:");
  for (const art of artifacts) {
    console.log(`  - [${art.type.toUpperCase()}] ID: ${art.id} | Title: ${art.title}`);
    if (art.type === "markdown") {
      console.log("    Preview:");
      console.log("    ----------------------------------------------------");
      const lines = art.content.split("\n").slice(0, 5).map((l: string) => `    ${l}`);
      console.log(lines.join("\n"));
      console.log("    ----------------------------------------------------");
    } else if (art.type === "json") {
      console.log("    Summary (JSON Sidecar Keys):");
      if (art.metadata) {
        const keys = Object.keys(art.metadata);
        console.log(`    Keys: ${keys.join(", ")}`);
        const entries = Object.entries(art.metadata)
          .slice(0, 5)
          .map(([k, v]) => `      ${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`);
        if (entries.length > 0) {
          console.log(entries.join("\n"));
        }
      } else {
        console.log("    (No metadata keys available)");
      }
    } else if (art.type === "error") {
      console.log(`    Error Message: ${art.content}`);
    }
  }
  console.log();
}


function createRl(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function ask(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
}

/**
 * Prints compact Claude Code-style help screen for workspace CLI.
 */
export function printWorkspaceHelp(): void {
  console.log("\nCommands:");
  console.log("  /dict <phrase>   Upgrade informal English to academic equivalent");
  console.log("  /style <text>    Analyze text for Economist-style features");
  console.log("  /coach <text>    Diagnose writing and get ETS-compatible score");
  console.log("  /content <file>  Parse reading material for vocabulary candidates");
  console.log("  /clear           Clear screen");
  console.log("  /exit            Exit session");
  console.log("\nExample:");
  console.log("  /dict a big deal\n");
}

/**
 * Executes a parsed workspace command and prints terminal outputs.
 */
export async function executeWorkspaceCliCommand(
  inputText: string
): Promise<WorkspaceCommandResult> {
  const parsed = parseWorkspaceCommand(inputText);
  const commandId = parsed.id;

  if (!parsed.parsed) {
    throw new Error("Empty command");
  }

  const { command, args } = parsed.parsed;

  if (command === "dict") {
    // 1. Evt: submitted
    const evt1 = createCommandSubmittedEvent(inputText);
    renderWorkspaceEvent(evt1);

    // 2. Evt: tool-running (dry-run)
    const evt2 = createToolRunningEvent("dictionary_lookup", "Running Dictionary Pro in dry-run mode...");
    renderWorkspaceEvent(evt2);

    // 3. Normalization (dry-run mode)
    const query = { id: commandId, text: args, dryRun: true };
    const result = normalizeDictionaryLookup(null, query);

    // 4. Evts: artifact created
    for (const art of result.artifacts) {
      const evtArt = createArtifactCreatedEvent(art.id, art.title);
      renderWorkspaceEvent(evtArt);
    }

    // 5. Evt: complete
    const evtComp = createWorkspaceCompleteEvent();
    renderWorkspaceEvent(evtComp);

    // 6. Print Artifact Summary
    renderWorkspaceArtifacts(result.artifacts);

    return result;
  }

  if (command === "style") {
    // 1. Evt: submitted
    const evt1 = createCommandSubmittedEvent(inputText);
    renderWorkspaceEvent(evt1);

    // 2. Evt: tool-running
    const evt2 = createToolRunningEvent("style_analyzer", "Analyzing Economist prose style...");
    renderWorkspaceEvent(evt2);

    // 3. Style analysis
    const analysisResult = analyzeEconomistStyle(args);
    const markdownContent = renderStyleAnalysis(analysisResult);

    // 4. Create Artifact
    const art = createMarkdownArtifact(
      "Style Analysis: Economist Profile",
      markdownContent
    );
    const evtArt = createArtifactCreatedEvent(art.id, art.title);
    renderWorkspaceEvent(evtArt);

    // 5. Evt: complete
    const evtComp = createWorkspaceCompleteEvent();
    renderWorkspaceEvent(evtComp);

    // 6. Print Compact Result Summary
    console.log("\nStyle Analysis Result Summary:");
    console.log(`  - Overall Score: ${analysisResult.overallScore}/100`);
    console.log(`  - Summary: ${analysisResult.summary}`);
    if (analysisResult.suggestions.length > 0) {
      console.log("  - Top Suggestion:");
      console.log(`    [${analysisResult.suggestions[0].priority}] ${analysisResult.suggestions[0].issue}: ${analysisResult.suggestions[0].action}`);
    }
    console.log();

    renderWorkspaceArtifacts([art]);

    return {
      commandId,
      status: "success",
      artifacts: [art]
    };
  }

  if (command === "coach") {
    // 1. Evt: submitted
    const evt1 = createCommandSubmittedEvent(inputText);
    renderWorkspaceEvent(evt1);

    // 2. Evt: tool-running
    const evt2 = createToolRunningEvent("toefl_coach", "Running TOEFL Coach in dry-run mode...");
    renderWorkspaceEvent(evt2);

    // 3. Dry-run planned workflow summary output
    console.log("[DRY RUN] /coach");
    console.log("planned: TOEFL Coach -> WeakExpressionSet -> Dictionary Pro -> ExpressionCard");

    // 4. Create Artifact
    const art = createMarkdownArtifact(
      "TOEFL Coach Diagnosis (Dry Run)",
      `# TOEFL Coach Diagnosis (Dry Run)\n\nInput text: "${args}"\n\nPlanned workflow:\nTOEFL Coach -> WeakExpressionSet -> Dictionary Pro -> ExpressionCard`
    );
    const evtArt = createArtifactCreatedEvent(art.id, art.title);
    renderWorkspaceEvent(evtArt);

    // 5. Evt: complete
    const evtComp = createWorkspaceCompleteEvent();
    renderWorkspaceEvent(evtComp);

    // 6. Print Artifact Summary
    renderWorkspaceArtifacts([art]);

    return {
      commandId,
      status: "success",
      artifacts: [art]
    };
  }

  if (command === "content") {
    // 1. Evt: submitted
    const evt1 = createCommandSubmittedEvent(inputText);
    renderWorkspaceEvent(evt1);

    // 2. Validate path
    if (!args) {
      const errorMsg = "File path is required";
      const evtErr = createWorkspaceErrorEvent(errorMsg);
      renderWorkspaceEvent(evtErr);

      const art = createErrorArtifact("Content Parsing Error", errorMsg);
      renderWorkspaceArtifacts([art]);

      return {
        commandId,
        status: "error",
        artifacts: [art],
        error: errorMsg
      };
    }

    if (!fs.existsSync(args)) {
      const errorMsg = `File not found: ${args}`;
      const evtErr = createWorkspaceErrorEvent(errorMsg);
      renderWorkspaceEvent(evtErr);

      const art = createErrorArtifact("Content Parsing Error", errorMsg);
      renderWorkspaceArtifacts([art]);

      return {
        commandId,
        status: "error",
        artifacts: [art],
        error: errorMsg
      };
    }

    // 3. Evt: tool-running
    const evt2 = createToolRunningEvent("content_parser", "Running Content Parser in dry-run mode...");
    renderWorkspaceEvent(evt2);

    // 4. Dry-run planned workflow summary output
    console.log("[DRY RUN] /content");
    console.log("planned: Content Parser -> ExpressionCandidates -> Dictionary Pro -> ExpressionCard");

    // 5. Create Artifact
    const art = createMarkdownArtifact(
      "Content Digest (Dry Run)",
      `# Content Digest (Dry Run)\n\nFile parsed: "${args}"\n\nPlanned workflow:\nContent Parser -> ExpressionCandidates -> Dictionary Pro -> ExpressionCard`
    );
    const evtArt = createArtifactCreatedEvent(art.id, art.title);
    renderWorkspaceEvent(evtArt);

    // 6. Evt: complete
    const evtComp = createWorkspaceCompleteEvent();
    renderWorkspaceEvent(evtComp);

    // 7. Print Artifact Summary
    renderWorkspaceArtifacts([art]);

    return {
      commandId,
      status: "success",
      artifacts: [art]
    };
  }

  // Fallback for non-dict commands
  return {
    commandId,
    status: "success",
    artifacts: []
  };
}

/**
 * Runs the interactive workspace CLI loop.
 * Invoked when spark is run with no arguments.
 */
export async function runWorkspaceCli(): Promise<void> {
  console.log("===============================================================");
  console.log("  SPARK Agent Workspace CLI (v1.0.0)");
  console.log("  Type /help to see available commands, or /exit to quit.");
  console.log("===============================================================");

  if (process.env.SPARK_TEST_MODE === "true") {
    console.log("  [TEST MODE] Exiting workspace CLI loop immediately.");
    return;
  }

  const rl = createRl();

  try {
    while (true) {
      const input = await ask(rl, "spark> ");
      const parsedCmd = parseWorkspaceCommand(input);

      if (!parsedCmd.parsed) {
        // Empty input
        console.log("  (Enter a command, e.g. /dict a big deal or /help)");
        continue;
      }

      const { command, args } = parsedCmd.parsed;

      if (command === "exit") {
        console.log("  Exiting workspace session. Goodbye!");
        break;
      }

      if (command === "help") {
        printWorkspaceHelp();
        continue;
      }

      if (command === "clear") {
        console.clear();
        continue;
      }

      if (command === "dict") {
        await executeWorkspaceCliCommand(input);
        continue;
      }

      if (command === "style") {
        await executeWorkspaceCliCommand(input);
        continue;
      }

      if (command === "coach") {
        await executeWorkspaceCliCommand(input);
        continue;
      }

      if (command === "content") {
        await executeWorkspaceCliCommand(input);
        continue;
      }

      if (command === "unknown") {
        console.log(`  ✗ Unknown command "${parsedCmd.text}". Type /help to see supported commands.`);
        continue;
      }

      // Skeleton response for valid commands
      console.log(`  [Workspace] Received command /${command} with arguments: "${args}"`);
      console.log("  (Command running skeleton completed)");
    }
  } finally {
    rl.close();
  }
}
