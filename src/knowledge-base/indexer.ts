import fs from 'fs';
import path from 'path';
import { OutputManager } from '../platform/output-manager';

const DATA_ROOT = path.join(process.cwd(), 'data');

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
  const diagDir = path.join(DATA_ROOT, 'diagnoses');
  const diagSlugs = getDirectories(diagDir);
  OutputManager.writeJson(path.join(indexesDir, 'diagnoses.json'), {
    lastIndexed: new Date().toISOString(),
    totalFound: diagSlugs.length,
    slugs: diagSlugs,
  });

  // 3. Index cards (traverse cards/[register]/[category]/[headword])
  const cardsDir = path.join(DATA_ROOT, 'cards');
  const registers = getDirectories(cardsDir);
  let totalCards = 0;
  const cardIndex: Record<string, any> = {};

  for (const reg of registers) {
    const categories = getDirectories(path.join(cardsDir, reg));
    cardIndex[reg] = {};
    for (const cat of categories) {
      const headwords = getDirectories(path.join(cardsDir, reg, cat));
      cardIndex[reg][cat] = headwords;
      totalCards += headwords.length;
    }
  }

  OutputManager.writeJson(path.join(indexesDir, 'cards.json'), {
    lastIndexed: new Date().toISOString(),
    totalFound: totalCards,
    hierarchy: cardIndex,
  });

  console.log(`>> [Knowledge Base] Indexed ${sourceSlugs.length} sources, ${diagSlugs.length} diagnoses, ${totalCards} cards.`);
}
