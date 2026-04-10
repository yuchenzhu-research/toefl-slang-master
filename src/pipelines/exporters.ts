import { OutputManager } from "../platform/output-manager";
import path from "path";
import fs from "fs";

/**
 * Knowledge Base Exporter Orchestrator
 * Handles side-effects for exporting cards to external formats.
 */

export async function exportAnkiCsv() {
  const cardsDir = path.join(process.cwd(), 'outputs', 'dict');
  if (!fs.existsSync(cardsDir)) {
    console.log("No dictionary cards found to export.");
    return;
  }

  const headwords = fs.readdirSync(cardsDir);
  let csvContent = "Word,Context,Translation,Academic,Tags\n";

  for (const hw of headwords) {
    const cardPath = path.join(cardsDir, hw, 'card.json');
    if (fs.existsSync(cardPath)) {
      const card = JSON.parse(fs.readFileSync(cardPath, 'utf-8'));
      const row = [
        `"${card.headword}"`,
        `"${card.context.replace(/"/g, '""')}"`,
        `"${card.translation}"`,
        `"${(card.academicAlignment || []).join('; ')}"`,
        `"${(card.tags || []).join(', ')}"`
      ].join(",");
      csvContent += row + "\n";
    }
  }

  const exportPath = path.join(process.cwd(), 'outputs', 'anki-export.csv');
  fs.writeFileSync(exportPath, csvContent, 'utf-8');
  console.log(`>> [Anki Export] Saved ${headwords.length} cards to ${exportPath}`);
}

export function runPrintExport() {
  const exportPath = path.join(process.cwd(), 'outputs', 'printable-study-sheet.md');
  console.log(">> [Print Export] Generating consolidated study sheet...");
  // Implementation logic for gathering all cards into one MD
  let sheet = "# TOEFL Slang Master - Consolidated Study Sheet\n\n";
  const cardsDir = path.join(process.cwd(), 'outputs', 'dict');
  
  if (fs.existsSync(cardsDir)) {
     const hws = fs.readdirSync(cardsDir);
     hws.forEach(hw => {
        const mdPath = path.join(cardsDir, hw, 'index.md');
        if (fs.existsSync(mdPath)) {
           const content = fs.readFileSync(mdPath, 'utf-8');
           sheet += `## ${hw}\n${content}\n\n---\n\n`;
        }
     });
  }

  fs.writeFileSync(exportPath, sheet, 'utf-8');
  console.log(`>> [Print Export] Saved to ${exportPath}`);
}
