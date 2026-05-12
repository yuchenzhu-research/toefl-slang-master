import { useState } from "react";
import { Sidebar, PageId } from "./components/Sidebar";
import { ToastProvider } from "./components/ToastContext";
import { StylePage } from "./pages/StylePage";
import { DictPage } from "./pages/DictPage";
import { CoachPage } from "./pages/CoachPage";
import { ContentPage } from "./pages/ContentPage";
import { SettingsPage } from "./pages/SettingsPage";

export default function App(): JSX.Element {
  const [page, setPage] = useState<PageId>("style");

  return (
    <ToastProvider>
      <div className="app">
        <Sidebar currentPage={page} onNavigate={setPage} />
        {page === "style" && <StylePage />}
        {page === "dict" && <DictPage />}
        {page === "coach" && <CoachPage />}
        {page === "content" && <ContentPage />}
        {page === "settings" && <SettingsPage />}
      </div>
    </ToastProvider>
  );
}
