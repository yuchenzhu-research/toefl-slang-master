import fs from 'fs';
import path from 'path';

const DATA_ROOT = path.join(process.cwd(), 'outputs');

export class OutputManager {
  static ensureDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  // Pipeline 1 Base Output Dir
  static getContentDir(slug: string) {
    const dir = path.join(DATA_ROOT, 'content', slug);
    this.ensureDir(dir);
    return dir;
  }

  // Pipeline 2 Base Output Dir
  static getDiagnosisDir(slug: string) {
    const dir = path.join(DATA_ROOT, 'coach', slug);
    this.ensureDir(dir);
    return dir;
  }

  // Single dictionary card path
  static getCardDir(targetRegister: string, category: string, headword: string) {
    const safeHeadword = headword.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
    const dir = path.join(DATA_ROOT, 'dict', safeHeadword);
    this.ensureDir(dir);
    return dir;
  }

  static writeJson(filepath: string, data: any) {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  }

  static writeMarkdown(filepath: string, content: string) {
    fs.writeFileSync(filepath, content, 'utf-8');
  }
}
