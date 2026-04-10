import fs from 'fs';
import path from 'path';
import { StreakEngine } from '../platform/streak';

export function runMcqQuiz() {
  console.log("\n🎮 TOEFL SLANG MASTER - MCQ ARENA 🎮\n");
  
  const dictDir = path.join(process.cwd(), 'outputs', 'dict');
  if (!fs.existsSync(dictDir)) {
    console.log("   [!] Your dictionary is empty!");
    return;
  }

  const headwords = fs.readdirSync(dictDir);
  if (headwords.length < 4) {
    console.log("   [!] You need at least 4 flashcards to generate MCQ distractor options!");
    return;
  }

  const target = headwords[Math.floor(Math.random() * headwords.length)];
  const distractors = headwords.filter(h => h !== target).sort(() => 0.5 - Math.random()).slice(0, 3);
  
  const options = [target, ...distractors].sort(() => 0.5 - Math.random());
  const correctIdx = options.indexOf(target);

  const cardData = JSON.parse(fs.readFileSync(path.join(dictDir, target, 'card.json'), 'utf-8'));

  console.log(`  Question: Which academic expression best matches this slang/informal meaning?`);
  console.log(`  [Slang/Context]: "${cardData.slangOrInformal.join(', ')}" / "${cardData.context}"\n`);
  
  options.forEach((opt, idx) => {
    console.log(`   ${['A', 'B', 'C', 'D'][idx]}. ${opt}`);
  });

  console.log(`\n  (Waiting for user input... Simulated Reveal)`);
  console.log(`\n  => 💡 The correct answer is: ${['A', 'B', 'C', 'D'][correctIdx]}. ${target}`);
  console.log(`\n🎉  Quiz Round Completed!\n`);
  StreakEngine.increment();
}
