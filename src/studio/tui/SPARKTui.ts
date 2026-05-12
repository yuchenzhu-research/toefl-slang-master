import readline from "readline";
import chalk from "chalk";
import { highlight } from "cli-highlight";
import type { ToeflSlangClientOptions } from "../../platform/client";
import { runDictionaryProQuery } from "../../dictionary-pro/runner";

function renderMarkdown(md: string): string {
  try {
    return highlight(md, {
      language: "markdown",
      ignoreIllegals: true,
      theme: {
        keyword: chalk.blue,
        built_in: chalk.cyan,
        type: chalk.cyan.dim,
        literal: chalk.blue,
        number: chalk.green,
        regexp: chalk.red,
        string: chalk.yellow,
        subst: chalk.white,
        symbol: chalk.white,
        class: chalk.blue,
        function: chalk.yellow,
        title: chalk.bold.white,
        params: chalk.white,
        comment: chalk.gray.italic,
        doctag: chalk.green,
        meta: chalk.gray,
        section: chalk.bold.magenta,
        attr: chalk.cyan,
        attribute: chalk.cyan,
        variable: chalk.white,
        bullet: chalk.yellow,
        code: chalk.green,
        emphasis: chalk.italic,
        strong: chalk.bold,
        formula: chalk.cyan,
        link: chalk.underline.blue,
        quote: chalk.gray.italic,
      },
    });
  } catch {
    return md;
  }
}

class Spinner {
  private timer: NodeJS.Timeout | null = null;
  private frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  private i = 0;
  private text = "";

  start(text: string) {
    this.text = text;
    process.stdout.write("\x1B[?25l"); // hide cursor
    this.timer = setInterval(() => {
      process.stdout.write(`\r${chalk.cyan(this.frames[this.i])} ${this.text}`);
      this.i = (this.i + 1) % this.frames.length;
    }, 80);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    process.stdout.write("\r\x1B[K\x1B[?25h"); // clear line and show cursor
  }
}

export async function runTui(options: {
  clientOptions: ToeflSlangClientOptions;
  dryRun?: boolean;
}): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.green("❯ "),
  });

  console.log(chalk.bold.magenta("╭───────────────────────────────────────────────╮"));
  console.log(chalk.bold.magenta("│ ") + chalk.bold.white("SPARK Studio (Claude Code Style)              ") + chalk.bold.magenta("│"));
  console.log(chalk.bold.magenta("│ ") + chalk.gray("Type any word or phrase. Type 'exit' to quit. ") + chalk.bold.magenta("│"));
  console.log(chalk.bold.magenta("╰───────────────────────────────────────────────╯\n"));

  if (options.dryRun) {
    console.log(chalk.yellow("⚠️  Dry-run mode enabled: No API calls will be made.\n"));
  }

  const spinner = new Spinner();

  rl.prompt();

  rl.on("line", async (line) => {
    const text = line.trim();
    if (!text) {
      rl.prompt();
      return;
    }

    if (text.toLowerCase() === "exit" || text.toLowerCase() === "quit") {
      rl.close();
      return;
    }

    spinner.start(`Thinking about "${text}"...`);

    try {
      if (options.dryRun) {
        // Simulate delay
        await new Promise((res) => setTimeout(res, 800));
        spinner.stop();
        console.log(
          renderMarkdown(`### 🔍 Result for "${text}"\n\n> This is a simulated response because \`--dry-run\` is enabled.\n\nRun without \`--dry-run\` to fetch real definitions.`)
        );
      } else {
        const dpResult = await runDictionaryProQuery({
          query: {
            text: text,
            target: "general-academic",
            mode: "auto" as any,
          },
          clientOptions: options.clientOptions,
        });

        spinner.stop();
        console.log("\n" + renderMarkdown(dpResult.markdown) + "\n");
      }
    } catch (err: any) {
      spinner.stop();
      console.log(chalk.red(`\n✘ Error: ${err.message}\n`));
    }

    rl.prompt();
  }).on("close", () => {
    console.log(chalk.gray("\nExiting SPARK Studio. Goodbye!"));
    process.exit(0);
  });
}
