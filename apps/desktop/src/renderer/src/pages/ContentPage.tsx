import { ICON } from '../components/icons'

export function ContentPage() {
  return (
    <main className="main ws-page">
      <div className="main-inner">
        <div className="ws-page-header">
          <div className="ws-page-breadcrumb">
            <span className="badge">
              <span dangerouslySetInnerHTML={{ __html: ICON.fileText }} />
              Content Parser
            </span>
          </div>
        </div>

        <div className="ws-wip-banner">
          <span className="ws-wip-badge">WIP</span>
          Artifact-first parsing pipeline. CLI support available now.
        </div>

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
