import test from "node:test";
import assert from "node:assert";
import { mapCoachToDictSeeds } from "../src/connectors/coach-to-dict";
import { WeakExpressionSet } from "../src/platform/contracts";

test("mapCoachToDictSeeds correctly maps expressions to seeds", () => {
  const weakSet: WeakExpressionSet = {
    items: [
      {
        weakExpression: "good effects",
        contextSentence: "It has good effects on society.",
        issueType: "vocabulary",
        suggestedReplacement: "beneficial impacts",
      },
      {
        weakExpression: "I think",
        contextSentence: "I think this is true.",
        issueType: "informal",
        suggestedReplacement: "I maintain that",
      }
    ]
  };

  const seeds = mapCoachToDictSeeds(weakSet);

  assert.strictEqual(seeds.length, 2, "Should output exactly 2 seeds");
  
  assert.strictEqual(seeds[0].seedExpression, "good effects");
  assert.strictEqual(seeds[0].seedContext, "It has good effects on society.");
  assert.strictEqual(seeds[0].targetRegister, "toefl-writing", "Default register should be toefl-writing");
  assert.strictEqual(seeds[0].sourceOrigin, "TOEFLCoach");

  assert.strictEqual(seeds[1].seedExpression, "I think");
});

test("mapCoachToDictSeeds handles empty or undefined sets safely", () => {
  const emptySet: WeakExpressionSet = { items: [] };
  const emptySeeds = mapCoachToDictSeeds(emptySet);
  assert.strictEqual(emptySeeds.length, 0);

  // @ts-ignore
  const undefinedSeeds = mapCoachToDictSeeds(undefined);
  assert.strictEqual(undefinedSeeds.length, 0);
});

import { TextChunker } from "../src/platform/text-chunker";

test("TextChunker correct splitting behavior", () => {
  const longText = "Sentence one is here. ".repeat(50); 
  const chunks = TextChunker.splitIntoChunks(longText, 50);
  assert.ok(chunks.length > 1, "Should split text gracefully into multiple chunks.");
  assert.ok(chunks[0].endsWith("."), "Should split logically along valid sentential boundaries");
});
