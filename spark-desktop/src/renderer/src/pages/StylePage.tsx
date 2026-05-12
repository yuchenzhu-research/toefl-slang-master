import { useState, useRef, useEffect } from "react";
import { ICON } from "../components/icons";
import { useToast } from "../components/ToastContext";

const DEFAULT_TEXT =
  "The university's draconian policies regarding dormitory curfews have sparked widespread backlash among the student body, many of whom argue that such archaic rules are incompatible with modern academic life. Therefore, the administration must reconsider its stance because a strict approach may ultimately suppress student engagement.";

function scoreClass(score: number): string {
  if (score > 70) return "green";
  if (score > 40) return "amber";
  return "rose";
}

export function StylePage() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const barRefs = useRef<HTMLDivElement[]>([]);
  const { showToast } = useToast();

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
    return undefined;
  }, [analysis, panelOpen]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    let isTimeout = false;

    // Set up a 10-second timeout
    const timeoutId = setTimeout(() => {
      isTimeout = true;
      setIsAnalyzing(false);
      showToast("Request timed out. Please check if the local server is running.", "error");
    }, 10000);

    try {
      const res = await fetch("http://127.0.0.1:4173/api/style/economist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      clearTimeout(timeoutId);

      if (isTimeout) return; // If already timed out, do nothing

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setAnalysis(data);
      barRefs.current.forEach((el) => { if (el) el.style.width = "0%"; });
      setPanelOpen(true);
      showToast("Analysis complete!", "info");
    } catch (e) {
      clearTimeout(timeoutId);
      if (!isTimeout) {
        console.error(e);
        showToast("Failed to connect to the backend API.", "error");
      }
    } finally {
      if (!isTimeout) setIsAnalyzing(false);
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
