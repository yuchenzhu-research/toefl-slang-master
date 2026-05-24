export type PageId = 'style' | 'dict' | 'coach' | 'content' | 'settings' | 'eval'

interface SidebarProps {
  currentPage: PageId | null
  onNavigate: (page: PageId) => void
  onHome: () => void
}

const navItems: Array<{ id: PageId; label: string }> = [
  { id: 'dict', label: 'Dict' },
  { id: 'style', label: 'Style' },
  { id: 'coach', label: 'Coach' },
  { id: 'content', label: 'Content' },
  { id: 'settings', label: 'Settings' },
  { id: 'eval', label: 'Eval' }
]

export function Sidebar({ currentPage, onNavigate, onHome }: SidebarProps) {
  return (
    <nav className="site-nav" aria-label="SPARK workspace navigation">
      <button
        className={`nav-link nav-home ${!currentPage ? 'active' : ''}`}
        type="button"
        onClick={onHome}
        aria-current={!currentPage ? 'page' : undefined}
      >
        Workspace
      </button>

      <button className="brand-mark" type="button" onClick={onHome} aria-label="SPARK home">
        <span>S</span>
        <span>P</span>
        <span>A</span>
        <span>R</span>
        <span>K</span>
      </button>

      <div className="nav-links" aria-label="Module navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
            type="button"
            onClick={() => onNavigate(item.id)}
            aria-current={currentPage === item.id ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
