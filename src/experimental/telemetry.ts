import fs from 'fs';
import path from 'path';
import { OutputManager } from '../platform/output-manager';

const telPath = path.join(process.cwd(), 'outputs', 'indexes', 'telemetry.json');

export class Telemetry {
  static logUsage(provider: string, model: string, promptTokens: number, completionTokens: number) {
    OutputManager.ensureDir(path.parse(telPath).dir);
    let data: any = { providers: {}, totalTokens: 0 };
    
    if (fs.existsSync(telPath)) {
      data = JSON.parse(fs.readFileSync(telPath, 'utf-8'));
    }

    if (!data.providers[provider]) {
      data.providers[provider] = { calls: 0, promptTokens: 0, completionTokens: 0 };
    }

    data.providers[provider].calls += 1;
    data.providers[provider].promptTokens += promptTokens;
    data.providers[provider].completionTokens += completionTokens;
    data.totalTokens += (promptTokens + completionTokens);

    fs.writeFileSync(telPath, JSON.stringify(data, null, 2), 'utf-8');
  }

  static printReport() {
    if (!fs.existsSync(telPath)) {
      console.log(">> [Telemetry] No API usage tracked yet.");
      return;
    }
    const data = JSON.parse(fs.readFileSync(telPath, 'utf-8'));
    console.log(`\n📈 API Telemetry Dashboard`);
    console.log(`=============================`);
    console.log(`Total Tokens Processed: ${data.totalTokens}\n`);
    for (const p of Object.keys(data.providers)) {
       const pd = data.providers[p];
       console.log(`[${p}] Calls: ${pd.calls} | Prompt: ${pd.promptTokens} | Completion: ${pd.completionTokens}`);
    }
    console.log("");
  }
}
