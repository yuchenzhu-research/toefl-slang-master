import { useState, useEffect } from 'react'
import { ICON } from '../components/icons'
import { useToast } from '../components/ToastContext'
import { checkHealth, lookupDictionary, DictLookupResponse } from '../api/client'
import { ActionButton, ResultSection, StatusMessage, StatusType } from '../components/Workspace'

export function DictPage() {
  // Explicit State Model (US-003)
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<DictLookupResponse | null>(null)

  // Backend Status (US-004)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'reachable' | 'unavailable'>(
    'checking'
  )
  const { showToast } = useToast()

  const checkBackendHealth = async () => {
    setBackendStatus('checking')
    const res = await checkHealth()
    if (res.ok && res.data?.ok) {
      setBackendStatus('reachable')
    } else {
      setBackendStatus('unavailable')
    }
  }

  // Check health on mount (US-004)
  useEffect(() => {
    checkBackendHealth()
  }, [])

  const handleLookup = async () => {
    // Empty input cannot trigger a lookup (US-003)
    if (!query.trim()) return

    setIsLoading(true)
    setError(null) // Clear stale errors (US-003)

    // Set up local credentials from localStorage
    const provider = localStorage.getItem('spark_provider') || undefined
    const apiKey = localStorage.getItem('spark_api_key') || undefined
    const model = localStorage.getItem('spark_model') || undefined
    const baseUrl = localStorage.getItem('spark_base_url') || undefined

    // Timeout logic (15s)
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Lookup timed out. Backend may be slow.')), 15000)
    )

    try {
      const lookupPromise = lookupDictionary({
        text: query,
        dryRun: false,
        provider,
        apiKey,
        model,
        baseUrl
      })

      const res = await Promise.race([lookupPromise, timeoutPromise])

      if (res.ok && res.data) {
        setResult(res.data)
      } else {
        const errorMsg = res.error || 'Failed to get analysis from backend.'
        setError(errorMsg)
        showToast(errorMsg, 'error')
        // Failed lookup preserves user's input (US-003)
      }
    } catch (e: any) {
      const errorMsg = e.message || 'Failed to connect to the backend API.'
      setError(errorMsg)
      showToast(errorMsg, 'error')
      // Failed lookup preserves user's input (US-003)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleLookup()
    }
  }

  // Convert backendStatus to StatusMessage type
  const getStatusType = (): StatusType => {
    if (backendStatus === 'reachable') return 'reachable'
    if (backendStatus === 'unavailable') return 'unavailable'
    return 'checking'
  }

  const getStatusMessageText = () => {
    if (backendStatus === 'reachable') return 'Local server connected'
    if (backendStatus === 'unavailable')
      return 'Local server disconnected. Check status or launch backend.'
    return 'Checking local server connectivity...'
  }

  return (
    <main className="main">
      <div className="main-inner">
        <div className="badge">
          <span dangerouslySetInnerHTML={{ __html: ICON.search }} />
          Dictionary Pro
        </div>

        {/* Backend Status Feedback Indicator (US-004) */}
        <div className="backend-status-container" style={{ margin: '1rem 0' }}>
          <StatusMessage
            type={getStatusType()}
            message={getStatusMessageText()}
            onClick={checkBackendHealth}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <h1 className="headline">
          Look Up Any
          <br />
          Expression
        </h1>
        <p className="subtitle">
          Type any slang, idiom, or informal expression. SPARK will analyze its register, provide
          TOEFL-appropriate alternatives, and explain the academic upgrade path.
        </p>

        {/* Dictionary lookup controls remain visible (US-004) */}
        <div className="dict-input-row">
          <input
            className="dict-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Try "a big deal", "gonna", "lowkey"...'
          />
          {/* ActionButton (US-002, US-005) */}
          <ActionButton
            isLoading={isLoading}
            disabled={!query.trim()}
            onClick={handleLookup}
            className="dict-btn"
          >
            <>
              Lookup <span dangerouslySetInnerHTML={{ __html: ICON.arrow }} />
            </>
          </ActionButton>
        </div>

        {error && (
          <div style={{ marginTop: '1rem' }}>
            <StatusMessage type="error" message={error} />
          </div>
        )}

        {/* ResultSection (US-002, US-005) */}
        {result && (
          <div className="dict-result">
            {result.dryRun ? (
              <ResultSection title="Dry Run Preview">
                <pre className="dict-pre">{JSON.stringify(result.query || result, null, 2)}</pre>
                <p className="dict-note">
                  Set up an LLM provider to get real results. Run <code>npm run setup</code> in the
                  project root.
                </p>
              </ResultSection>
            ) : result.markdown ? (
              <ResultSection title="Analysis Result">
                <div
                  className="dict-markdown"
                  dangerouslySetInnerHTML={{ __html: result.markdown.replace(/\n/g, '<br/>') }}
                />
              </ResultSection>
            ) : (
              <ResultSection title="Response">
                <pre className="dict-pre">{JSON.stringify(result, null, 2)}</pre>
              </ResultSection>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
