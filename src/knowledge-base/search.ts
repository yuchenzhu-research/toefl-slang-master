import fs from 'fs';
import path from 'path';

export function runGlobalSearch(keyword: string) {
  console.log(`\n>> [Fast Search] Scanning dictionary for "${keyword}"...`);
  
  const dictDir = path.join(process.cwd(), 'outputs', 'dict');
  if (!fs.existsSync(dictDir)) {
    console.log("   [!] Dictionary is empty.");
    return;
  }

  const headwords = fs.readdirSync(dictDir);
  const results: any[] = [];

  for (const hw of headwords) {
    const cardPath = path.join(dictDir, hw, 'card.json');
    if (fs.existsSync(cardPath)) {
      const content = fs.readFileSync(cardPath, 'utf-8');
      if (content.toLowerCase().includes(keyword.toLowerCase())) {
         const card = JSON.parse(content);
         results.push(card);
      }
    }
  }

  if (results.length === 0) {
    console.log(`>> No records found matching "${keyword}".`);
    return;
  }

  console.log(`\n>> Found ${results.length} matches:\n`);
  results.forEach((c, idx) => {
    console.log(`${idx + 1}. [Headword]: ${c.headword}`);
    console.log(`   [Context ]: ${c.context}`);
    console.log(`   [Aligns  ]: ${c.academicAlignment.join(', ')}\n`);
  });
}
