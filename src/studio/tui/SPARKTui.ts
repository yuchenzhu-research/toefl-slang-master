import { TUI, ProcessTerminal, Container, Text } from "@mariozechner/pi-tui";
import { theme, editorTheme } from "./theme";
import { ChatLog } from "./components/ChatLog";
import { CustomEditor } from "./components/CustomEditor";
import type { ToeflSlangClientOptions } from "../../platform/client";
import { runDictionaryProQuery } from "../../dictionary-pro/runner";
import { OutputManager } from "../../platform/output-manager";

export async function runTui(options: {
  clientOptions: ToeflSlangClientOptions;
  dryRun?: boolean;
}): Promise<void> {
  const tui = new TUI(new ProcessTerminal());

  const header = new Text(theme.header("SPARK Studio — Guided Learning Session"), 1, 0);
  const chatLog = new ChatLog();
  const statusContainer = new Container();
  const statusText = new Text(theme.dim("idle"), 1, 0);
  statusContainer.addChild(statusText);
  const footer = new Text(theme.dim("agent: dictPro | fast | press Ctrl+C to exit"), 1, 0);

  const editor = new CustomEditor(tui, editorTheme as any);

  const root = new Container();
  root.addChild(header);
  root.addChild(chatLog);
  root.addChild(statusContainer);
  root.addChild(footer);
  root.addChild(editor);

  tui.addChild(root);
  tui.setFocus(editor);

  let isExiting = false;

  const exitTui = () => {
    if (isExiting) return;
    isExiting = true;
    try {
      if (tui.terminal && 'setRawMode' in tui.terminal) {
          // best effort cleanup
      }
      console.clear();
    } catch {}
    process.exit(0);
  };

  editor.onCtrlC = exitTui;
  editor.onCtrlD = exitTui;
  editor.onEscape = exitTui;

  chatLog.addSystem("Welcome to SPARK Studio TUI. Type a word to look it up using Dictionary Pro. Note: /coach and /content integrations are WIP.");

  const handleSubmit = async () => {
    const text = editor.getText().trim();
    if (!text) return;
    
    // Clear editor
    editor.setText("");

    if (text === "exit" || text === "quit") {
      exitTui();
      return;
    }

    const runId = chatLog.addUser(text);
    statusText.setText(theme.dim("running..."));

    try {
      const astId = chatLog.addAssistant("Thinking...");
      
      const dpResult = await runDictionaryProQuery({
        query: {
          text: text,
          target: "general-academic",
          mode: "auto" as any,
        },
        clientOptions: options.clientOptions,
      });

      // Update the message inline
      const view = `[Word]: ${(dpResult.structured as any).headword || (dpResult.structured as any).targetWord || text}\n\n${dpResult.markdown}`;
      chatLog.updateAssistant(astId, view);

    } catch (err: any) {
      chatLog.addSystem(theme.error(`Error: ${err.message}`));
    } finally {
      statusText.setText(theme.dim("idle"));
    }
  };

  editor.onSubmit = handleSubmit;
  editor.onAltEnter = handleSubmit;
}
