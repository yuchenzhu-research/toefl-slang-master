import fs from 'fs';
import path from 'path';
import { OutputManager } from '../platform/output-manager';
import { ExpressionCard } from '../platform/contracts';

export function buildSynonymsGraph() {
  console.log(">> [Graph Builder] Traversing dictionary to build synonym graph...");
  const dictDir = path.join(process.cwd(), 'outputs', 'dict');
  if (!fs.existsSync(dictDir)) {
    console.log("   [!] Dictionary is empty. Cannot build graph.");
    return;
  }

  const headwords = fs.readdirSync(dictDir);
  const graph: Record<string, string[]> = {};
  const allCards: ExpressionCard[] = [];

  for (const hw of headwords) {
    const cardPath = path.join(dictDir, hw, 'card.json');
    if (fs.existsSync(cardPath)) {
      const card = JSON.parse(fs.readFileSync(cardPath, 'utf-8'));
      allCards.push(card);
      graph[hw] = [];
    }
  }

  // Cross-reference alignments and slangs
  for (let i = 0; i < allCards.length; i++) {
    for (let j = i + 1; j < allCards.length; j++) {
      const c1 = allCards[i];
      const c2 = allCards[j];
      
      const shareTags = c1.tags.some(t => c2.tags.includes(t));
      const shareAlignment = c1.academicAlignment.some(a => c2.academicAlignment.includes(a));
      
      if (shareTags || shareAlignment) {
        graph[c1.headword].push(c2.headword);
        graph[c2.headword].push(c1.headword);
      }
    }
  }

  const exportDir = path.join(process.cwd(), 'outputs', 'indexes');
  OutputManager.ensureDir(exportDir);
  fs.writeFileSync(path.join(exportDir, 'graph.json'), JSON.stringify(graph, null, 2), 'utf-8');
  console.log(`>> [Graph Builder] Linked ${Object.keys(graph).length} nodes into 'outputs/indexes/graph.json'`);
}
