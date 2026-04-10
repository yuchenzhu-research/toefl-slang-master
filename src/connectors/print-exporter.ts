import fs from 'fs';
import path from 'path';
import { OutputManager } from '../platform/output-manager';

export function runPrintExport() {
  console.log(">> [Print Exporter] Flattening dictionary into a single printable Markdown file...");
  
  const dictDir = path.join(process.cwd(), 'outputs', 'dict');
  if (!fs.existsSync(dictDir)) {
    console.log("   [!] Dictionary is empty.");
    return;
  }

  const exportDir = path.join(process.cwd(), 'outputs', 'exports');
  OutputManager.ensureDir(exportDir);
  const printDocPath = path.join(exportDir, 'printable_book.md');

  const headwords = fs.readdirSync(dictDir);
  let md = `# TOEFL Slang Master - Comprehensive Print Edition\n\n`;
  md += `*(Generated on ${new Date().toISOString().split('T')[0]})*\n\n---\n\n`;

  for (const hw of headwords) {
    const cardPath = path.join(dictDir, hw, 'card.json');
    if (fs.existsSync(cardPath)) {
      const c = JSON.parse(fs.readFileSync(cardPath, 'utf-8'));
      md += `## 📚 ${c.headword}\n`;
      md += `**Translation**: ${c.translation}\n\n`;
      md += `> **Source Context**:\n> ${c.context}\n\n`;
      md += `- **Common/Slang**: ${c.slangOrInformal.join(', ')}\n`;
      md += `- **Academic Alignments**: ${c.academicAlignment.join(' / ')}\n`;
      md += `- **Deep Analysis**: ${c.analysis}\n\n---\n\n`;
    }
  }

  fs.writeFileSync(printDocPath, md, 'utf-8');
  console.log(`>> [Print Exporter] Bound ${headwords.length} cards into PDF-ready Markdown at outputs/exports/printable_book.md`);
}
