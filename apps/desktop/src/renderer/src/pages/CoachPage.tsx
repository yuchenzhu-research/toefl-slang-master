import { ICON } from '../components/icons'

export function CoachPage() {
  return (
    <main className="main">
      <div className="main-inner">
        <div className="badge">
          <span dangerouslySetInnerHTML={{ __html: ICON.penTool }} />
          TOEFL Coach
        </div>
        <h1 className="headline">
          Writing Diagnosis
          <br />
          Coming Soon
        </h1>
        <p className="subtitle">
          This module will provide rigorous diagnosis based on official ETS rubrics, extract weak
          expressions, and suggest complex academic transitions.
        </p>
        <div className="placeholder-card">
          <p>The GUI for TOEFL Coach is currently under development. Please use the CLI for now:</p>
          <pre>
            <code>spark coach --file ./essay.txt</code>
          </pre>
        </div>
      </div>
    </main>
  )
}
