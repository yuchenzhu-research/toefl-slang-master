import test from "node:test";
import assert from "node:assert";
import {
  WorkspaceSession,
  WorkspaceCommand,
  WorkspaceEvent,
  WorkspaceArtifact,
  WorkspaceCommandResult
} from "../src/platform/contracts";
import {
  createCommandSubmittedEvent,
  createBackendCheckingEvent,
  createToolRunningEvent,
  createArtifactCreatedEvent,
  createWorkspaceErrorEvent,
  createWorkspaceCompleteEvent,
  parseWorkspaceCommand
} from "../src/platform/workspace-helpers";

test("Workspace Model: should support complete session lifecycle and command result shape", () => {
  // 1. Initialize an active workspace session
  const session: WorkspaceSession = {
    id: "session-123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "active",
    commands: [],
    events: [],
    artifacts: []
  };

  assert.strictEqual(session.id, "session-123");
  assert.strictEqual(session.status, "active");
  assert.strictEqual(session.commands.length, 0);

  // 2. Simulate user submitting a slash command
  const command: WorkspaceCommand = {
    id: "cmd-001",
    text: "/dict a big deal",
    parsed: {
      command: "dict",
      args: "a big deal"
    }
  };
  session.commands.push(command);
  session.updatedAt = new Date().toISOString();

  assert.strictEqual(session.commands.length, 1);
  assert.strictEqual(session.commands[0].parsed?.command, "dict");

  // 3. Simulate agent processing events
  const event1: WorkspaceEvent = {
    id: "evt-001",
    timestamp: new Date().toISOString(),
    type: "command-submitted",
    message: "User submitted command: /dict a big deal"
  };

  const event2: WorkspaceEvent = {
    id: "evt-002",
    timestamp: new Date().toISOString(),
    type: "tool-running",
    message: "Running Dictionary Pro lookup...",
    toolName: "dictionary_lookup",
    toolStatus: "running"
  };

  session.events.push(event1, event2);
  assert.strictEqual(session.events.length, 2);
  assert.strictEqual(session.events[1].toolName, "dictionary_lookup");
  assert.strictEqual(session.events[1].toolStatus, "running");

  // 4. Simulate artifact generation
  const artifact: WorkspaceArtifact = {
    id: "art-001",
    title: "Expression Card: a big deal",
    type: "markdown",
    content: "# a big deal\n\n**Translation**: 大手笔，重要的事情\n\n**Academic Alignments**: significant event, major issue",
    metadata: {
      headword: "a big deal",
      mode: "upgrade"
    }
  };
  session.artifacts.push(artifact);

  const event3: WorkspaceEvent = {
    id: "evt-003",
    timestamp: new Date().toISOString(),
    type: "artifact-created",
    message: "Created expression card artifact for 'a big deal'",
    artifactId: "art-001"
  };
  const event4: WorkspaceEvent = {
    id: "evt-004",
    timestamp: new Date().toISOString(),
    type: "complete",
    message: "Dictionary command execution complete.",
    toolStatus: "complete"
  };
  session.events.push(event3, event4);

  assert.strictEqual(session.artifacts.length, 1);
  assert.strictEqual(session.artifacts[0].type, "markdown");
  assert.strictEqual(session.events.length, 4);

  // 5. Build and verify WorkspaceCommandResult shape
  const commandResult: WorkspaceCommandResult = {
    commandId: "cmd-001",
    status: "success",
    artifacts: [artifact]
  };

  assert.strictEqual(commandResult.commandId, "cmd-001");
  assert.strictEqual(commandResult.status, "success");
  assert.strictEqual(commandResult.artifacts[0].id, "art-001");
});

test("Workspace Event Helpers: should create correct WorkspaceEvent objects", () => {
  // Test command-submitted
  const e1 = createCommandSubmittedEvent("/dict test", "e-1");
  assert.strictEqual(e1.id, "e-1");
  assert.strictEqual(e1.type, "command-submitted");
  assert.strictEqual(e1.message, "Submitted command: /dict test");
  assert.ok(e1.timestamp);

  // Test tool-running
  const e2 = createToolRunningEvent("translator", "Translating words...", "e-2");
  assert.strictEqual(e2.id, "e-2");
  assert.strictEqual(e2.type, "tool-running");
  assert.strictEqual(e2.toolName, "translator");
  assert.strictEqual(e2.toolStatus, "running");
  assert.strictEqual(e2.message, "Translating words...");

  // Test error
  const e3 = createWorkspaceErrorEvent("Failed to reach LLM API", "e-3");
  assert.strictEqual(e3.id, "e-3");
  assert.strictEqual(e3.type, "error");
  assert.strictEqual(e3.message, "Error: Failed to reach LLM API");
  assert.strictEqual(e3.toolStatus, "error");

  // Test auto-generated ID
  const e4 = createWorkspaceCompleteEvent();
  assert.ok(e4.id.startsWith("evt-"));
  assert.strictEqual(e4.type, "complete");
  assert.strictEqual(e4.toolStatus, "complete");
});

test("Workspace Command Parser: should parse workspace inputs correctly", () => {
  // Test dict
  const c1 = parseWorkspaceCommand("/dict a big deal", "c-1");
  assert.strictEqual(c1.id, "c-1");
  assert.strictEqual(c1.parsed?.command, "dict");
  assert.strictEqual(c1.parsed?.args, "a big deal");

  // Test style
  const c2 = parseWorkspaceCommand("/style analytical texts", "c-2");
  assert.strictEqual(c2.id, "c-2");
  assert.strictEqual(c2.parsed?.command, "style");
  assert.strictEqual(c2.parsed?.args, "analytical texts");

  // Test coach
  const c3 = parseWorkspaceCommand("/coach rough writing draft", "c-3");
  assert.strictEqual(c3.id, "c-3");
  assert.strictEqual(c3.parsed?.command, "coach");
  assert.strictEqual(c3.parsed?.args, "rough writing draft");

  // Test content
  const c4 = parseWorkspaceCommand("/content /path/to/notes.md", "c-4");
  assert.strictEqual(c4.id, "c-4");
  assert.strictEqual(c4.parsed?.command, "content");
  assert.strictEqual(c4.parsed?.args, "/path/to/notes.md");

  // Test empty input
  const c5 = parseWorkspaceCommand("   ");
  assert.ok(c5.id.startsWith("cmd-"));
  assert.strictEqual(c5.parsed, undefined);

  // Test unknown command
  const c6 = parseWorkspaceCommand("/unknown test arg");
  assert.strictEqual(c6.parsed?.command, "unknown");
  assert.strictEqual(c6.parsed?.args, "/unknown test arg");
});
