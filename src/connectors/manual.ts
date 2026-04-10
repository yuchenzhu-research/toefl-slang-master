import { OutputManager } from '../platform/output-manager';
import path from 'path';
import { ExpressionCard } from '../platform/contracts';

export function manuallyAddCard(word: string, translation: string, context: string) {
  const cardDir = OutputManager.getCardDir("general-academic", "Manual", word);
  
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

  OutputManager.writeJson(path.join(cardDir, 'card.json'), card);
  OutputManager.writeMarkdown(path.join(cardDir, 'index.md'), `# ${word}\n\n${translation}\n\n> Added manually.`);
  
  console.log(`\n>> [Manual Drop-in] Inserted card '${word}' successfully at ${cardDir}`);
}
