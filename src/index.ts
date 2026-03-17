import { runDictionaryProCli } from "./dictionary-pro/cli";

async function main() {
  const argv = process.argv.slice(2);
  const effectiveArgs = argv.length === 0 ? ["--help"] : argv;

  await runDictionaryProCli(effectiveArgs);
}

main().catch((error) => {
  console.error("Dictionary Pro error:", error.message);
  process.exit(1);
});
