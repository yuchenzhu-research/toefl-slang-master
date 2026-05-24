import { useState, KeyboardEvent, useEffect } from 'react'

export type WorkspaceMode = 'dict' | 'style' | 'coach' | 'content'

interface CommandDockProps {
  onRun: (mode: WorkspaceMode, text: string) => void
  isLoading?: boolean
  disabled?: boolean
  initialText?: string
  backendStatus?: 'checking' | 'online' | 'offline'
}

export function CommandDock({
  onRun,
  isLoading = false,
  disabled = false,
  initialText = '',
  backendStatus = 'online'
}: CommandDockProps) {
  const [mode, setMode] = useState<WorkspaceMode>('dict')
  const [text, setText] = useState(initialText)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    setText(initialText)
  }, [initialText])

  const modeOptions: Array<{ value: WorkspaceMode; label: string; placeholder: string; prefix: string }> = [
    { value: 'dict', label: 'Dict', placeholder: 'Upgrade a word or phrase (e.g., piece of cake)', prefix: '/dict' },
    { value: 'style', label: 'Style', placeholder: 'Analyze text for Economist-style prose features', prefix: '/style' },
    { value: 'coach', label: 'Coach', placeholder: 'Diagnose writing and simulate ETS score feedback', prefix: '/coach' },
    { value: 'content', label: 'Content', placeholder: 'Parse reading material for vocabulary candidates', prefix: '/content' }
  ]

  const currentOption = modeOptions.find((opt) => opt.value === mode)!

  const handleRun = () => {
    const trimmed = text.trim()
    if (!trimmed) {
      setValidationError('Please enter a query or text.')
      return
    }
    setValidationError(null)
    onRun(mode, trimmed)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleRun()
    }
  }

  return (
    <div className="command-dock">
      {/* 1. Mode Selector (Segmented Control) */}
      <div className="segmented-control" role="radiogroup" aria-label="Workspace Mode">
        {modeOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`control-item ${mode === opt.value ? 'active' : ''}`}
            onClick={() => {
              setMode(opt.value)
              setValidationError(null)
            }}
            role="radio"
            aria-checked={mode === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 2. Input Container */}
      <div className="input-container">
        <div className="input-prefix-label">{currentOption.prefix}</div>
        <textarea
          className="dock-textarea"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            if (e.target.value.trim()) {
              setValidationError(null)
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={currentOption.placeholder}
          disabled={disabled || isLoading}
          rows={3}
        />
      </div>

      {/* 3. Footer row (Validation Error, Hint & Run Button) */}
      <div className="dock-footer">
        <div className="footer-left">
          {validationError ? (
            <span className="validation-error">{validationError}</span>
          ) : (
            <span className="compact-hint">Press Enter to run, Shift+Enter for new line</span>
          )}
        </div>
        <button
          type="button"
          className={`run-button ${isLoading ? 'loading' : ''}`}
          onClick={handleRun}
          disabled={disabled || isLoading || (backendStatus === 'offline' && mode !== 'dict')}
        >
          {isLoading ? (
            <span className="spinner-mini" />
          ) : (
            <>
              Run
              <span className="btn-key-hint">↵</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
