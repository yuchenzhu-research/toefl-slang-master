import * as readline from "readline";
import { parseWorkspaceCommand } from "./workspace-helpers";

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
        console.log("\n  Supported Workspace Commands:");
        console.log("    /dict <phrase>    - Look up slang/informal English and convert to academic equivalents");
        console.log("    /style <text>     - Analyze text prose and Economist style features");
        console.log("    /coach <essay>    - Diagnose writing quality and ETS-compatible scoring");
        console.log("    /content <path>   - Extract reading materials and vocabulary candidates");
        console.log("    /clear            - Clear the terminal screen");
        console.log("    /exit             - Quit the workspace session\n");
        continue;
      }

      if (command === "clear") {
        console.clear();
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
