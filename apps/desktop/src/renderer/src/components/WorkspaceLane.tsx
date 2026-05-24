import { ReactNode } from 'react'

interface WorkspaceLaneProps {
  title: string
  metadata?: string
  className?: string
  children: ReactNode
}

export function WorkspaceLane({
  title,
  metadata,
  className = '',
  children
}: WorkspaceLaneProps) {
  return (
    <div className={`workspace-lane ${className}`}>
      <div className="lane-header">
        <span className="lane-title">{title}</span>
        {metadata && <span className="lane-metadata">{metadata}</span>}
      </div>
      <div className="lane-body">{children}</div>
    </div>
  )
}
