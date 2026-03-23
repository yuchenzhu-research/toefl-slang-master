import "dotenv/config";

import { runDictionaryProModuleCli } from "./dictionary-pro";

export * from "./dictionary-pro";

async function main() {
  await runDictionaryProModuleCli(process.argv.slice(2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Dictionary Pro error:", error.message);
    process.exit(1);
  });
}
