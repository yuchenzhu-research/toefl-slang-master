import "dotenv/config";

import { runContentParserModuleCli } from "./content-parser";
import { runDictionaryProBenchCli, runDictionaryProModuleCli } from "./dictionary-pro";
import { ToeflSlangClient } from "./platform/client";
import { runDoctorCli } from "./platform/doctor";
import { runInitCli } from "./platform/init";
import { runToeflWritingModuleCli } from "./toefl-writing";
import { runPipelineInput } from "./connectors/pipeline-input";
import { runPipelineOutput } from "./connectors/coach-to-dict";
import fs from "fs";
import path from "path";

function printUsage(): void {
  const usage = `
TOEFL Slang Master CLI

Usage:
  tsm dict "<expression>" [options]
  tsm dict eval [options]
  tsm dict bench [options]
  tsm bench [options]
  tsm coach "<essay-or-paragraph>" [options]
  tsm content --file <article.md> [options]
  tsm init [--force] [--json]
  tsm doctor [--json]
  tsm doctor [--json]
  tsm providers
  tsm pipeline:input <filepath>
  tsm pipeline:output "<essay-text>"
  tsm kb:status
  tsm batch:coach <dir>
  tsm review
  tsm daily
  tsm export anki
  tsm graph
  tsm backup
  tsm repl
  tsm speak "<word-or-sentence>"
  tsm journal
  tsm search "<keyword>"
  tsm archive
  tsm add "<word>" "<translation>" [context]
  tsm trace "<word>"
  tsm quiz
  tsm cluster
  tsm export print
  tsm telemetry

Commands:
  dict       Run Dictionary Pro.
  bench      Benchmark Dictionary Pro across providers.
  coach      Run TOEFL Coach.
  content    Run Content Parser.
  init       Create .env from .env.example and print next steps.
  doctor     Check local environment, provider keys, and PDF extraction readiness.
  providers  List all supported model providers.
  pipeline:input   Run Pipeline 1 (Input Learning flow).
  pipeline:output  Run Pipeline 2 (Output Correction flow).
  kb:status  Show knowledge base indexing status.
  daily      Run a quick 3-card daily challenge.
  review     Review due flashcards via SM2 algorithm.
  export     Export knowledge base (e.g., export anki).
  graph      Build synonym graph across dictionary.
  backup     Create a silent snapshot zip of your outputs.
  repl       Launch an interactive continuous processing terminal.
  speak      Use native macOS TTS to read a card or text.
  journal    Generate a beautiful Markdown digest of the week's cards.
  search     Global fast search across dictionary cards.
  archive    Move fully mastered flashcards (Rep > 5) to the archive.
  add        Manually create a dictionary card without AI processing.
  trace      Cross-reference a word across your submitted essay reports.
  quiz       Launch an interactive MCQ vocabulary challenge.
  batch:coach Batch process essays for TOEFL coach.
  cluster    Traverse graph to find the largest semantic synonym clusters.
  telemetry  View API LLM usage and token tracking.
  help       Show this message.

Examples:
  tsm dict "gonna" --provider openai --mode conversion --target toefl-writing
  tsm dict eval --provider openai --limit 3
  tsm dict bench --providers openai,anthropic,google --limit 2
  tsm coach "I think technology is good because it helps us communicate." --dry-run
  tsm content --file README.md --extract-only
  tsm bench --providers openai,anthropic,google --limit 2
  tsm init
  tsm doctor
`;

  console.log(usage.trim());
}

export async function runTopLevelCli(argv: string[]): Promise<void> {
  if (argv.length === 0) {
    printUsage();
    return;
  }

  const [command, ...rest] = argv;

  if (command === "help" || command === "--help" || command === "-h") {
    printUsage();
    return;
  }

  if (command === "providers") {
    console.log(ToeflSlangClient.listProviders());
    return;
  }

  if (command === "bench") {
    await runDictionaryProBenchCli(rest);
    return;
  }

  if (command === "doctor") {
    runDoctorCli(rest);
    return;
  }

  if (command === "init") {
    runInitCli(rest);
    return;
  }

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

  if (command === "pipeline:input") {
    const file = rest[0];
    if (!file) throw new Error("Usage: tsm pipeline:input <filepath>");
    await runPipelineInput({ filePath: file, focus: "full", extractOnly: false }, { provider: "openai" });
    return;
  }

  if (command === "pipeline:output") {
    const text = rest[0];
    if (!text) throw new Error("Usage: tsm pipeline:output <text>");
    await runPipelineOutput(text, { provider: "openai" });
    return;
  }

  if (command === "kb:status") {
    const { renderDashboard } = require('./platform/dashboard');
    renderDashboard();
    return;
  }

  if (command === "review") {
    console.log(">> [SRS Dashboard] Gathering cards due today...");
    const cardsDir = path.join(process.cwd(), 'outputs', 'dict');
    if (!fs.existsSync(cardsDir)) {
      console.log("No dictionary cards found in outputs/dict.");
      return;
    }
    const headwords = fs.readdirSync(cardsDir);
    const dueCards: {file: string, headword: string}[] = [];
    const now = new Date();
    for (const hw of headwords) {
      const cardPath = path.join(cardsDir, hw, 'card.json');
      if (fs.existsSync(cardPath)) {
        const c = JSON.parse(fs.readFileSync(cardPath, 'utf-8'));
        if (!c.srsData) { dueCards.push({file: cardPath, headword: hw}); continue; }
        const rDate = new Date(c.srsData.nextReview);
        if (rDate <= now) { dueCards.push({file: cardPath, headword: hw}); }
      }
    }
    if (dueCards.length === 0) { console.log(">> You're all caught up! No cards due today."); return; }
    console.log(`>> You have ${dueCards.length} card(s) to review today. (Interactive mode mocked for testing)`);
    const SrsModule = require('./platform/srs');
    const first = dueCards[0];
    const cardData = JSON.parse(fs.readFileSync(first.file, 'utf-8'));
    const oldRec = cardData.srsData || SrsModule.SRSEngine.createDefault();
    cardData.srsData = SrsModule.SRSEngine.SM2(4, oldRec);
    fs.writeFileSync(first.file, JSON.stringify(cardData, null, 2), 'utf-8');
    console.log(`>> Simulated review for '${first.headword}' with Grade 4. Next review: ${cardData.srsData.nextReview}`);
    return;
  }

  if (command === "export" && rest[0] === "anki") {
    const { exportAnkiCsv } = require('./connectors/anki-exporter');
    await exportAnkiCsv();
    return;
  }

  if (command === "export" && rest[0] === "print") {
    const { runPrintExport } = require('./connectors/print-exporter');
    runPrintExport();
    return;
  }

  if (command === "batch:coach") {
    const dir = rest[0];
    if (!dir) throw new Error("Usage: tsm batch:coach <dir>");
    const { processBatchEssays } = require('./connectors/batch-coach');
    await processBatchEssays(path.resolve(process.cwd(), dir));
    return;
  }

  if (command === "daily") {
    const { runDailyChallenge } = require('./knowledge-base/daily');
    runDailyChallenge();
    return;
  }

  if (command === "graph") {
    const { buildSynonymsGraph } = require('./knowledge-base/graph-builder');
    buildSynonymsGraph();
    return;
  }

  if (command === "backup") {
    const { runSnapshotBackup } = require('./platform/backup');
    runSnapshotBackup();
    return;
  }

  if (command === "repl") {
    const { startRepl } = require('./cli/repl');
    await startRepl();
    return;
  }

  if (command === "speak") {
    const text = rest.join(" ");
    if (!text) throw new Error("Usage: tsm speak <text-or-headword>");
    const { synthesizeSpeech } = require('./platform/audio');
    synthesizeSpeech(text);
    return;
  }

  if (command === "journal") {
    const { buildWeeklyJournal } = require('./knowledge-base/journal');
    buildWeeklyJournal();
    return;
  }

  if (command === "search") {
    const kw = rest.join(" ");
    if (!kw) throw new Error("Usage: tsm search <keyword>");
    const { runGlobalSearch } = require('./knowledge-base/search');
    runGlobalSearch(kw);
    return;
  }

  if (command === "archive") {
    const { archiveCards } = require('./knowledge-base/archiver');
    archiveCards();
    return;
  }

  if (command === "add") {
    const word = rest[0];
    const trans = rest[1];
    const ctx = rest.slice(2).join(" ");
    if (!word || !trans) throw new Error("Usage: tsm add <word> <translation> [context]");
    const { manuallyAddCard } = require('./connectors/manual');
    manuallyAddCard(word, trans, ctx);
    return;
  }

  if (command === "trace") {
    const word = rest.join(" ");
    if (!word) throw new Error("Usage: tsm trace <word>");
    const { runCrossRefTrace } = require('./knowledge-base/cross-ref');
    runCrossRefTrace(word);
    return;
  }

  if (command === "quiz") {
    const { runMcqQuiz } = require('./knowledge-base/quiz');
    runMcqQuiz();
    return;
  }

  if (command === "cluster") {
    const { runSemanticClusters } = require('./knowledge-base/cluster');
    runSemanticClusters();
    return;
  }

  if (command === "telemetry") {
    const { Telemetry } = require('./platform/telemetry');
    Telemetry.printReport();
    return;
  }

  throw new Error(
    `Unknown command "${command}". Use "tsm help" to see the available commands.`,
  );
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
