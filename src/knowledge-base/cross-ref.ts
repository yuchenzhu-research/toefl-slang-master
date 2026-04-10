import fs from 'fs';
import path from 'path';

export function runCrossRefTrace(word: string) {
  console.log(`\n>> [Cross-Ref Trace] Scanning all TOEFL Coach reports for occurrences of '${word}'...`);
  
  const coachDir = path.join(process.cwd(), 'outputs', 'coach');
  if (!fs.existsSync(coachDir)) {
    console.log("   [!] No TOEFL Coach diagnoses found. Go write some outputs first!");
    return;
  }

  const reports = fs.readdirSync(coachDir);
  let occurrenceCount = 0;
  const matches: string[] = [];

  for (const slug of reports) {
    const reportPath = path.join(coachDir, slug, 'report.md');
    if (fs.existsSync(reportPath)) {
      const content = fs.readFileSync(reportPath, 'utf-8');
      if (content.toLowerCase().includes(word.toLowerCase())) {
         occurrenceCount++;
         matches.push(`- Detected in: ${slug}`);
      }
    }
  }

  if (occurrenceCount === 0) {
    console.log(`>> You haven't made this mistake or used this word in any recorded writing yet!`);
  } else {
    console.log(`\n🚨 Ouch! You have used or stumbled upon '${word}' across ${occurrenceCount} different essays:\n`);
    matches.forEach(m => console.log(`   ${m}`));
    console.log(`\n   You should probably review this card right now!`);
  }
}
