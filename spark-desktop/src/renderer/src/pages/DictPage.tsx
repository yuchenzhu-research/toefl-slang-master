import React, { useState } from "react";
import { ICON } from "../components/icons";
import { useToast } from "../components/ToastContext";

export function DictPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { showToast } = useToast();

  const handleLookup = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    let isTimeout = false;

    // Set up a 15-second timeout for dictionary lookups since LLM calls can take time
    const timeoutId = setTimeout(() => {
      isTimeout = true;
      setIsLoading(false);
      showToast("Lookup timed out. The local server or LLM provider may be slow.", "error");
    }, 15000);

    try {
      const res = await fetch("http://127.0.0.1:4173/api/dict/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: query, dryRun: false }),
      });
      clearTimeout(timeoutId);

      if (isTimeout) return;

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setResult(data);
    } catch (e) {
      clearTimeout(timeoutId);
      if (!isTimeout) {
        console.error(e);
        showToast("Failed to connect to the backend API.", "error");
      }
    } finally {
      if (!isTimeout) setIsLoading(false);
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
                <div className="dict-markdown" dangerouslySetInnerHTML={{ __html: result.markdown.replace(/\n/g, '<br/>') }} />
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
