import "dotenv/config";

import { runDictionaryProCli } from "./dictionary-pro/cli";
import { runDictionaryProEvalCli } from "./dictionary-pro/eval-cli";

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0) {
    await runDictionaryProCli(["--help"]);
    return;
  }

  const [command, ...rest] = argv;

  if (command === "eval") {
    await runDictionaryProEvalCli(rest);
    return;
  }

  if (command === "providers") {
    await runDictionaryProCli(["--list-providers"]);
    return;
  }

  await runDictionaryProCli(argv);
}

main().catch((error) => {
  console.error("Dictionary Pro error:", error.message);
  process.exit(1);
});
