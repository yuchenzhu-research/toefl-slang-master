import { WorkspaceArtifact } from '../hooks/useWorkspace'

interface ArtifactRailProps {
  activeArtifact: WorkspaceArtifact | null
}

export function ArtifactRail({ activeArtifact }: ArtifactRailProps) {
  if (!activeArtifact) {
    return (
      <div className="artifact-rail-empty">
        <p className="empty-text">No active artifact</p>
        <span className="empty-hint">Select an artifact from the timeline or run a command to view details.</span>
      </div>
    )
  }

  // 简易 Markdown 解析器，用于安全展示 headings, bold 还有 lists
  const renderMarkdownContent = (content: string) => {
    const lines = content.split('\n')
    return (
      <div className="markdown-preview-body">
        {lines.map((line, idx) => {
          const trimmed = line.trim()
          if (trimmed.startsWith('# ')) {
            return <h1 key={idx}>{trimmed.substring(2)}</h1>
          } else if (trimmed.startsWith('## ')) {
            return <h2 key={idx}>{trimmed.substring(3)}</h2>
          } else if (trimmed.startsWith('### ')) {
            return <h3 key={idx}>{trimmed.substring(4)}</h3>
          } else if (trimmed.startsWith('> [!')) {
            const typeEnd = trimmed.indexOf(']')
            if (typeEnd !== -1) {
              const alertType = trimmed.substring(4, typeEnd)
              // 寻找下一行或者这行内容
              const boxContent = trimmed.substring(typeEnd + 1).trim()
              return (
                <div key={idx} className={`alert-box alert-${alertType.toLowerCase()}`}>
                  <strong>{alertType}:</strong> {boxContent}
                </div>
              )
            }
            return <blockquote key={idx}>{trimmed.substring(2)}</blockquote>
          } else if (trimmed.startsWith('> ')) {
            return <blockquote key={idx}>{trimmed.substring(2)}</blockquote>
          } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            return <li key={idx}>{trimmed.substring(2)}</li>
          } else if (trimmed === '---') {
            return <hr key={idx} />
          } else if (trimmed) {
            const parts = trimmed.split('**')
            if (parts.length > 1) {
              return (
                <p key={idx}>
                  {parts.map((part, pIdx) => (pIdx % 2 === 1 ? <strong key={pIdx}>{part}</strong> : part))}
                </p>
              )
            }
            return <p key={idx}>{trimmed}</p>
          }
          return <div key={idx} style={{ height: '8px' }} />
        })}
      </div>
    )
  }

  const renderJsonSummary = (metadata?: Record<string, any>) => {
    if (!metadata || Object.keys(metadata).length === 0) {
      return <p className="json-empty">No metadata sidecar available.</p>
    }

    return (
      <div className="json-summary-list">
        {Object.entries(metadata).map(([key, value]) => (
          <div key={key} className="json-summary-item">
            <span className="summary-key">{key}</span>
            <span className="summary-val">{String(value)}</span>
          </div>
        ))}
      </div>
    )
  }

  const parseJsonSafely = (jsonStr: string) => {
    try {
      return JSON.parse(jsonStr)
    } catch {
      return { content: jsonStr }
    }
  }

  return (
    <div className="artifact-rail">
      <div className="artifact-rail-header">
        <span className="artifact-badge">{activeArtifact.type.toUpperCase()}</span>
        <h4 className="artifact-rail-title">{activeArtifact.title}</h4>
      </div>

      <div className="artifact-rail-body">
        {activeArtifact.type === 'markdown' ? (
          renderMarkdownContent(activeArtifact.content)
        ) : activeArtifact.type === 'json' ? (
          <div className="json-preview-container">
            <div className="json-meta-section">
              <h5>Sidecar Metadata</h5>
              {renderJsonSummary(activeArtifact.metadata)}
            </div>
            <div className="json-raw-section">
              <h5>Raw Payload Preview</h5>
              <pre className="json-raw-code">
                {JSON.stringify(parseJsonSafely(activeArtifact.content), null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="error-artifact-view">
            <p className="error-text">{activeArtifact.content}</p>
          </div>
        )}
      </div>
    </div>
  )
}
