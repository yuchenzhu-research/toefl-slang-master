import React from 'react';
import { ICON } from './icons';

export type PageId = "style" | "dict" | "coach" | "content";

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <nav className="sidebar">
      <div className="logo">S</div>
      <div className="sidebar-nav">
        <button
          className={`nav-btn ${currentPage === "style" ? "active" : ""}`}
          onClick={() => onNavigate("style")}
          title="Economist Style Engine"
          dangerouslySetInnerHTML={{ __html: ICON.book }}
        />
        <button
          className={`nav-btn ${currentPage === "dict" ? "active" : ""}`}
          onClick={() => onNavigate("dict")}
          title="Dictionary Pro"
          dangerouslySetInnerHTML={{ __html: ICON.search }}
        />
        <button
          className={`nav-btn ${currentPage === "coach" ? "active" : ""}`}
          onClick={() => onNavigate("coach")}
          title="TOEFL Coach (Coming Soon)"
          dangerouslySetInnerHTML={{ __html: ICON.penTool }}
        />
        <button
          className={`nav-btn ${currentPage === "content" ? "active" : ""}`}
          onClick={() => onNavigate("content")}
          title="Content Parser (Coming Soon)"
          dangerouslySetInnerHTML={{ __html: ICON.fileText }}
        />
      </div>
      <div className="avatar" />
    </nav>
  );
}
