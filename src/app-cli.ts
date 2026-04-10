import "dotenv/config";

import { runContentParserModuleCli } from "./content-parser";
import { runDictionaryProBenchCli, runDictionaryProModuleCli } from "./dictionary-pro";
import { ToeflSlangClient } from "./platform/client";
import { runDoctorCli } from "./platform/doctor";
import { runInitCli } from "./platform/init";
import { runToeflWritingModuleCli } from "./toefl-writing";
import { runPipelineInput } from "./connectors/pipeline-input";
import { runPipelineOutput } from "./connectors/pipeline-output";
import fs from "fs";
import path from "path";

function printUsage(): void {
  const usage = `
TOEFL Slang Master CLI

Usage:
  tsm dict "<expression>" [options]
  tsm coach "<essay-or-paragraph>" [options]
  tsm content --file <article.md> [options]
  tsm init [--force]
  tsm doctor
  tsm providers
  tsm x --help      (Experimental / Auxiliary commands)

Core Commands:
  dict       Run Dictionary Pro to upgrade informal English.
  coach      Run TOEFL Coach for writing diagnosis and scoring.
  content    Run Content Parser to extract learning materials.

Setup Commands:
  init       Initialize environment and required directories.
  doctor     Check environment, API keys, and system health.
  providers  List all supported model providers.

Examples:
  tsm dict "gonna" --target toefl-writing
  tsm coach "I think technology is good..." --dry-run
  tsm content --file essay.md --json
`;

  console.log(usage.trim());
}

function printExperimentalUsage(): void {
  const usage = `
TOEFL Slang Master - Experimental & Auxiliary Commands

Usage:
  tsm x <command> [args]

Commands:
  pipeline:input   Run Pipeline 1 (Input Learning flow).
  pipeline:output  Run Pipeline 2 (Output Correction flow).
  kb:status        Show knowledge base indexing status.
  daily            Run a quick 3-card daily challenge.
  review           Review due flashcards via SM2 algorithm.
  quiz             Launch an interactive MCQ vocabulary challenge.
  telemetry        View API LLM usage and token tracking.
  journal          Generate a weekly Markdown digest of cards.
  search           Global fast search across dictionary cards.
  archive          Move mastered flashcards to the archive.
  graph            Build synonym graph across dictionary.
  cluster          Find the largest semantic synonym clusters.
  trace            Trace word usage across historical reports.
  repl             Launch an interactive continuous processing terminal.
  speak            Use native macOS TTS to read text.
  batch:coach      Batch process essays for TOEFL coach.
  backup           Create a silent snapshot zip of your outputs.
  export           Export knowledge base (anki, print).
  add              Manually create a dictionary card.
`;
  console.log(usage.trim());
}

export async function runTopLevelCli(argv: string[]): Promise<void> {
  if (argv.length === 0) {
    printUsage();
    return;
  }

  const [command, ...rest] = argv;

  // Help handling
  if (command === "help" || command === "--help" || command === "-h") {
    printUsage();
    return;
  }

  // Core Pillars
  if (command === "dict") {
    await runDictionaryProModuleCli(rest);
    return;
  }
  if (command === "coach") {
    await runToeflWritingModuleCli(rest);
    return;
  }
  if (command === "content") {
    await runContentParserModuleCli(rest);
    return;
  }

  // Essential Utilities
  if (command === "init") {
    runInitCli(rest);
    return;
  }
  if (command === "doctor") {
    runDoctorCli(rest);
    return;
  }
  if (command === "providers") {
    console.log(ToeflSlangClient.listProviders());
    return;
  }

  // Legacy root command kept for scripting but hidden from main help
  if (command === "bench") {
    await runDictionaryProBenchCli(rest);
    return;
  }

  // Experimental Namespace
  if (command === "x") {
    if (rest.length === 0 || rest[0] === "--help" || rest[0] === "-h" || rest[0] === "help") {
      printExperimentalUsage();
      return;
    }
    const [subCommand, ...subRest] = rest;
    await runExperimentalCli(subCommand, subRest);
    return;
  }

  throw new Error(
    `Unknown command "${command}". Use "tsm help" to see core commands or "tsm x help" for experimental commands.`,
  );
}

async function runExperimentalCli(command: string, rest: string[]): Promise<void> {
  if (command === "pipeline:input") {
    const file = rest[0];
    if (!file) throw new Error("Usage: tsm x pipeline:input <filepath>");
    await runPipelineInput({ filePath: file, focus: "full", extractOnly: false }, { provider: "openai" });
    return;
  }

  if (command === "pipeline:output") {
    const text = rest[0];
    if (!text) throw new Error("Usage: tsm x pipeline:output <text>");
    await runPipelineOutput(text, { provider: "openai" });
    return;
  }

  if (command === "kb:status") {
    const { renderDashboard } = require("./platform/dashboard");
    renderDashboard();
    return;
  }

  if (command === "review") {
    console.log(">> [SRS Dashboard] Gathering cards due today...");
    const cardsDir = path.join(process.cwd(), "outputs", "dict");
    if (!fs.existsSync(cardsDir)) {
      console.log("No dictionary cards found in outputs/dict.");
      return;
    }
    const headwords = fs.readdirSync(cardsDir);
    const dueCards: { file: string; headword: string }[] = [];
    const now = new Date();
    for (const hw of headwords) {
      const cardPath = path.join(cardsDir, hw, "card.json");
      if (fs.existsSync(cardPath)) {
        const c = JSON.parse(fs.readFileSync(cardPath, "utf-8"));
        if (!c.srsData) {
          dueCards.push({ file: cardPath, headword: hw });
          continue;
        }
        const rDate = new Date(c.srsData.nextReview);
        if (rDate <= now) {
          dueCards.push({ file: cardPath, headword: hw });
        }
      }
    }
    if (dueCards.length === 0) {
      console.log(">> You're all caught up! No cards due today.");
      return;
    }
    console.log(`>> You have ${dueCards.length} card(s) to review today. (Interactive mode mocked for testing)`);
    const SrsModule = require("./platform/srs");
    const first = dueCards[0];
    const cardData = JSON.parse(fs.readFileSync(first.file, "utf-8"));
    const oldRec = cardData.srsData || SrsModule.SRSEngine.createDefault();
    cardData.srsData = SrsModule.SRSEngine.SM2(4, oldRec);
    fs.writeFileSync(first.file, JSON.stringify(cardData, null, 2), "utf-8");
    console.log(`>> Simulated review for '${first.headword}' with Grade 4. Next review: ${cardData.srsData.nextReview}`);
    return;
  }

  if (command === "export" && rest[0] === "anki") {
    const { exportAnkiCsv } = require("./connectors/anki-exporter");
    await exportAnkiCsv();
    return;
  }

  if (command === "export" && rest[0] === "print") {
    const { runPrintExport } = require("./connectors/print-exporter");
    runPrintExport();
    return;
  }

  if (command === "batch:coach") {
    const dir = rest[0];
    if (!dir) throw new Error("Usage: tsm x batch:coach <dir>");
    const { processBatchEssays } = require("./connectors/batch-coach");
    await processBatchEssays(path.resolve(process.cwd(), dir));
    return;
  }

  if (command === "daily") {
    const { runDailyChallenge } = require("./knowledge-base/daily");
    runDailyChallenge();
    return;
  }

  if (command === "graph") {
    const { buildSynonymsGraph } = require("./knowledge-base/graph-builder");
    buildSynonymsGraph();
    return;
  }

  if (command === "backup") {
    const { runSnapshotBackup } = require("./platform/backup");
    runSnapshotBackup();
    return;
  }

  if (command === "repl") {
    const { startRepl } = require("./cli/repl");
    await startRepl();
    return;
  }

  if (command === "speak") {
    const text = rest.join(" ");
    if (!text) throw new Error("Usage: tsm x speak <text-or-headword>");
    const { synthesizeSpeech } = require("./platform/audio");
    synthesizeSpeech(text);
    return;
  }

  if (command === "journal") {
    const { buildWeeklyJournal } = require("./knowledge-base/journal");
    buildWeeklyJournal();
    return;
  }

  if (command === "search") {
    const kw = rest.join(" ");
    if (!kw) throw new Error("Usage: tsm x search <keyword>");
    const { runGlobalSearch } = require("./knowledge-base/search");
    runGlobalSearch(kw);
    return;
  }

  if (command === "archive") {
    const { archiveCards } = require("./knowledge-base/archiver");
    archiveCards();
    return;
  }

  if (command === "add") {
    const word = rest[0];
    const trans = rest[1];
    const ctx = rest.slice(2).join(" ");
    if (!word || !trans) throw new Error("Usage: tsm x add <word> <translation> [context]");
    const { manuallyAddCard } = require("./connectors/manual");
    manuallyAddCard(word, trans, ctx);
    return;
  }

  if (command === "trace") {
    const word = rest.join(" ");
    if (!word) throw new Error("Usage: tsm x trace <word>");
    const { runCrossRefTrace } = require("./knowledge-base/cross-ref");
    runCrossRefTrace(word);
    return;
  }

  if (command === "quiz") {
    const { runMcqQuiz } = require("./knowledge-base/quiz");
    runMcqQuiz();
    return;
  }

  if (command === "cluster") {
    const { runSemanticClusters } = require("./knowledge-base/cluster");
    runSemanticClusters();
    return;
  }

  if (command === "telemetry") {
    const { Telemetry } = require("./platform/telemetry");
    Telemetry.printReport();
    return;
  }

  throw new Error(`Unknown experimental command "${command}". Use "tsm x help" to see all.`);
}

async function main() {
  await runTopLevelCli(process.argv.slice(2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error("TOEFL Slang Master CLI error:", error.message);
    process.exit(1);
  });
}
