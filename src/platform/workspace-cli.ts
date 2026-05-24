import * as readline from "readline";
import {
  parseWorkspaceCommand,
  createCommandSubmittedEvent,
  createToolRunningEvent,
  createArtifactCreatedEvent,
  createWorkspaceCompleteEvent,
  normalizeDictionaryLookup
} from "./workspace-helpers";
import { WorkspaceCommandResult } from "./contracts";

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
    console.log(`[Event] [${evt1.type.toUpperCase()}] ${evt1.message}`);

    // 2. Evt: tool-running (dry-run)
    const evt2 = createToolRunningEvent("dictionary_lookup", "Running Dictionary Pro in dry-run mode...");
    console.log(`[Event] [${evt2.type.toUpperCase()}] ${evt2.message}`);

    // 3. Normalization (dry-run mode)
    const query = { id: commandId, text: args, dryRun: true };
    const result = normalizeDictionaryLookup(null, query);

    // 4. Evts: artifact created
    for (const art of result.artifacts) {
      const evtArt = createArtifactCreatedEvent(art.id, art.title);
      console.log(`[Event] [${evtArt.type.toUpperCase()}] ${evtArt.message}`);
    }

    // 5. Evt: complete
    const evtComp = createWorkspaceCompleteEvent();
    console.log(`[Event] [${evtComp.type.toUpperCase()}] ${evtComp.message}`);

    // 6. Print Artifact Summary
    console.log("\nGenerated Artifacts:");
    for (const art of result.artifacts) {
      console.log(`  - [${art.type.toUpperCase()}] ID: ${art.id} | Title: ${art.title}`);
      if (art.type === "markdown") {
        console.log("    Preview:");
        console.log("    ----------------------------------------------------");
        // Print first 5 lines of preview
        const lines = art.content.split("\n").slice(0, 5).map(l => `    ${l}`);
        console.log(lines.join("\n"));
        console.log("    ----------------------------------------------------");
      }
    }
    console.log();

    return result;
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
