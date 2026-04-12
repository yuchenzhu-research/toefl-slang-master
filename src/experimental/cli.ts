import fs from "fs";
import path from "path";
import type { ToeflSlangClientOptions } from "../platform/client";

const EXPERIMENTAL_USAGE = `
SPARK - Experimental / Auxiliary Commands

Usage:
  spark x <command> [args]

Workflow Commands:
  pipeline:input <filepath>      Run the Input Learning flow.
  pipeline:output <text>         Run the Output Correction flow.
  batch:coach <dir>              Batch process essays for TOEFL Coach.

Auxiliary Commands:
  backup                         Create a snapshot archive of outputs.
  export anki                    Export cards as Anki CSV.
  export print                   Export printable materials.
  kb:status                      Show knowledge base indexing status.
  add <word> <translation> [context]
                                 Manually create a dictionary card.

Experimental Commands:
  review                         Run due-card review flow.
  daily                          Run a quick daily challenge.
  quiz                           Launch an interactive MCQ challenge.
  search <keyword>               Search saved dictionary cards.
  archive                        Archive mastered flashcards.
  graph                          Build synonym graph.
  cluster                        Find semantic clusters.
  trace <word>                   Trace word usage across saved reports.
  telemetry                      Print token / provider telemetry.
  journal                        Generate a weekly journal.
  repl                           Launch interactive processing terminal.
  speak <text-or-headword>       Use native macOS TTS.
`;

export function printExperimentalUsage(): void {
  console.log(EXPERIMENTAL_USAGE.trim());
}

export async function runExperimentalCli(
  command: string,
  rest: string[],
  clientOptions: ToeflSlangClientOptions = { provider: "openai" },
): Promise<void> {
  switch (command) {
    case "pipeline:input": {
      const filePath = readFlagValue(rest, "--file") ?? rest[0];
      if (!filePath) {
        throw new Error("Usage: spark x pipeline:input <filepath> | --file <filepath>");
      }
      const { runPipelineInput } = require("../pipelines/input-learning");
      await runPipelineInput({ filePath, focus: "full", extractOnly: false }, clientOptions);
      return;
    }

    case "pipeline:output": {
      const text = readFlagValue(rest, "--text") ?? rest.join(" ").trim();
      if (!text) {
        throw new Error("Usage: spark x pipeline:output <text> | --text <text>");
      }
      const { runPipelineOutput } = require("../pipelines/output-correction");
      await runPipelineOutput(text, clientOptions);
      return;
    }

    case "kb:status": {
      const { renderDashboard } = require("./dashboard");
      renderDashboard();
      return;
    }

    case "review":
      runReviewFlow();
      return;

    case "export": {
      const format = rest[0];
      if (format === "anki") {
        const { exportAnkiCsv } = require("../pipelines/exporters");
        await exportAnkiCsv();
        return;
      }
      if (format === "print") {
        const { runPrintExport } = require("../pipelines/exporters");
        runPrintExport();
        return;
      }
      throw new Error("Usage: spark x export <anki|print>");
    }

    case "batch:coach": {
      const dir = rest[0];
      if (!dir) throw new Error("Usage: spark x batch:coach <dir>");
      const { processBatchEssays } = require("../pipelines/batch-coach");
      await processBatchEssays(path.resolve(process.cwd(), dir));
      return;
    }

    case "daily": {
      const { runDailyChallenge } = require("./knowledge-base/daily");
      runDailyChallenge();
      return;
    }

    case "graph": {
      const { buildSynonymsGraph } = require("./knowledge-base/graph-builder");
      buildSynonymsGraph();
      return;
    }

    case "backup":
      const { runSnapshotBackup } = require("../platform/backup");
      runSnapshotBackup();
      return;

    case "repl": {
      const { startRepl } = require("./repl");
      await startRepl();
      return;
    }

    case "speak": {
      const text = rest.join(" ").trim();
      if (!text) throw new Error("Usage: spark x speak <text-or-headword>");
      const { synthesizeSpeech } = require("./audio");
      synthesizeSpeech(text);
      return;
    }

    case "journal": {
      const { buildWeeklyJournal } = require("./knowledge-base/journal");
      buildWeeklyJournal();
      return;
    }

    case "search": {
      const keyword = rest.join(" ").trim();
      if (!keyword) throw new Error("Usage: spark x search <keyword>");
      const { runGlobalSearch } = require("./knowledge-base/search");
      runGlobalSearch(keyword);
      return;
    }

    case "archive": {
      const { archiveCards } = require("./knowledge-base/archiver");
      archiveCards();
      return;
    }

    case "add": {
      const word = rest[0];
      const translation = rest[1];
      const context = rest.slice(2).join(" ");
      if (!word || !translation) {
        throw new Error("Usage: spark x add <word> <translation> [context]");
      }
      const { manuallyAddCard } = require("../connectors/manual");
      manuallyAddCard(word, translation, context);
      return;
    }

    case "trace": {
      const word = rest.join(" ").trim();
      if (!word) throw new Error("Usage: spark x trace <word>");
      const { runCrossRefTrace } = require("./knowledge-base/cross-ref");
      runCrossRefTrace(word);
      return;
    }

    case "quiz": {
      const { runMcqQuiz } = require("./knowledge-base/quiz");
      runMcqQuiz();
      return;
    }

    case "cluster": {
      const { runSemanticClusters } = require("./knowledge-base/cluster");
      runSemanticClusters();
      return;
    }

    case "telemetry": {
      const { Telemetry } = require("./telemetry");
      Telemetry.printReport();
      return;
    }
  }

  throw new Error(`Unknown experimental command "${command}". Use "spark x help" to see all.`);
}

function readFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) {
    return undefined;
  }
  return args[index + 1];
}

function runReviewFlow(): void {
  console.log(">> [SRS Dashboard] Gathering cards due today...");
  const cardsDir = path.join(process.cwd(), "outputs", "dict");
  if (!fs.existsSync(cardsDir)) {
    console.log("No dictionary cards found in outputs/dict.");
    return;
  }

  const headwords = fs.readdirSync(cardsDir);
  const dueCards: Array<{ file: string; headword: string }> = [];
  const now = new Date();

  for (const headword of headwords) {
    const cardPath = path.join(cardsDir, headword, "card.json");
    if (!fs.existsSync(cardPath)) {
      continue;
    }

    const cardData = JSON.parse(fs.readFileSync(cardPath, "utf-8"));
    if (!cardData.srsData) {
      dueCards.push({ file: cardPath, headword });
      continue;
    }

    const nextReview = new Date(cardData.srsData.nextReview);
    if (nextReview <= now) {
      dueCards.push({ file: cardPath, headword });
    }
  }

  if (dueCards.length === 0) {
    console.log(">> You're all caught up! No cards due today.");
    return;
  }

  console.log(`>> You have ${dueCards.length} card(s) to review today. (Interactive mode mocked for testing)`);
  const { SRSEngine } = require("./srs");
  const first = dueCards[0];
  const cardData = JSON.parse(fs.readFileSync(first.file, "utf-8"));
  const oldRecord = cardData.srsData || SRSEngine.createDefault();

  cardData.srsData = SRSEngine.SM2(4, oldRecord);
  fs.writeFileSync(first.file, JSON.stringify(cardData, null, 2), "utf-8");

  console.log(`>> Simulated review for '${first.headword}' with Grade 4. Next review: ${cardData.srsData.nextReview}`);
}
