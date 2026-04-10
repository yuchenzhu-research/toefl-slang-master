import fs from 'fs';
import path from 'path';

const CANONICAL_OUTPUT_ROOT = path.join(process.cwd(), 'outputs');

export class OutputManager {
  static ensureDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  // Pipeline 1 Base Output Dir
  static getContentDir(slug: string) {
    const dir = path.join(CANONICAL_OUTPUT_ROOT, 'content', slug);
    this.ensureDir(dir);
    return dir;
  }

  // Pipeline 2 Base Output Dir
  static getDiagnosisDir(slug: string) {
    const dir = path.join(CANONICAL_OUTPUT_ROOT, 'coach', slug);
    this.ensureDir(dir);
    return dir;
  }

  // Single dictionary card path
  static getCardDir(targetRegister: string, category: string, headword: string) {
    const safeHeadword = headword.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
    const dir = path.join(CANONICAL_OUTPUT_ROOT, 'dict', safeHeadword);
    this.ensureDir(dir);
    return dir;
  }

  static writeJson(filepath: string, data: any) {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  }

  static writeMarkdown(filepath: string, content: string) {
    fs.writeFileSync(filepath, content, 'utf-8');
  }

  /**
   * Phase 4: Unified Sidecar Savers
   */

  static saveDictionaryCard(card: any, markdown: string) {
    const dir = this.getCardDir("general", "uncategorized", card.headword);
    this.writeJson(path.join(dir, "card.json"), card);
    this.writeMarkdown(path.join(dir, "index.md"), markdown);
    return dir;
  }

  static saveCoachDiagnosis(slug: string, diagnosis: any, markdown: string) {
    const dir = this.getDiagnosisDir(slug);
    this.writeJson(path.join(dir, "diagnosis.json"), diagnosis);
    this.writeMarkdown(path.join(dir, "report.md"), markdown);
    return dir;
  }

  static saveContentDigest(slug: string, digest: any, markdown: string) {
    const dir = this.getContentDir(slug);
    this.writeJson(path.join(dir, "source.json"), digest);
    this.writeMarkdown(path.join(dir, "source.md"), markdown);
    return dir;
  }
}
