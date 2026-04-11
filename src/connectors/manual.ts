import { OutputManager } from "../platform/output-manager";
import { ExpressionCard } from "../platform/contracts";

export function manuallyAddCard(word: string, translation: string, context: string) {
  const card: ExpressionCard = {
    headword: word,
    context: context || "Manually added.",
    translation: translation,
    slangOrInformal: ["(Manual Input)"],
    academicAlignment: ["(Manual Input)"],
    frequency: "unknown",
    analysis: "Manually injected bypassing AI pipes.",
    tags: ["manual_drop"]
  };

  const cardDir = OutputManager.saveDictionaryCard(
    card,
    `# ${word}\n\n${translation}\n\n> Added manually.`,
  );
  
  console.log(`\n>> [Manual Drop-in] Inserted card '${word}' successfully at ${cardDir}`);
}
