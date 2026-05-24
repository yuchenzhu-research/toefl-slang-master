import { WorkspaceEvent } from '../hooks/useWorkspace'

interface SessionTimelineProps {
  events: WorkspaceEvent[]
  onArtifactClick?: (artifactId: string) => void
}

export function SessionTimeline({ events, onArtifactClick }: SessionTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="timeline-empty">
        <p className="empty-text">No events in this session.</p>
        <span className="empty-hint">Try: /dict a big deal</span>
      </div>
    )
  }

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString)
      const hrs = String(date.getHours()).padStart(2, '0')
      const mins = String(date.getMinutes()).padStart(2, '0')
      const secs = String(date.getSeconds()).padStart(2, '0')
      return `${hrs}:${mins}:${secs}`
    } catch {
      return ''
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'command-submitted':
        return <span className="event-icon icon-submit">➔</span>
      case 'backend-checking':
        return <span className="event-icon icon-checking">⚙</span>
      case 'tool-running':
        return (
          <span className="event-icon icon-tool-running">
            <span className="spinner-mini-inline" />
          </span>
        )
      case 'artifact-created':
        return <span className="event-icon icon-artifact">❖</span>
      case 'error':
        return <span className="event-icon icon-error">✗</span>
      case 'complete':
        return <span className="event-icon icon-complete">✓</span>
      default:
        return <span className="event-icon icon-bullet">•</span>
    }
  }

  return (
    <div className="session-timeline">
      <div className="timeline-list">
        {events.map((evt) => {
          const isArtifact = evt.type === 'artifact-created' && evt.artifactId
          return (
            <div key={evt.id} className={`timeline-item event-${evt.type}`}>
              <div className="timeline-item-meta">
                <span className="event-time">{formatTime(evt.timestamp)}</span>
                {getEventIcon(evt.type)}
              </div>
              <div className="timeline-item-content">
                <p className="event-message">
                  {evt.message}
                  {evt.toolName && <span className="event-tool-name"> ({evt.toolName})</span>}
                </p>
                {isArtifact && (
                  <button
                    type="button"
                    className="timeline-artifact-link"
                    onClick={() => onArtifactClick?.(evt.artifactId!)}
                  >
                    View Artifact
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
