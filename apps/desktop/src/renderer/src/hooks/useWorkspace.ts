import { useState, useCallback } from 'react'

export type WorkspaceToolStatus = 'idle' | 'checking' | 'running' | 'complete' | 'error'

export type WorkspaceEventType =
  | 'command-submitted'
  | 'backend-checking'
  | 'tool-running'
  | 'artifact-created'
  | 'error'
  | 'complete'

export interface WorkspaceArtifact {
  id: string
  title: string
  type: 'markdown' | 'json' | 'error'
  content: string
  metadata?: Record<string, any>
}

export interface WorkspaceEvent {
  id: string
  timestamp: string
  type: WorkspaceEventType
  message: string
  details?: any
  toolName?: string
  toolStatus?: WorkspaceToolStatus
  artifactId?: string
}

export interface WorkspaceCommand {
  id: string
  text: string
  parsed?: {
    command: string
    args: string
  }
}

export interface WorkspaceSession {
  id: string
  createdAt: string
  updatedAt: string
  status: 'active' | 'completed' | 'error'
  commands: WorkspaceCommand[]
  events: WorkspaceEvent[]
  artifacts: WorkspaceArtifact[]
}

export interface UseWorkspaceResult {
  session: WorkspaceSession | null
  activeArtifact: WorkspaceArtifact | null
  initSession: (sessionId: string) => void
  appendEvent: (event: WorkspaceEvent) => void
  addCommand: (command: WorkspaceCommand) => void
  addArtifact: (artifact: WorkspaceArtifact) => void
  setActiveArtifact: (artifact: WorkspaceArtifact | null) => void
  setSessionStatus: (status: 'active' | 'completed' | 'error') => void
  resetSession: () => void
}

/**
 * React Hook serving as the renderer-side state adapter for workspace session state.
 * Uses local DTOs mirroring the shared workspace contracts.
 */
export function useWorkspace(): UseWorkspaceResult {
  const [session, setSession] = useState<WorkspaceSession | null>(null)
  const [activeArtifact, setActiveArtifactState] = useState<WorkspaceArtifact | null>(null)

  const initSession = useCallback((sessionId: string) => {
    const now = new Date().toISOString()
    setSession({
      id: sessionId,
      createdAt: now,
      updatedAt: now,
      status: 'active',
      commands: [],
      events: [],
      artifacts: []
    })
    setActiveArtifactState(null)
  }, [])

  const appendEvent = useCallback((event: WorkspaceEvent) => {
    setSession((prev) => {
      if (!prev) return null
      return {
        ...prev,
        events: [...prev.events, event],
        updatedAt: new Date().toISOString()
      }
    })
  }, [])

  const addCommand = useCallback((command: WorkspaceCommand) => {
    setSession((prev) => {
      if (!prev) return null
      return {
        ...prev,
        commands: [...prev.commands, command],
        updatedAt: new Date().toISOString()
      }
    })
  }, [])

  const addArtifact = useCallback((artifact: WorkspaceArtifact) => {
    setSession((prev) => {
      if (!prev) return null
      return {
        ...prev,
        artifacts: [...prev.artifacts, artifact],
        updatedAt: new Date().toISOString()
      }
    })
    setActiveArtifactState(artifact)
  }, [])

  const setActiveArtifact = useCallback((artifact: WorkspaceArtifact | null) => {
    setActiveArtifactState(artifact)
  }, [])

  const setSessionStatus = useCallback((status: 'active' | 'completed' | 'error') => {
    setSession((prev) => {
      if (!prev) return null
      return {
        ...prev,
        status,
        updatedAt: new Date().toISOString()
      }
    })
  }, [])

  const resetSession = useCallback(() => {
    setSession(null)
    setActiveArtifactState(null)
  }, [])

  return {
    session,
    activeArtifact,
    initSession,
    appendEvent,
    addCommand,
    addArtifact,
    setActiveArtifact,
    setSessionStatus,
    resetSession
  }
}
