import { exec } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';

export function synthesizeSpeech(textOrHeadword: string) {
  if (os.platform() !== 'darwin') {
    console.log(">> [Audio TTS] Native TTS is currently only supported on macOS.");
    return;
  }

  // If input matches a dictionary card precisely, speak the context or text.
  let targetText = textOrHeadword;
  const safeHeadword = textOrHeadword.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
  const cardPath = path.join(process.cwd(), 'outputs', 'dict', safeHeadword, 'card.json');
  
  if (fs.existsSync(cardPath)) {
    console.log(`>> [Audio TTS] Found card. Speaking headword and aligned context...`);
    const card = JSON.parse(fs.readFileSync(cardPath, 'utf-8'));
    targetText = `The word is ${card.headword}. Context: ${card.context}`;
  } else {
    console.log(`>> [Audio TTS] Speaking query...`);
  }

  // Escape single quotes for bash substitution safety
  const safeText = targetText.replace(/'/g, "'\\''");
  
  exec(`say '${safeText}'`, (error) => {
    if (error) {
       console.error(`>> [Audio TTS] Failed playback: ${error.message}`);
    }
  });
}
