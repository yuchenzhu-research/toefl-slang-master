import * as fs from "fs";
import * as path from "path";

type InitResult = {
  cwd: string;
  envExamplePath: string;
  envPath: string;
  created: boolean;
  overwritten: boolean;
  skipped: boolean;
  message: string;
  nextSteps: string[];
};

function printUsage(): void {
  const usage = `
TOEFL Slang Master Init

Usage:
  tsm init
  tsm init --force
  tsm init --json

Options:
  --force   Overwrite an existing .env with .env.example.
  --json    Print machine-readable JSON output.
  --help    Show help.
`;

  console.log(usage.trim());
}

export function runInitCli(argv: string[]): void {
  if (argv.includes("--help") || argv.includes("-h")) {
    printUsage();
    return;
  }

  const force = argv.includes("--force");
  const jsonOutput = argv.includes("--json");
  const result = runInit(force);
  const output = jsonOutput ? JSON.stringify(result, null, 2) : formatInitResult(result);
  process.stdout.write(`${output}\n`);
}

function runInit(force: boolean): InitResult {
  const cwd = process.cwd();
  const envExamplePath = path.join(cwd, ".env.example");
  const envPath = path.join(cwd, ".env");

  if (!fs.existsSync(envExamplePath)) {
    return {
      cwd,
      envExamplePath,
      envPath,
      created: false,
      overwritten: false,
      skipped: true,
      message: "Missing .env.example in the project root.",
      nextSteps: [
        "Add a root .env.example file first.",
      ],
    };
  }

  if (fs.existsSync(envPath) && !force) {
    return {
      cwd,
      envExamplePath,
      envPath,
      created: false,
      overwritten: false,
      skipped: true,
      message: "Skipped because .env already exists.",
      nextSteps: [
        "Edit .env and fill in the provider API key you plan to use.",
        "Run: npm run doctor",
        "Run: tsm dict \"gonna\" --provider openai --mode conversion --target toefl-writing",
      ],
    };
  }

  fs.copyFileSync(envExamplePath, envPath);

  return {
    cwd,
    envExamplePath,
    envPath,
    created: !force,
    overwritten: force,
    skipped: false,
    message: force ? "Overwrote .env from .env.example." : "Created .env from .env.example.",
    nextSteps: [
      "Edit .env and fill in the provider API key you plan to use.",
      "Run: npm run doctor",
      "Run: tsm dict \"gonna\" --provider openai --mode conversion --target toefl-writing",
    ],
  };
}

function formatInitResult(result: InitResult): string {
  const lines = [
    "TOEFL Slang Master Init",
    `cwd: ${result.cwd}`,
    `envExample: ${result.envExamplePath}`,
    `env: ${result.envPath}`,
    "",
    result.message,
    "",
    "Next steps:",
  ];

  for (const step of result.nextSteps) {
    lines.push(`- ${step}`);
  }

  return lines.join("\n");
}

if (require.main === module) {
  try {
    runInitCli(process.argv.slice(2));
  } catch (error) {
    console.error("TOEFL Slang Master Init error:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
