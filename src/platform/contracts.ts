/**
 * Core Domain Contracts
 * 这些是贯穿 TOEFL Slang Master 的标准数据对象（契约）
 * 为了保证不同模块之间的解耦，所有流转产物必须符合这些接口定义。
 * 
 * 强制约束：
 * - Schema 名和 Field 名必须保持英文。
 * - 枚举值保持英文。
 */

// ---------------------------------------------------------
// 1. Content Parser -> Dictionary Pro & TOEFL Coach 的输出
// ---------------------------------------------------------

/**
 * Materials Summary (外刊/文本摘要)
 * 将长文章压缩成可再利用的表达、句式、文化素材包。
 */
export interface SourceDigest {
  title: string;
  sourceType: string;
  summary: string;
  culturalNotes: string[];
  keySyntaxPatterns: string[];
}

/**
 * Expression Candidates (表达候选列表)
 * 从外刊中筛选出的值得查、值得升级的表达。
 */
export interface ExpressionCandidateItem {
  expression: string;
  sourceSentence: string;
  whyWorthLearning: string;
  registerHint: string;
  category: string;
  transferPotential: string;
  difficulty: string;
  downstreamTarget: string;
}

export interface ExpressionCandidates {
  candidates: ExpressionCandidateItem[];
  sourceReference?: string;
}

// ---------------------------------------------------------
// 2. Dictionary Pro 的主产物 (系统最核心的复用对象)
// ---------------------------------------------------------

/**
 * Expression Card (表达升级卡)
 * 把词、短语、语域对标固定成可复写的词卡单元。
 */
export interface ExpressionCard {
  headword: string;
  context: string;
  translation: string;
  slangOrInformal: string[];
  academicAlignment: string[];
  frequency: string;
  analysis: string;
  tags: string[];
  
  /** Context origin pointing to Pipeline 1/2 output slug */
  relatedSourceSlug?: string;
  relatedDiagnosisSlug?: string;

  /** Internal tracking for spaced repetition */
  srsData?: {
    efactor: number;
    interval: number;
    repetitions: number;
    nextReview: string;
  };
}

// ---------------------------------------------------------
// 3. TOEFL Coach -> Dictionary Pro 的输出
// ---------------------------------------------------------

/**
 * Writing Diagnosis (写作诊断)
 * 把作文里的弱表达、低阶词、逻辑问题结构化吐出来。
 */
export interface WritingDiagnosis {
  estimatedScoreRange: string;
  overallFeedback: string;
  logicIssues: string[];
  structureIssues: string[];
  vocabularyIssues: string[];
  revisedVersion: string;
}

/**
 * Weak Expression Set (病句/弱表达集合)
 * 供 Dictionary Pro 继续升级为 Expressions Card 使用
 */
export interface WeakExpressionItem {
  weakExpression: string;
  contextSentence: string;
  issueType: 'vocabulary' | 'grammar' | 'informal' | 'other';
  suggestedReplacement: string;
}

export interface WeakExpressionSet {
  items: WeakExpressionItem[];
}

// ---------------------------------------------------------
// 4. Connector 层专用（衔接对象）
// ---------------------------------------------------------

/**
 * Expression Card Seed (词卡生成种子)
 * 无论是从外刊中提取的候选，还是从作文诊断中提取的弱表达，
 * 都应映射为 Seed 后，被 Dictionary Pro 统一消费。
 */
export interface ExpressionCardSeed {
  seedExpression: string;
  seedContext: string;
  sourceOrigin: 'ContentParser' | 'TOEFLCoach' | 'Manual';
  targetRegister: 'toefl-writing' | 'toefl-speaking' | 'general-academic' | 'daily-english' | 'ielts-academic';
}
