import { useState } from 'react'
import { ICON } from '../components/icons'

interface EvaluatedResponse {
  id: string
  timestamp: string
  model: string
  prompt: string
  response: string
  score: number
  feedback: string
}

// Sample data for demonstration
const SAMPLE_RESPONSES: EvaluatedResponse[] = [
  {
    id: '1',
    timestamp: '2026-05-23 14:32',
    model: 'Claude 3.5',
    prompt: 'Explain the impact of urbanization on the environment',
    response:
      'Urbanization significantly impacts the environment through increased resource consumption, habitat destruction, and pollution. As cities expand, they contribute to climate change while displacing wildlife populations.',
    score: 85,
    feedback:
      'Strong topic sentence and clear cause-effect structure. Good use of specific vocabulary like "resource consumption" and "habitat destruction." Consider adding more concrete examples.'
  },
  {
    id: '2',
    timestamp: '2026-05-23 15:48',
    model: 'GPT-4',
    prompt: 'Discuss the benefits of renewable energy',
    response:
      'Renewable energy is good for the planet. It helps reduce carbon emissions and creates jobs. Solar and wind power are examples.',
    score: 62,
    feedback:
      'Basic understanding evident but lacks depth. Too simplistic for academic writing. Need more specific evidence and statistics to support claims.'
  },
  {
    id: '3',
    timestamp: '2026-05-24 09:15',
    model: 'Gemini Pro',
    prompt: 'Analyze the role of education in economic development',
    response:
      'Education serves as the cornerstone of economic development by cultivating human capital, fostering innovation, and enabling workforce adaptability. Countries with robust educational systems demonstrate higher GDP growth rates and greater technological advancement.',
    score: 92,
    feedback:
      'Excellent academic tone and precise terminology. Strong thesis statement with well-developed supporting arguments. Consider adding counterarguments for a more balanced analysis.'
  }
]

function scoreClass(score: number): string {
  if (score >= 80) return 'green'
  if (score >= 60) return 'amber'
  return 'rose'
}

export function EvaluationPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'high' | 'low'>('all')

  const selectedResponse = SAMPLE_RESPONSES.find((r) => r.id === selectedId)

  const filteredResponses = SAMPLE_RESPONSES.filter((r) => {
    if (activeTab === 'high') return r.score >= 80
    if (activeTab === 'low') return r.score < 60
    return true
  })

  return (
    <>
      <main className="main">
        <div className="main-inner">
          <div className="badge">
            <span dangerouslySetInnerHTML={{ __html: ICON.sparkle }} />
            Response Evaluation
          </div>
          <h1 className="headline">
            Review AI
            <br />
            Writing Responses
          </h1>
          <p className="subtitle">
            Browse and evaluate AI-generated responses to improve your academic writing skills.
            Select a response to see detailed feedback.
          </p>

          <div className="tabs">
            <button
              type="button"
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Responses
            </button>
            <button
              type="button"
              className={`tab ${activeTab === 'high' ? 'active' : ''}`}
              onClick={() => setActiveTab('high')}
            >
              High Score (80+)
            </button>
            <button
              type="button"
              className={`tab ${activeTab === 'low' ? 'active' : ''}`}
              onClick={() => setActiveTab('low')}
            >
              Needs Work (&lt;60)
            </button>
          </div>

          <div className="response-list">
            {filteredResponses.map((response) => (
              <button
                key={response.id}
                type="button"
                className={`response-card ${selectedId === response.id ? 'selected' : ''}`}
                onClick={() => setSelectedId(response.id)}
              >
                <div className="response-header">
                  <span className="response-timestamp">{response.timestamp}</span>
                  <span className="response-model">{response.model}</span>
                </div>
                <p className="response-prompt">{response.prompt}</p>
                <div className="response-footer">
                  <span className={`score-badge ${scoreClass(response.score)}`}>
                    {response.score}/100
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Evaluation Panel */}
      {selectedResponse && (
        <div className="panel-overlay open">
          <div className="panel-header">
            <div>
              <div className="panel-label">Evaluation Panel</div>
              <div className="panel-title">{selectedResponse.model} Response</div>
            </div>
            <button className="close-btn" type="button" onClick={() => setSelectedId(null)}>
              <span dangerouslySetInnerHTML={{ __html: ICON.close }} />
            </button>
          </div>
          <div className="panel-body">
            <div className="score-section">
              <div className="score-row">
                <div className={`score-number ${scoreClass(selectedResponse.score)}`}>
                  {selectedResponse.score}
                </div>
                <div className="score-label">/ 100</div>
              </div>
            </div>

            <div className="section-title">Prompt</div>
            <div className="detail-card">{selectedResponse.prompt}</div>

            <div className="section-title">Response</div>
            <div className="detail-card">{selectedResponse.response}</div>

            <div className="section-title">Feedback</div>
            <div className="feedback-card">
              <p>{selectedResponse.feedback}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}