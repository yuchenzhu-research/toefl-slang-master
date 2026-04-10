import fs from 'fs';
import path from 'path';
import { OutputManager } from '../platform/output-manager';

const DATA_ROOT = path.join(process.cwd(), 'outputs');

/**
 * Utility to safely fetch top-level directories
 */
function getDirectories(basePath: string): string[] {
  if (!fs.existsSync(basePath)) return [];
  return fs.readdirSync(basePath).filter(f => fs.statSync(path.join(basePath, f)).isDirectory());
}

/**
 * 遍历生成的本地数据并建立汇总索引 (MVP)
 */
export function indexKnowledgeBase() {
  console.log(">> [Knowledge Base] Rebuilding local indexes...");
  const indexesDir = path.join(DATA_ROOT, 'indexes');
  OutputManager.ensureDir(indexesDir);

  // 1. Index sources
  const contentDir = path.join(DATA_ROOT, 'content');
  const sourceSlugs = getDirectories(contentDir);
  OutputManager.writeJson(path.join(indexesDir, 'sources.json'), {
    lastIndexed: new Date().toISOString(),
    totalFound: sourceSlugs.length,
    slugs: sourceSlugs,
  });

  // 2. Index diagnoses
  const diagDir = path.join(DATA_ROOT, 'coach');
  const diagSlugs = getDirectories(diagDir);
  OutputManager.writeJson(path.join(indexesDir, 'diagnoses.json'), {
    lastIndexed: new Date().toISOString(),
    totalFound: diagSlugs.length,
    slugs: diagSlugs,
  });

  // 3. Index cards (traverse dict/[headword])
  const cardsDir = path.join(DATA_ROOT, 'dict');
  const headwords = getDirectories(cardsDir);
  const totalCards = headwords.length;

  OutputManager.writeJson(path.join(indexesDir, 'cards.json'), {
    lastIndexed: new Date().toISOString(),
    totalFound: totalCards,
    slugs: headwords,
  });

  console.log(`>> [Knowledge Base] Indexed ${sourceSlugs.length} sources, ${diagSlugs.length} diagnoses, ${totalCards} cards.`);
}
