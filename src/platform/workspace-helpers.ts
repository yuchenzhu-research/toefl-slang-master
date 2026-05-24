import {
  WorkspaceEvent,
  WorkspaceToolStatus,
  WorkspaceArtifact,
  WorkspaceCommand,
  WorkspaceCommandResult
} from "./contracts";

let eventIdCounter = 0;
function generateEventId(): string {
  eventIdCounter += 1;
  return `evt-${Date.now()}-${eventIdCounter}`;
}

/**
 * Creates a command-submitted event.
 */
export function createCommandSubmittedEvent(
  commandText: string,
  injectedId?: string
): WorkspaceEvent {
  return {
    id: injectedId || generateEventId(),
    timestamp: new Date().toISOString(),
    type: "command-submitted",
    message: `Submitted command: ${commandText}`
  };
}

/**
 * Creates a backend-checking event.
 */
export function createBackendCheckingEvent(
  endpoint: string,
  injectedId?: string
): WorkspaceEvent {
  return {
    id: injectedId || generateEventId(),
    timestamp: new Date().toISOString(),
    type: "backend-checking",
    message: `Checking backend availability at ${endpoint}`
  };
}

/**
 * Creates a tool-running event.
 */
export function createToolRunningEvent(
  toolName: string,
  message?: string,
  injectedId?: string
): WorkspaceEvent {
  return {
    id: injectedId || generateEventId(),
    timestamp: new Date().toISOString(),
    type: "tool-running",
    message: message || `Tool is running: ${toolName}`,
    toolName,
    toolStatus: "running"
  };
}

/**
 * Creates an artifact-created event.
 */
export function createArtifactCreatedEvent(
  artifactId: string,
  title: string,
  injectedId?: string
): WorkspaceEvent {
  return {
    id: injectedId || generateEventId(),
    timestamp: new Date().toISOString(),
    type: "artifact-created",
    message: `Created artifact '${title}'`,
    artifactId
  };
}

/**
 * Creates a workspace error event.
 */
export function createWorkspaceErrorEvent(
  errorMessage: string,
  injectedId?: string
): WorkspaceEvent {
  return {
    id: injectedId || generateEventId(),
    timestamp: new Date().toISOString(),
    type: "error",
    message: `Error: ${errorMessage}`,
    toolStatus: "error"
  };
}

/**
 * Creates a complete event.
 */
export function createWorkspaceCompleteEvent(
  message?: string,
  injectedId?: string
): WorkspaceEvent {
  return {
    id: injectedId || generateEventId(),
    timestamp: new Date().toISOString(),
    type: "complete",
    message: message || "Command execution completed successfully.",
    toolStatus: "complete"
  };
}

let commandIdCounter = 0;
function generateCommandId(): string {
  commandIdCounter += 1;
  return `cmd-${Date.now()}-${commandIdCounter}`;
}

/**
 * Parses user input text into a WorkspaceCommand.
 */
export function parseWorkspaceCommand(
  inputText: string,
  injectedId?: string
): WorkspaceCommand {
  const id = injectedId || generateCommandId();
  const trimmed = inputText.trim();

  if (!trimmed) {
    return {
      id,
      text: inputText
    };
  }

  // Matches pattern: /command args
  const match = trimmed.match(/^\/([a-zA-Z0-9_-]+)(?:\s+([\s\S]*))?$/);
  if (!match) {
    return {
      id,
      text: inputText,
      parsed: {
        command: "unknown",
        args: trimmed
      }
    };
  }

  const cmd = match[1].toLowerCase();
  const args = (match[2] || "").trim();

  const validCommands = ["dict", "style", "coach", "content", "clear", "exit", "help"];

  if (validCommands.includes(cmd)) {
    return {
      id,
      text: inputText,
      parsed: {
        command: cmd,
        args
      }
    };
  }

  return {
    id,
    text: inputText,
    parsed: {
      command: "unknown",
      args: trimmed
    }
  };
}

let artifactIdCounter = 0;
function generateArtifactId(): string {
  artifactIdCounter += 1;
  return `art-${Date.now()}-${artifactIdCounter}`;
}

/**
 * Creates a markdown artifact.
 */
export function createMarkdownArtifact(
  title: string,
  markdownContent: string,
  injectedId?: string
): WorkspaceArtifact {
  return {
    id: injectedId || generateArtifactId(),
    title,
    type: "markdown",
    content: markdownContent
  };
}

/**
 * Creates a JSON artifact.
 */
export function createJsonArtifact(
  title: string,
  data: Record<string, any>,
  injectedId?: string
): WorkspaceArtifact {
  return {
    id: injectedId || generateArtifactId(),
    title,
    type: "json",
    content: JSON.stringify(data, null, 2),
    metadata: data
  };
}

/**
 * Creates an error artifact.
 */
export function createErrorArtifact(
  title: string,
  errorMessage: string,
  injectedId?: string
): WorkspaceArtifact {
  return {
    id: injectedId || generateArtifactId(),
    title,
    type: "error",
    content: errorMessage
  };
}

/**
 * Normalizes Dictionary API response/error into a WorkspaceCommandResult.
 */
export function normalizeDictionaryLookup(
  response: any,
  query: any,
  error?: any
): WorkspaceCommandResult {
  const commandId = query?.id || "cmd-unknown";
  const artifacts: WorkspaceArtifact[] = [];

  // 1. Handle Error state
  if (error) {
    const errorMsg = error.message || String(error);
    const errArtifact = createErrorArtifact("Dictionary Lookup Error", errorMsg);
    return {
      commandId,
      status: "error",
      artifacts: [errArtifact],
      error: errorMsg
    };
  }

  // 2. Handle Dry-Run state
  if (query?.dryRun || response?.dryRun) {
    const queryText = query?.text || "Unknown";
    const markdownContent = `# ${queryText} (Dry Run Mock)

> [!NOTE]
> This lookup was run in dry-run mode. No provider API calls were performed.

- **Query**: ${queryText}
- **Mode**: ${query?.mode || "conversion"}
- **Target**: ${query?.target || "toefl-writing"}
`;
    const mdArtifact = createMarkdownArtifact(
      `Expression Card: ${queryText} (Dry Run)`,
      markdownContent
    );

    const metadataArtifact = createJsonArtifact(
      "Query Metadata",
      {
        text: queryText,
        mode: query?.mode || "conversion",
        target: query?.target || "toefl-writing",
        dryRun: true,
        timestamp: new Date().toISOString()
      }
    );

    return {
      commandId,
      status: "success",
      artifacts: [mdArtifact, metadataArtifact]
    };
  }

  // 3. Handle Normal response state
  if (response && response.structured) {
    const queryText = query?.text || response.structured.query || "Unknown";
    const mdArtifact = createMarkdownArtifact(
      `Expression Card: ${queryText}`,
      response.markdown || "No markdown content provided."
    );

    const jsonArtifact = createJsonArtifact(
      "Expression Card Data",
      response.structured
    );

    return {
      commandId,
      status: "success",
      artifacts: [mdArtifact, jsonArtifact]
    };
  }

  // Fallback error state
  const fallbackError = "Invalid API response structure. Missing structured content.";
  const fallbackArt = createErrorArtifact("Dictionary Lookup Error", fallbackError);
  return {
    commandId,
    status: "error",
    artifacts: [fallbackArt],
    error: fallbackError
  };
}
