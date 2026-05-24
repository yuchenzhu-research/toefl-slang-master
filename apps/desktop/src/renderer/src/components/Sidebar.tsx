export type PageId = 'style' | 'dict' | 'coach' | 'content' | 'settings' | 'eval'

interface SidebarProps {
  currentPage: PageId | null
  onNavigate: (page: PageId) => void
  onHome: () => void
}

const navItems: Array<{ id: PageId; label: string }> = [
  { id: 'style', label: 'Style' },
  { id: 'dict', label: 'Dict' },
  { id: 'coach', label: 'Coach' },
  { id: 'content', label: 'Content' },
  { id: 'eval', label: 'Eval' },
  { id: 'settings', label: 'Settings' }
]

export function Sidebar({ currentPage, onNavigate, onHome }: SidebarProps) {
  return (
    <nav className="site-nav" aria-label="SPARK modules">
      <button className="nav-link nav-home" type="button" onClick={onHome}>
        Study Flow
      </button>

      <button className="brand-mark" type="button" onClick={onHome} aria-label="SPARK home">
        <span>S</span>
        <span>P</span>
        <span>A</span>
        <span>R</span>
        <span>K</span>
      </button>

      <div className="nav-links" aria-label="Primary">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
            type="button"
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
