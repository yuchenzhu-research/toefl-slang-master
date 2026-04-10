export interface SRSRecord {
  efactor: number;
  interval: number;
  repetitions: number;
  nextReview: string; // ISO date string
}

export class SRSEngine {
  static SM2(grade: number, record: SRSRecord): SRSRecord {
    // grade: 0-5 (0: complete blackout, 5: perfect recall)
    let { efactor, interval, repetitions } = record;

    if (grade >= 3) {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * efactor);
      }
      repetitions += 1;
    } else {
      repetitions = 0;
      interval = 1;
    }

    efactor = efactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if (efactor < 1.3) efactor = 1.3;

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + interval);

    return {
      efactor,
      interval,
      repetitions,
      nextReview: nextDate.toISOString(),
    };
  }

  static createDefault(): SRSRecord {
    const nextDate = new Date();
    return {
      efactor: 2.5,
      interval: 0,
      repetitions: 0,
      nextReview: nextDate.toISOString(),
    };
  }
}
