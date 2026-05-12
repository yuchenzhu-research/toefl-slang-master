import { useState, useRef, useEffect } from "react";

/* ── Inline SVG Icons ── */
const ICON = {
  sparkle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
};

const DEFAULT_TEXT =
  "The university's draconian policies regarding dormitory curfews have sparked widespread backlash among the student body, many of whom argue that such archaic rules are incompatible with modern academic life. Therefore, the administration must reconsider its stance because a strict approach may ultimately suppress student engagement.";

function scoreClass(score: number): string {
  if (score > 70) return "green";
  if (score > 40) return "amber";
  return "rose";
}

/* ═══════════════════════════════════════
   Style Analyzer Page
   ═══════════════════════════════════════ */
function StylePage() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const barRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (analysis && panelOpen) {
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
      barRefs.current.forEach((el) => { if (el) el.style.width = "0%"; });
      setPanelOpen(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <main className="main">
        <div className="main-inner">
          <div className="badge">
            <span dangerouslySetInnerHTML={{ __html: ICON.sparkle }} />
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
            <button className="analyze-btn" onClick={handleAnalyze} disabled={isAnalyzing || !text.trim()}>
              {isAnalyzing ? <div className="spinner" /> : (
                <>Analyze <span dangerouslySetInnerHTML={{ __html: ICON.arrow }} /></>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Panel */}
      <div className={`panel-overlay ${panelOpen ? "open" : ""}`}>
        <div className="panel-header">
          <div>
            <div className="panel-label">Style Report</div>
            <div className="panel-title">{analysis?.title || "Economist Profile"}</div>
          </div>
          <button className="close-btn" onClick={() => setPanelOpen(false)}>
            <span dangerouslySetInnerHTML={{ __html: ICON.close }} />
          </button>
        </div>
        {analysis && (
          <div className="panel-body">
            <div className="score-section">
              <div className="score-row">
                <div className={`score-number ${scoreClass(analysis.overallScore)}`}>{analysis.overallScore}</div>
                <div className="score-label">/ 100</div>
              </div>
              <p className="score-summary">{analysis.summary}</p>
            </div>
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
    </>
  );
}

/* ═══════════════════════════════════════
   Dictionary Pro Page
   ═══════════════════════════════════════ */
function DictPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleLookup = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:4173/api/dict/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: query, dryRun: false }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleLookup();
    }
  };

  return (
    <main className="main">
      <div className="main-inner">
        <div className="badge">
          <span dangerouslySetInnerHTML={{ __html: ICON.search }} />
          Dictionary Pro
        </div>
        <h1 className="headline">Look Up Any<br />Expression</h1>
        <p className="subtitle">
          Type any slang, idiom, or informal expression. SPARK will analyze its register,
          provide TOEFL-appropriate alternatives, and explain the academic upgrade path.
        </p>

        <div className="dict-input-row">
          <input
            className="dict-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Try "a big deal", "gonna", "lowkey"...'
          />
          <button className="analyze-btn dict-btn" onClick={handleLookup} disabled={isLoading || !query.trim()}>
            {isLoading ? <div className="spinner" /> : (
              <>Lookup <span dangerouslySetInnerHTML={{ __html: ICON.arrow }} /></>
            )}
          </button>
        </div>

        {result && (
          <div className="dict-result">
            {result.dryRun ? (
              <div className="dict-card">
                <div className="section-title">Dry Run Preview</div>
                <pre className="dict-pre">{JSON.stringify(result.query, null, 2)}</pre>
                <p className="dict-note">Set up an LLM provider to get real results. Run <code>npm run setup</code> in the project root.</p>
              </div>
            ) : result.markdown ? (
              <div className="dict-card">
                <div className="section-title">Analysis Result</div>
                <div className="dict-markdown">{result.markdown}</div>
              </div>
            ) : (
              <div className="dict-card">
                <div className="section-title">Response</div>
                <pre className="dict-pre">{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

/* ═══════════════════════════════════════
   App Shell
   ═══════════════════════════════════════ */
export default function App(): JSX.Element {
  const [page, setPage] = useState<"style" | "dict">("style");

  return (
    <div className="app">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="logo">S</div>
        <div className="sidebar-nav">
          <button
            className={`nav-btn ${page === "style" ? "active" : ""}`}
            onClick={() => setPage("style")}
            title="Economist Style Engine"
            dangerouslySetInnerHTML={{ __html: ICON.book }}
          />
          <button
            className={`nav-btn ${page === "dict" ? "active" : ""}`}
            onClick={() => setPage("dict")}
            title="Dictionary Pro"
            dangerouslySetInnerHTML={{ __html: ICON.search }}
          />
        </div>
        <div className="avatar" />
      </nav>

      {page === "style" ? <StylePage /> : <DictPage />}
    </div>
  );
}
