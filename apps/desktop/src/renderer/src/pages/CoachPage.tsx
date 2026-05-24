import { ICON } from '../components/icons'

export function CoachPage() {
  return (
    <main className="main ws-page">
      <div className="main-inner">
        <div className="ws-page-header">
          <div className="ws-page-breadcrumb">
            <span className="badge">
              <span dangerouslySetInnerHTML={{ __html: ICON.penTool }} />
              TOEFL Coach
            </span>
          </div>
        </div>

        <div className="ws-wip-banner">
          <span className="ws-wip-badge">WIP</span>
          Writing diagnosis GUI is under active development. Use the CLI for full pipeline access.
        </div>

        <h1 className="headline">
          Writing Diagnosis
          <br />
          <span style={{ opacity: 0.5, fontSize: '0.7em', fontStyle: 'italic' }}>Coming Soon</span>
        </h1>
        <p className="subtitle">
          This module will provide rigorous diagnosis based on official ETS rubrics, extract weak
          expressions, and suggest complex academic transitions.
        </p>
        <div className="placeholder-card">
          <p className="ws-section-label">CLI Usage</p>
          <pre>
            <code>spark coach --file ./essay.txt</code>
          </pre>
        </div>
      </div>
    </main>
  )
}
