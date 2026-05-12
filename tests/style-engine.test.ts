import test from "node:test";
import assert from "node:assert";
import { analyzeEconomistStyle } from "../src/style-engine";

test("Economist style analyzer scores analytical signals", () => {
  const result = analyzeEconomistStyle(
    "Although the policy may look generous, it could distort incentives because firms respond to constraints rather than slogans. The result is a trade-off: faster short-term relief, but weaker productivity growth in the long run.",
  );

  assert.strictEqual(result.profile, "economist");
  assert.ok(result.overallScore > 45);
  assert.ok(result.metrics.some((metric) => metric.id === "contrast" && metric.value > 0));
  assert.ok(result.metrics.some((metric) => metric.id === "causality" && metric.value > 0));
  assert.ok(result.signals.some((signal) => signal.label === "Economics/policy markers"));
});
