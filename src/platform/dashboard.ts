import fs from 'fs';
import path from 'path';

export function renderDashboard() {
  console.log("\n========================================================");
  console.log("       TOEFL SLANG MASTER - KNOWLEDGE DASHBOARD         ");
  console.log("========================================================\n");

  const idxPath = path.join(process.cwd(), 'outputs', 'indexes', 'cards.json');
  if (!fs.existsSync(idxPath)) {
    console.log("    [!] No indexes found. Run pipeline or rebuild.");
    console.log("========================================================\n");
    return;
  }

  const indexData = JSON.parse(fs.readFileSync(idxPath, 'utf-8'));
  const headwords = indexData.slugs || [];
  
  console.log(`    Total Expression Cards    : ${indexData.totalFound} `);
  console.log(`    Last Rebuilt              : ${indexData.lastIndexed} `);
  console.log("");
  
  // ASCII Bar graph for fun
  const barLen = Math.min(indexData.totalFound, 40);
  const bar = "█".repeat(barLen);
  console.log(`    Coverage: [${bar.padEnd(40, ' ')}]`);

  console.log("\n    Recent Cards:");
  headwords.slice(0, 5).forEach((hw: string, i: number) => {
    console.log(`      ${i + 1}. ${hw}`);
  });
  if (headwords.length > 5) {
     console.log(`      ... and ${headwords.length - 5} more.`);
  }

  console.log("\n========================================================\n");
}
