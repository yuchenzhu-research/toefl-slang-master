import {
  WorkspaceEvent,
  WorkspaceToolStatus,
  WorkspaceArtifact
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
