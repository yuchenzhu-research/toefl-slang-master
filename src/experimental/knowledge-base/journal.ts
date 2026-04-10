import fs from 'fs';
import path from 'path';
import { OutputManager } from '../platform/output-manager';
import { ExpressionCard } from '../platform/contracts';

export function buildWeeklyJournal() {
  console.log(">> [Journal Generator] Aggregating weekly cards...");
  const dictDir = path.join(process.cwd(), 'outputs', 'dict');
  if (!fs.existsSync(dictDir)) {
    console.log("   [!] Dictionary is empty.");
    return;
  }

  const headwords = fs.readdirSync(dictDir);
  const now = Date.now();
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

  const validCards: ExpressionCard[] = [];

  for (const hw of headwords) {
    const cardPath = path.join(dictDir, hw, 'card.json');
    if (fs.existsSync(cardPath)) {
      const stat = fs.statSync(cardPath);
      if (now - stat.birthtimeMs <= ONE_WEEK_MS || now - stat.mtimeMs <= ONE_WEEK_MS) {
        validCards.push(JSON.parse(fs.readFileSync(cardPath, 'utf-8')));
      }
    }
  }

  if (validCards.length === 0) {
    console.log(">> No new expressions captured this week. Keep reading!");
    return;
  }

  const outDir = path.join(process.cwd(), 'outputs', 'journals');
  OutputManager.ensureDir(outDir);
  const dateStr = new Date().toISOString().split('T')[0];
  const journalPath = path.join(outDir, `weekly-${dateStr}.md`);

  let md = `# TOEFL Slang Master - Weekly Digest (${dateStr})\n\n`;
  md += `## You have accumulated ${validCards.length} new expressions this week!\n\n`;

  validCards.forEach(c => {
    md += `### ${c.headword}\n`;
    md += `- **Meaning Context**: ${c.context}\n`;
    md += `- **Translation**: ${c.translation}\n`;
    md += `- **Upgraded From**: ${c.slangOrInformal.join(', ')}\n`;
    md += `- **Alternatives**: ${c.academicAlignment.join(', ')}\n\n`;
  });

  fs.writeFileSync(journalPath, md, 'utf-8');
  console.log(`>> [Journal Generator] Compiled beautiful weekly review at outputs/journals/weekly-${dateStr}.md`);
}
