import * as readline from "readline";
import { getProviderCatalogEntry, listProviderCatalog } from "../providers/catalog";
import { Config, detectAvailableProviders, readConfig, writeConfig } from "./manager";

/**
 * Prompts the user to select a default provider from the detected available keys.
 * If only one is available, it is selected automatically.
 */
export async function resolveDefaultProvider(options: { forcePrompt?: boolean } = {}): Promise<string> {
  const config = readConfig();
  const available = detectAvailableProviders();

  // 1. If we already have a default and not forcing, use it
  if (config.defaultProvider && !options.forcePrompt) {
    return config.defaultProvider;
  }

  // 2. If no keys found in .env, we can't do much but we'll return a placeholder
  // and let the client throw the specific "Missing API key" error later.
  if (available.length === 0) {
    return "openai";
  }

  // 3. If exactly one key is found, use it automatically
  if (available.length === 1 && !options.forcePrompt) {
    const autoSelected = available[0];
    const updated: Config = { ...config, defaultProvider: autoSelected };
    writeConfig(updated);
    return autoSelected;
  }

  // 4. Multiple keys or forced prompt: SHOW THE SELECTOR
  console.log("\n  ✦ Multiple AI providers detected in your .env.");
  console.log("    Please select your preferred default:\n");

  const choice = await selectProviderMenu(available);
  
  const finalConfig: Config = { ...config, defaultProvider: choice };
  writeConfig(finalConfig);

  console.log(`\n  ✓ Default provider set to: ${choice}\n`);
  return choice;
}

async function selectProviderMenu(providers: string[]): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const displayList = providers.map((id) => {
    const entry = getProviderCatalogEntry(id);
    return { id, label: entry?.label ?? id };
  });

  displayList.forEach((p, i) => {
    console.log(`    [${i + 1}] ${p.label} (${p.id})`);
  });

  return new Promise((resolve) => {
    const ask = () => {
      rl.question(`\n  Select [1-${providers.length}]: `, (answer) => {
        const idx = parseInt(answer, 10) - 1;
        if (providers[idx]) {
          rl.close();
          resolve(providers[idx]);
        } else {
          console.log("  Invalid selection. Please try again.");
          ask();
        }
      });
    };
    ask();
  });
}
