import fs from "fs";
import path from "path";
import { runToeflWritingQuery } from "../toefl-writing/runner";
import { resolveToeflWritingSource } from "../toefl-writing/cli";
import { ToeflSlangClientOptions } from "../platform/client";
import { OutputManager } from "../platform/output-manager";

/**
 * Batch Process Orchestrator
 * Handles file looping and side effects for batch TOEFL coaching.
 */
export async function processBatchEssays(
  dirPath: string,
  clientOptions: ToeflSlangClientOptions = { provider: "openai" }
) {
  if (!fs.existsSync(dirPath)) {
    throw new Error(`Directory not found: ${dirPath}`);
  }

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md') || f.endsWith('.txt'));
  console.log(`>> [Batch Coach] Found ${files.length} files in ${dirPath}`);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const text = fs.readFileSync(filePath, 'utf-8');
    const slug = `batch-${path.basename(file, path.extname(file))}-${Date.now()}`;
    
    console.log(`>> [Batch Coach] Processing: ${file}...`);
    const result = await runToeflWritingQuery({
      query: { text },
      clientOptions,
      source: resolveToeflWritingSource({ text, filePath })
    });

    const outDir = OutputManager.getDiagnosisDir(slug);
    OutputManager.writeJson(path.join(outDir, "diagnosis.json"), result.structured);
    OutputManager.writeMarkdown(path.join(outDir, "report.md"), result.markdown);
  }

  console.log(">> [Batch Coach] Batch processing complete.");
}
