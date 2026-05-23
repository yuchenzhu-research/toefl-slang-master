import React from 'react'
import { ICON } from './icons'

// 1. StatusMessage
export type StatusType = 'checking' | 'reachable' | 'unavailable' | 'error' | 'info'

interface StatusMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  type: StatusType
  message: string
}

export function StatusMessage({ type, message, className = '', ...props }: StatusMessageProps) {
  const getIcon = () => {
    switch (type) {
      case 'reachable':
        return ICON.arrow // Or some check icon, we fall back to arrow or dot
      case 'unavailable':
      case 'error':
        return ICON.close
      case 'checking':
      default:
        return '<span class="spinner-mini"></span>'
    }
  }

  return (
    <div
      className={`workspace-status-message status-${type} ${className}`}
      role="status"
      {...props}
    >
      <span className="status-icon" dangerouslySetInnerHTML={{ __html: getIcon() }} />
      <span className="status-text">{message}</span>
    </div>
  )
}

// 2. ActionButton
interface ActionButtonProps {
  isLoading: boolean
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export function ActionButton({
  isLoading,
  disabled = false,
  onClick,
  children,
  className = '',
  type = 'button'
}: ActionButtonProps) {
  return (
    <button
      type={type}
      className={`analyze-btn ${className} ${isLoading ? 'loading' : ''}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? <span className="spinner" aria-hidden="true" /> : children}
    </button>
  )
}

// 3. ResultSection
interface ResultSectionProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function ResultSection({ title, children, className = '' }: ResultSectionProps) {
  return (
    <div className={`workspace-result-section ${className}`}>
      {title && <div className="section-title">{title}</div>}
      <div className="result-body">{children}</div>
    </div>
  )
}
