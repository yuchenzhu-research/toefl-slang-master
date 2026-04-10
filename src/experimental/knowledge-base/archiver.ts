import fs from 'fs';
import path from 'path';
import { OutputManager } from '../../platform/output-manager';

export function archiveCards() {
  console.log("\n>> [Archiver] Scanning dictionary for mastered cards...");
  const dictDir = path.join(process.cwd(), 'outputs', 'dict');
  if (!fs.existsSync(dictDir)) {
    console.log("   [!] Dictionary is empty.");
    return;
  }

  const archiveDir = path.join(process.cwd(), 'outputs', 'archive');
  OutputManager.ensureDir(archiveDir);

  const headwords = fs.readdirSync(dictDir);
  let archivedCount = 0;

  for (const hw of headwords) {
    const cardDir = path.join(dictDir, hw);
    const cardPath = path.join(cardDir, 'card.json');
    if (fs.existsSync(cardPath)) {
      const card = JSON.parse(fs.readFileSync(cardPath, 'utf-8'));
      if (card.srsData && card.srsData.repetitions >= 5 && card.srsData.efactor >= 2.5) {
        fs.renameSync(cardDir, path.join(archiveDir, hw));
        archivedCount++;
      }
    }
  }

  console.log(`>> Successfully moved ${archivedCount} mastered cards to the archive.`);
}
