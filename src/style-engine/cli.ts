import { analyzeEconomistStyle } from "./analyzer";
import { renderStyleAnalysis } from "./analyzer";

function printUsage(): void {
  const usage = `
SPARK Style Engine

Usage:
  spark style --text "<paragraph>" [--json]
  spark style "<paragraph>" [--json]

Options:
  --text     Text to analyze.
  --json     Print structured JSON.
  --help     Show help.
`;
  console.log(usage.trim());
}

export async function runStyleEngineCli(argv: string[]): Promise<void> {
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    printUsage();
    return;
  }

  const jsonOutput = argv.includes("--json");
  const text = readFlagValue(argv, "--text") ?? positionalArgs(argv).join(" ").trim();

  if (!text) {
    throw new Error("Missing text. Use --text or pass a paragraph.");
  }

  const result = analyzeEconomistStyle(text);
  process.stdout.write(jsonOutput ? JSON.stringify(result, null, 2) : renderStyleAnalysis(result));
  process.stdout.write("\n");
}

function readFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
}

function positionalArgs(args: string[]): string[] {
  const values: string[] = [];
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === "--json") {
      continue;
    }
    if (token.startsWith("-")) {
      if (token === "--text") index += 1;
      continue;
    }
    values.push(token);
  }
  return values;
}

if (require.main === module) {
  runStyleEngineCli(process.argv.slice(2)).catch((error) => {
    console.error("SPARK Style Engine error:", error.message);
    process.exit(1);
  });
}
