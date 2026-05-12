import { useState, useRef, useEffect } from "react";

const SPARKLE_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z"/></svg>`;
const ARROW_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
const CLOSE_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const BOOK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
const LAYERS_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`;

const DEFAULT_TEXT =
  "The university's draconian policies regarding dormitory curfews have sparked widespread backlash among the student body, many of whom argue that such archaic rules are incompatible with modern academic life. Therefore, the administration must reconsider its stance because a strict approach may ultimately suppress student engagement.";

function scoreClass(score: number): string {
  if (score > 70) return "green";
  if (score > 40) return "amber";
  return "rose";
}

export default function App(): JSX.Element {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const barRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (analysis && panelOpen) {
      // Animate bars after panel opens
      const timer = setTimeout(() => {
        barRefs.current.forEach((el, i) => {
          if (el && analysis.metrics[i]) {
            el.style.width = analysis.metrics[i].score + "%";
          }
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [analysis, panelOpen]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("http://127.0.0.1:4173/api/style/economist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setAnalysis(data);
      // Reset bar widths before opening
      barRefs.current.forEach(el => { if (el) el.style.width = "0%"; });
      setPanelOpen(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="logo">S</div>
        <div className="sidebar-nav">
          <button className="nav-btn active" dangerouslySetInnerHTML={{ __html: BOOK_SVG }} />
          <button className="nav-btn" dangerouslySetInnerHTML={{ __html: LAYERS_SVG }} />
        </div>
        <div className="avatar" />
      </nav>

      {/* Main */}
      <main className="main">
        <div className="main-inner">
          <div className="badge">
            <span dangerouslySetInnerHTML={{ __html: SPARKLE_SVG }} />
            The Economist Style Engine
          </div>

          <h1 className="headline">Evaluate Your<br />Academic Prose</h1>
          <p className="subtitle">
            Paste your essay below. SPARK will analyze it against The Economist's editorial standards
            — sentence rhythm, contrast turns, causal logic, analytical hedging, and policy vocabulary.
          </p>

          <div className="editor-wrapper">
            <textarea
              className="editor"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or paste your English text here..."
            />
            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !text.trim()}
            >
              {isAnalyzing ? (
                <div className="spinner" />
              ) : (
                <>
                  Analyze
                  <span dangerouslySetInnerHTML={{ __html: ARROW_SVG }} />
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Analysis Panel */}
      <div className={`panel-overlay ${panelOpen ? "open" : ""}`}>
        <div className="panel-header">
          <div>
            <div className="panel-label">Style Report</div>
            <div className="panel-title">{analysis?.title || "Economist Profile"}</div>
          </div>
          <button className="close-btn" onClick={() => setPanelOpen(false)}>
            <span dangerouslySetInnerHTML={{ __html: CLOSE_SVG }} />
          </button>
        </div>

        {analysis && (
          <div className="panel-body">
            {/* Score */}
            <div className="score-section">
              <div className="score-row">
                <div className={`score-number ${scoreClass(analysis.overallScore)}`}>
                  {analysis.overallScore}
                </div>
                <div className="score-label">/ 100</div>
              </div>
              <p className="score-summary">{analysis.summary}</p>
            </div>

            {/* Metrics */}
            <div>
              <div className="section-title">Metrics Breakdown</div>
              {analysis.metrics?.map((metric: any, idx: number) => (
                <div key={metric.id} className="metric">
                  <div className="metric-header">
                    <span className="metric-name">{metric.label}</span>
                    <span className="metric-score">{metric.score}%</span>
                  </div>
                  <div className="bar-track">
                    <div
                      ref={(el) => { if (el) barRefs.current[idx] = el; }}
                      className={`bar-fill ${scoreClass(metric.score)}`}
                      style={{ width: "0%" }}
                    />
                  </div>
                  <div className="metric-note">{metric.note}</div>
                </div>
              ))}
            </div>

            {/* Suggestions */}
            {analysis.suggestions?.length > 0 && (
              <div className="suggestions">
                <div className="section-title">Actionable Suggestions</div>
                {analysis.suggestions.map((sug: any, idx: number) => (
                  <div key={idx} className="suggestion-card">
                    <div className="suggestion-issue">{sug.issue}</div>
                    <div className="suggestion-action">{sug.action}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
