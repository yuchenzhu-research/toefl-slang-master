import fs from 'fs';
import path from 'path';
import { runPipelineOutput } from './pipeline-output';

export async function processBatchEssays(dirPath: string) {
  console.log(`>> [Batch Coach] Scanning directory: ${dirPath}`);
  if (!fs.existsSync(dirPath)) {
    throw new Error(`Directory not found: ${dirPath}`);
  }

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.txt') || f.endsWith('.md'));
  if (files.length === 0) {
    console.log(">> No .txt or .md files found for batch processing.");
    return;
  }

  console.log(`>> Found ${files.length} documents. Initiating bulk diagnosis...`);
  
  let successCount = 0;
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    try {
      const text = fs.readFileSync(fullPath, 'utf-8');
      console.log(`\n>> -------------------------------------`);
      console.log(`>> Processing: ${file}`);
      await runPipelineOutput(text, { provider: "openai" });
      successCount++;
    } catch (e: any) {
       console.error(`>> Failed to process ${file}: ${e.message}`);
    }
  }

  console.log(`\n>> [Batch Coach] Finished! Successfully processed ${successCount}/${files.length} documents.`);
}
