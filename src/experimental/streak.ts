import fs from 'fs';
import path from 'path';

const streakPath = path.join(process.cwd(), 'outputs', 'indexes', 'streak.json');

export class StreakEngine {
  static getStreak(): { days: number, lastUpdate: string } {
    if (fs.existsSync(streakPath)) {
      return JSON.parse(fs.readFileSync(streakPath, 'utf-8'));
    }
    return { days: 0, lastUpdate: "Never" };
  }

  static increment() {
    const data = this.getStreak();
    const today = new Date().toISOString().split('T')[0];
    
    if (data.lastUpdate === today) {
       console.log(`\n>> 🔥 Streak remains at ${data.days} days. You've already practiced today!`);
       return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (data.lastUpdate === yesterdayStr) {
       data.days += 1;
    } else {
       // Broken streak
       data.days = 1;
    }

    data.lastUpdate = today;
    fs.writeFileSync(streakPath, JSON.stringify(data), 'utf-8');
    console.log(`\n>> 🔥 STREAK EXTENDED! You are on a ${data.days} day streak!`);
  }
}
