import { WorkspaceToolStatus } from '../hooks/useWorkspace'

interface ToolStatusChipProps {
  status: WorkspaceToolStatus
  label?: string
}

export function ToolStatusChip({ status, label }: ToolStatusChipProps) {
  const displayLabel = label || status.toUpperCase()

  const getStatusClass = (status: WorkspaceToolStatus) => {
    switch (status) {
      case 'idle':
        return 'status-idle'
      case 'checking':
        return 'status-checking'
      case 'running':
        return 'status-running'
      case 'complete':
        return 'status-complete'
      case 'error':
        return 'status-error'
      default:
        return ''
    }
  }

  return (
    <span className={`tool-status-chip ${getStatusClass(status)}`} data-status={status} aria-label={`Status: ${displayLabel}`}>
      {status === 'running' && (
        <span className="spinner-mini-inline" style={{ marginRight: '6px', borderTopColor: 'currentColor' }} />
      )}
      {displayLabel}
    </span>
  )
}
