import path from 'path';
import fs from 'fs';
import { StreakEngine } from '../streak';

export function runDailyChallenge() {
  console.log("\n⚔️  TOEFL SLANG MASTER - DAILY CHALLENGE ⚔️\n");
  
  const dictDir = path.join(process.cwd(), 'outputs', 'dict');
  if (!fs.existsSync(dictDir)) {
    console.log("   [!] Your dictionary is empty! Run content or coach pipelines to gather cards first.\n");
    return;
  }

  const headwords = fs.readdirSync(dictDir);
  if (headwords.length < 3) {
    console.log(`   [!] You only have ${headwords.length} cards. Learn more before taking a challenge!\n`);
    return;
  }

  // Pick 3 random cards
  const shuffled = headwords.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);

  console.log("🎯  Translate or upgrade the following contexts to their target academic registers:\n");

  selected.forEach((hw, i) => {
    const cardData = JSON.parse(fs.readFileSync(path.join(dictDir, hw, 'card.json'), 'utf-8'));
    console.log(`  Question ${i + 1}:`);
    console.log(`  Original (Slang/Informal Context): "${cardData.context}"`);
    console.log(`  [Hint: Slang equivalents include - ${cardData.slangOrInformal.join(', ')}]\n`);
    
    // In a real CLI, we would use prompt/readline to halt and wait for user input.
    // For this mock sprint, we display the answer after a simulated delay or immediately.
    console.log(`  => 💡 Academic Answer: ${cardData.headword}`);
    console.log(`  => 📚 Aligned Alternatives: ${cardData.academicAlignment.join(' | ')}\n`);
  });

  console.log("🎉  Challenge completed! Keep grinding!\n");
  StreakEngine.increment();
}
