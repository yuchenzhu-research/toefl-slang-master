import { useState, useEffect } from 'react'
import { ICON } from '../components/icons'
import { ToolStatusChip } from '../components/ToolStatusChip'
import { checkHealth } from '../api/client'
import { StatusMessage } from '../components/Workspace'

export function ContentPage() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'reachable' | 'unavailable'>('checking')

  const checkBackendHealth = async () => {
    setBackendStatus('checking')
    const res = await checkHealth()
    if (res.ok && res.data?.ok) {
      setBackendStatus('reachable')
    } else {
      setBackendStatus('unavailable')
    }
  }

  useEffect(() => {
    checkBackendHealth()
  }, [])

  return (
    <main className="main ws-page">
      <div className="main-inner">
        <div className="ws-page-header">
          <div className="ws-page-breadcrumb">
            <span className="badge">
              <span dangerouslySetInnerHTML={{ __html: ICON.fileText }} />
              Content Parser
            </span>
            <ToolStatusChip
              status={backendStatus === 'reachable' ? 'complete' : backendStatus === 'unavailable' ? 'error' : 'checking'}
              label={backendStatus === 'reachable' ? 'Online' : backendStatus === 'unavailable' ? 'Offline' : 'Checking'}
            />
            <button
              type="button"
              className="ws-refresh-btn"
              onClick={checkBackendHealth}
              aria-label="Refresh backend status"
              title="Refresh backend status"
            >
              ↺
            </button>
          </div>
        </div>

        <div className="ws-wip-banner">
          <span className="ws-wip-badge">WIP</span>
          Artifact-first parsing pipeline. CLI support available now.
        </div>

        {backendStatus === 'unavailable' && (
          <div className="backend-status-container" style={{ margin: '1rem 0' }}>
            <StatusMessage
              type="unavailable"
              message="Local server disconnected. Check status or launch backend."
              onClick={checkBackendHealth}
              style={{ cursor: 'pointer' }}
            />
          </div>
        )}

        <h1 className="headline">
          Deep Material
          <br />
          <span style={{ opacity: 0.5, fontSize: '0.7em', fontStyle: 'italic' }}>Analysis Coming Soon</span>
        </h1>
        <p className="subtitle">
          This module will break down high-quality foreign publications (PDF/MD/TXT) to extract
          reusable sentence templates and cultural contexts. Outputs land as Markdown artifacts and
          JSON sidecars.
        </p>
        <div className="placeholder-card">
          <p className="ws-section-label">CLI Usage</p>
          <pre>
            <code>spark content --file article.pdf</code>
          </pre>
        </div>
      </div>
    </main>
  )
}
