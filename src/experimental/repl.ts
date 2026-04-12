import * as readline from 'readline';
import { runPipelineOutput } from '../pipelines/output-correction';

export async function startRepl() {
  console.log("\n========================================================");
  console.log("            ⚡ SPARK - CONTINUOUS REPL ⚡            ");
  console.log("========================================================");
  console.log(" Type any paragraph or sentence to have it instantly");
  console.log(" processed by the TOEFL Coach & Dictionary pipelines.");
  console.log(" Press Ctrl+C to exit.");
  console.log("========================================================\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '📝 SPARK » '
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();
    if (!input) {
      rl.prompt();
      return;
    }

    try {
      console.log(`\n>> Evaluating input...`);
      await runPipelineOutput(input, { provider: "openai" });
      console.log(`>> Pipeline execution completed successfully.\n`);
    } catch (e: any) {
      console.error(`\n[!] Error during pipeline evaluation: ${e.message}\n`);
    }

    rl.prompt();
  }).on('close', () => {
    console.log('\n>> Exiting REPL. Keep hustling!\n');
    process.exit(0);
  });
}
