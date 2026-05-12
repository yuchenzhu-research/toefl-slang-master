import test from "node:test";
import assert from "node:assert";
import { toExpressionCardSeeds } from "../src/connectors/coach-to-dict/index";
import { WeakExpressionSet } from "../src/platform/contracts";
import { TextChunker } from "../src/platform/text-chunker";
import { LocaleManager } from "../src/platform/locale";

test("toExpressionCardSeeds correctly maps expressions to seeds", () => {
  const weakSet: WeakExpressionSet = {
    kind: "weak_expression_set",
    title: "Essay weak expression extraction",
    scope: "paragraph",
    targetRegister: "toefl-writing",
    sourceText: "It has good effects on society. I think this is true.",
    summary: "The draft relies on vague and spoken-style expressions.",
    items: [
      {
        text: "good",
        category: "low_precision_word",
        severity: "high",
        reason: "The phrase is too vague for TOEFL writing.",
        targetRegister: "toefl-writing",
        sourceSentence: "It has good effects on society.",
        sourceFragment: "good effects",
        rewriteGoal: "Use a more precise academic collocation.",
      },
      {
        text: "I think",
        category: "spoken_opinion_marker",
        severity: "medium",
        reason: "The phrase sounds speech-like.",
        targetRegister: "toefl-writing",
        sourceSentence: "I think this is true.",
        rewriteGoal: "Use a stronger claim frame.",
      },
    ],
  };

  const seeds = toExpressionCardSeeds(weakSet);

  assert.strictEqual(seeds.length, 2, "Should output exactly 2 seeds");

  assert.strictEqual(seeds[0].query, "good effects");
  assert.strictEqual(seeds[0].context, "It has good effects on society.");
  assert.strictEqual(seeds[0].target, "toefl-writing");
  assert.strictEqual(seeds[0].mode, "upgrade");
  assert.strictEqual(seeds[0].source.module, "toefl-writing");

  assert.strictEqual(seeds[1].query, "I think");
});

test("toExpressionCardSeeds handles empty sets safely", () => {
  const emptySet: WeakExpressionSet = {
    kind: "weak_expression_set",
    title: "Sentence weak expression extraction",
    scope: "sentence",
    targetRegister: "general-academic",
    sourceText: "This is a sentence.",
    summary: "No expression issue.",
    items: [],
  };
  const emptySeeds = toExpressionCardSeeds(emptySet);
  assert.strictEqual(emptySeeds.length, 0);
});

test("TextChunker correct splitting behavior", () => {
  const longText = "Sentence one is here. ".repeat(50); 
  const chunks = TextChunker.splitIntoChunks(longText, 50);
  assert.ok(chunks.length > 1, "Should split text gracefully into multiple chunks.");
  assert.ok(chunks[0].endsWith("."), "Should split logically along valid sentential boundaries");
});

test("LocaleManager handles switcher flags correctly", () => {
  LocaleManager.setLocale("zht");
  assert.strictEqual(LocaleManager.getLocale(), "zh-Hant");
  assert.ok(LocaleManager.injectPrompt().includes("繁体中文"));

  LocaleManager.setLocale("en");
  assert.strictEqual(LocaleManager.getLocale(), "en");
  assert.ok(LocaleManager.injectPrompt().includes("English"));
});

import { toExpressionCard } from "../src/connectors/dict-to-card/index";
import { DictionaryProWordPhraseResponse } from "../src/dictionary-pro/types";

test("toExpressionCard maps word_phrase response correctly", () => {
  const dictResponse: DictionaryProWordPhraseResponse = {
    kind: "word_phrase",
    query: "gonna",
    mode: "conversion",
    target: "toefl-writing",
    translation: ["将要"],
    slang: {
      register: "Informal spoken",
      tone: "Casual",
      variants: ["going to", "bout to"]
    },
    alignment: [
      { expression: "intend to", note: "Formal intent" },
      { expression: "plan to", note: "Formal planning" }
    ],
    frequency: "Extremely high",
    analysis: {
      sourceExample: "I'm gonna do it.",
      sourceExplanation: "very informal.",
      toeflExample: "The researcher intends to do it.",
      toeflExplanation: "very formal."
    }
  };

  const card = toExpressionCard(dictResponse, { relatedSourceSlug: "test-slug" });
  
  assert.strictEqual(card.headword, "gonna");
  assert.deepStrictEqual(card.academicAlignment, ["intend to", "plan to"]);
  assert.deepStrictEqual(card.slangOrInformal, ["going to", "bout to"]);
  assert.strictEqual(card.relatedSourceSlug, "test-slug");
  assert.ok(card.analysis.includes("very formal."));
});
