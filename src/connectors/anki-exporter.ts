import fs from 'fs';
import path from 'path';
import { OutputManager } from '../platform/output-manager';
import { ExpressionCard } from '../platform/contracts';

export async function exportAnkiCsv() {
  console.log(">> [Anki Exporter] Compiling all dictionary cards...");
  const dictDir = path.join(process.cwd(), 'outputs', 'dict');
  if (!fs.existsSync(dictDir)) {
    throw new Error('No dictionary cards found.');
  }

  const exportDir = path.join(process.cwd(), 'outputs', 'exports');
  OutputManager.ensureDir(exportDir);
  const csvPath = path.join(exportDir, 'anki_deck.csv');

  const headwords = fs.readdirSync(dictDir);
  let csvContent = "Headword,Translation,Context,Slang/Informal,Frequency,Analysis,Tags\n";

  for (const hw of headwords) {
    const cardPath = path.join(dictDir, hw, 'card.json');
    if (fs.existsSync(cardPath)) {
      const card: ExpressionCard = JSON.parse(fs.readFileSync(cardPath, 'utf-8'));
      
      const escape = (str: string) => `"${str.replace(/"/g, '""')}"`;
      
      const row = [
        escape(card.headword),
        escape(card.translation),
        escape(card.context),
        escape(card.slangOrInformal.join(' / ')),
        escape(card.frequency),
        escape(card.analysis),
        escape(card.tags.join(' '))
      ].join(',');

      csvContent += row + '\n';
    }
  }

  fs.writeFileSync(csvPath, csvContent, 'utf-8');
  console.log(`>> [Anki Exporter] Exported ${headwords.length} cards to ${csvPath}`);
}
