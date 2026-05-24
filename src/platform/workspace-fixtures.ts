import { WorkspaceSession } from "./contracts";

/**
 * DEVELOPMENT/DEMO DATA ONLY.
 * Deterministic workspace session fixture used for visual testing and CLI simulation
 * without making live provider API calls.
 */
export const MOCK_WORKSPACE_SESSION: WorkspaceSession = {
  id: "session-demo-999",
  createdAt: "2026-05-24T00:00:00.000Z",
  updatedAt: "2026-05-24T00:01:00.000Z",
  status: "completed",
  commands: [
    {
      id: "cmd-demo-001",
      text: "/dict a big deal",
      parsed: {
        command: "dict",
        args: "a big deal"
      }
    }
  ],
  events: [
    {
      id: "evt-demo-001",
      timestamp: "2026-05-24T00:00:05.000Z",
      type: "command-submitted",
      message: "Submitted command: /dict a big deal"
    },
    {
      id: "evt-demo-002",
      timestamp: "2026-05-24T00:00:10.000Z",
      type: "tool-running",
      message: "Looking up 'a big deal' in Dictionary Pro...",
      toolName: "dictionary_lookup",
      toolStatus: "running"
    },
    {
      id: "evt-demo-003",
      timestamp: "2026-05-24T00:00:45.000Z",
      type: "artifact-created",
      message: "Generated academic conversion card for 'a big deal'",
      artifactId: "art-demo-001"
    },
    {
      id: "evt-demo-004",
      timestamp: "2026-05-24T00:00:50.000Z",
      type: "complete",
      message: "Workspace task completed successfully",
      toolStatus: "complete"
    }
  ],
  artifacts: [
    {
      id: "art-demo-001",
      title: "Expression Card: a big deal",
      type: "markdown",
      content: `# a big deal\n\n> [!NOTE]\n> DEVELOPMENT DEMO DATA ONLY. This is a mockup of a Dictionary Pro expression card.\n\n**Translation**: 极其重要的事情，大手笔\n\n---\n\n### Academic Alternatives\n1. **a significant milestone / event** (Formal)\n2. **of major import** (Academic)\n3. **a substantial challenge** (ETS context)\n\n---\n\n### Contextual Usage\n* *Informal*: Landing this customer is **a big deal** for our startup.\n* *Academic*: Securing this funding represents **a significant milestone** for the research laboratory.\n`,
      metadata: {
        headword: "a big deal",
        mode: "conversion",
        target: "toefl-writing"
      }
    }
  ]
};
