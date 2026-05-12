import React from "react";
import { ICON } from "../components/icons";

export function ContentPage() {
  return (
    <main className="main">
      <div className="main-inner">
        <div className="badge">
          <span dangerouslySetInnerHTML={{ __html: ICON.fileText }} />
          Content Parser
        </div>
        <h1 className="headline">Deep Material<br />Analysis Coming Soon</h1>
        <p className="subtitle">
          This module will break down high-quality foreign publications (PDF/MD/TXT) 
          to extract reusable sentence templates and cultural contexts.
        </p>
        <div className="placeholder-card">
          <p>The GUI for Content Parser is currently under development. Please use the CLI for now:</p>
          <pre><code>spark content --file article.pdf</code></pre>
        </div>
      </div>
    </main>
  );
}
