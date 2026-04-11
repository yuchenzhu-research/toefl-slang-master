import fs from "fs";
import path from "path";
import type { ExpressionCard } from "./contracts";

function getCanonicalOutputRoot() {
  return path.join(process.cwd(), "outputs");
}

const CONTENT_DIGEST_JSON = "digest.json";
const CONTENT_INDEX_MARKDOWN = "index.md";
const CONTENT_CANDIDATES_JSON = "candidates.json";
const COACH_DIAGNOSIS_JSON = "diagnosis.json";
const COACH_REPORT_MARKDOWN = "report.md";
const DICT_CARD_JSON = "card.json";
const DICT_INDEX_MARKDOWN = "index.md";

export class OutputManager {
  static ensureDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  // Pipeline 1 Base Output Dir
  static getContentDir(slug: string) {
    const dir = path.join(getCanonicalOutputRoot(), "content", slug);
    this.ensureDir(dir);
    return dir;
  }

  // Pipeline 2 Base Output Dir
  static getDiagnosisDir(slug: string) {
    const dir = path.join(getCanonicalOutputRoot(), "coach", slug);
    this.ensureDir(dir);
    return dir;
  }

  // Single dictionary card path
  static getCardDir(targetRegister: string, category: string, headword: string) {
    const safeHeadword = headword.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
    const dir = path.join(getCanonicalOutputRoot(), "dict", safeHeadword);
    this.ensureDir(dir);
    return dir;
  }

  static writeJson(filepath: string, data: any) {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf-8");
  }

  static writeMarkdown(filepath: string, content: string) {
    fs.writeFileSync(filepath, content, "utf-8");
  }

  /**
   * Phase 4: Unified Sidecar Savers
   */

  static saveDictionaryCard(card: ExpressionCard, markdown: string) {
    const dir = this.getCardDir("general", "uncategorized", card.headword);
    this.writeJson(path.join(dir, DICT_CARD_JSON), card);
    this.writeMarkdown(path.join(dir, DICT_INDEX_MARKDOWN), markdown);
    return dir;
  }

  static saveCoachDiagnosis(slug: string, diagnosis: any, markdown: string) {
    const dir = this.getDiagnosisDir(slug);
    this.writeJson(path.join(dir, COACH_DIAGNOSIS_JSON), diagnosis);
    this.writeMarkdown(path.join(dir, COACH_REPORT_MARKDOWN), markdown);
    return dir;
  }

  static saveContentDigest(slug: string, digest: any, markdown: string) {
    const dir = this.getContentDir(slug);
    this.writeJson(path.join(dir, CONTENT_DIGEST_JSON), digest);
    this.writeMarkdown(path.join(dir, CONTENT_INDEX_MARKDOWN), markdown);
    return dir;
  }

  static saveContentCandidates(slug: string, candidates: unknown) {
    const dir = this.getContentDir(slug);
    this.writeJson(path.join(dir, CONTENT_CANDIDATES_JSON), candidates);
    return dir;
  }
}
