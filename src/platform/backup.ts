import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

export function runSnapshotBackup() {
  console.log(">> [Backup Manager] Initiating silent data snapshot...");
  const outDir = path.join(process.cwd(), 'outputs');
  if (!fs.existsSync(outDir)) {
    console.log("   [!] No outputs directory to back up.");
    return;
  }

  try {
    // Basic trick to commit everything inside outputs on a distinct branch or just to main if forced.
    // For local MVP without complex branching, we just create a backup zip or copy.
    const backupTarget = path.join(process.cwd(), '.backups');
    if (!fs.existsSync(backupTarget)) fs.mkdirSync(backupTarget);

    const stamp = Date.now();
    const dest = path.join(backupTarget, `outputs-bkp-${stamp}`);

    // In MacOS/Linux we can just cp -r
    execSync(`cp -r "${outDir}" "${dest}"`);
    console.log(`>> [Backup Manager] Target safely duplicated at .backups/outputs-bkp-${stamp}`);
    
    // Add inside .gitignore dynamically
    const ignorePath = path.join(process.cwd(), '.gitignore');
    const ignores = fs.readFileSync(ignorePath, 'utf-8');
    if (!ignores.includes('.backups/')) {
       fs.appendFileSync(ignorePath, '\n# Backups\n.backups/\n');
    }

  } catch (e: any) {
    console.error(`>> [Backup Manager] Failed to create snapshot: ${e.message}`);
  }
}
