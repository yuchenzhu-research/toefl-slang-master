import { ReactElement, useState } from "react";
import { Sidebar, PageId } from "./components/Sidebar";
import { ToastProvider } from "./components/ToastContext";
import { ICON } from "./components/icons";
import { StylePage } from "./pages/StylePage";
import { DictPage } from "./pages/DictPage";
import { CoachPage } from "./pages/CoachPage";
import { ContentPage } from "./pages/ContentPage";
import { SettingsPage } from "./pages/SettingsPage";

const modules: Array<{
  id: PageId;
  label: string;
  title: string;
  meta: string;
  className: string;
}> = [
  {
    id: "dict",
    label: "Register Conversion",
    title: "Dictionary Pro",
    meta: "Slang to academic",
    className: "card-dict"
  },
  {
    id: "style",
    label: "Editorial Rhythm",
    title: "Economist Engine",
    meta: "Argument texture",
    className: "card-style"
  },
  {
    id: "coach",
    label: "ETS Diagnosis",
    title: "TOEFL Coach",
    meta: "Writing pressure test",
    className: "card-coach"
  },
  {
    id: "content",
    label: "Material Parsing",
    title: "Content Parser",
    meta: "Reading to notes",
    className: "card-content"
  },
  {
    id: "settings",
    label: "Provider Runtime",
    title: "API Settings",
    meta: "Local credentials",
    className: "card-settings"
  }
];

function renderPage(page: PageId): ReactElement {
  if (page === "style") return <StylePage />;
  if (page === "dict") return <DictPage />;
  if (page === "coach") return <CoachPage />;
  if (page === "content") return <ContentPage />;
  return <SettingsPage />;
}

export default function App(): ReactElement {
  const [page, setPage] = useState<PageId | null>(null);
  const [randomMode, setRandomMode] = useState(false);

  return (
    <ToastProvider>
      <div className={`app ${page ? "workspace-active" : ""}`}>
        <Sidebar currentPage={page} onNavigate={setPage} onHome={() => setPage(null)} />

        <main className={`landing-stage ${randomMode ? "random-mode" : "linear-mode"}`}>
          <svg className="stage-decoration" viewBox="0 0 1664 774" fill="none" aria-hidden="true">
            <path d="M830 118V704" />
            <path d="M0 413H1664" />
            <path d="M830 413L308 21" />
            <path d="M260 571L1592 203" />
            <path d="M830 413L1090 267" />
          </svg>

          <div className="stage-labels" aria-hidden="true">
            <span className="stage-label label-one">Style Analysis</span>
            <span className="stage-label label-two">Dictionary Pro</span>
            <span className="stage-label label-three">TOEFL Coach</span>
            <span className="stage-label label-four">Content Parser</span>
            <span className="stage-label label-five">Provider Routing</span>
            <span className="stage-label label-six">Markdown + JSON</span>
          </div>

          <section className="gallery-strip" aria-label="SPARK module gallery">
            {modules.map((module) => (
              <button
                key={module.id}
                type="button"
                className={`gallery-card ${module.className}`}
                onClick={() => setPage(module.id)}
              >
                <span className="visual-layer" aria-hidden="true" />
                <span className="gallery-meta">{module.label}</span>
                <span className="gallery-title">{module.title}</span>
                <span className="gallery-caption">{module.meta}</span>
              </button>
            ))}
          </section>

          <p className="stage-intro">
            SPARK is a TOEFL-first language studio for turning informal English,
            reading material, and rough drafts into reusable academic expression.
          </p>

          <button
            className="mode-toggle"
            type="button"
            onClick={() => setRandomMode((current) => !current)}
            aria-pressed={randomMode}
          >
            <span>Linear</span>
            <span className="toggle-track">
              <span className="toggle-dot" />
            </span>
            <span>Random</span>
          </button>
        </main>

        {page && (
          <section className="workspace-overlay" aria-label="SPARK workspace">
            <button className="workspace-close" type="button" onClick={() => setPage(null)}>
              <span dangerouslySetInnerHTML={{ __html: ICON.close }} />
            </button>
            {renderPage(page)}
          </section>
        )}
      </div>
    </ToastProvider>
  );
}
