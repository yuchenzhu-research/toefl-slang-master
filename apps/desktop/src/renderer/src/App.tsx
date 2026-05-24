import {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  ReactElement,
  UIEvent,
  WheelEvent as ReactWheelEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Sidebar, PageId } from './components/Sidebar'
import { CommandDock, WorkspaceMode } from './components/CommandDock'
import { WorkspaceLane } from './components/WorkspaceLane'
import { SessionTimeline } from './components/SessionTimeline'
import { ArtifactRail } from './components/ArtifactRail'
import { useWorkspace, WorkspaceEvent, WorkspaceArtifact } from './hooks/useWorkspace'
import { lookupDictionary, checkHealth } from './api/client'
import { ToastProvider } from './components/ToastContext'
import { ICON } from './components/icons'
import { StylePage } from './pages/StylePage'
import { DictPage } from './pages/DictPage'
import { CoachPage } from './pages/CoachPage'
import { ContentPage } from './pages/ContentPage'
import { SettingsPage } from './pages/SettingsPage'
import { EvaluationPage } from './pages/EvaluationPage'
import gallery01 from './assets/spark-gallery-01.png'
import gallery02 from './assets/spark-gallery-02.png'
import gallery03 from './assets/spark-gallery-03.png'
import gallery04 from './assets/spark-gallery-04.png'
import gallery05 from './assets/spark-gallery-05.png'
import gallery06 from './assets/spark-gallery-06.png'
import gallery07 from './assets/spark-gallery-07.png'
import gallery08 from './assets/spark-gallery-08.png'
import gallery09 from './assets/spark-gallery-09.png'
import gallery10 from './assets/spark-gallery-10.png'

const galleryItems: Array<{
  page: PageId
  category: string
  label: string
  title: string
  meta: string
  image: string
}> = [
  {
    page: 'dict',
    category: 'Register Conversion',
    label: 'Register Conversion',
    title: 'Dictionary Pro',
    meta: 'Slang to academic',
    image: gallery01
  },
  {
    page: 'style',
    category: 'Style Analysis',
    label: 'Editorial Rhythm',
    title: 'Economist Engine',
    meta: 'Argument texture',
    image: gallery02
  },
  {
    page: 'coach',
    category: 'Writing Diagnosis',
    label: 'ETS Diagnosis',
    title: 'TOEFL Coach',
    meta: 'Writing pressure test',
    image: gallery03
  },
  {
    page: 'content',
    category: 'Reading Parser',
    label: 'Material Parsing',
    title: 'Content Parser',
    meta: 'Reading to notes',
    image: gallery04
  },
  {
    page: 'settings',
    category: 'Provider Runtime',
    label: 'Provider Runtime',
    title: 'API Settings',
    meta: 'Local credentials',
    image: gallery05
  },
  {
    page: 'dict',
    category: 'Register Conversion',
    label: 'Expression Bank',
    title: 'Study Loop',
    meta: 'Cards and recall',
    image: gallery06
  },
  {
    page: 'style',
    category: 'Style Analysis',
    label: 'Close Reading',
    title: 'Source Texture',
    meta: 'Rhythm and contrast',
    image: gallery07
  },
  {
    page: 'content',
    category: 'Reading Parser',
    label: 'Archive Notes',
    title: 'Parser Desk',
    meta: 'Reading to snippets',
    image: gallery08
  },
  {
    page: 'coach',
    category: 'Writing Diagnosis',
    label: 'Draft Review',
    title: 'Writing Lab',
    meta: 'Score pressure',
    image: gallery09
  },
  {
    page: 'content',
    category: 'Reading Parser',
    label: 'Reference Shelf',
    title: 'Material Kit',
    meta: 'Reusable evidence',
    image: gallery10
  }
]

const categories = [
  'Register Conversion',
  'Style Analysis',
  'Writing Diagnosis',
  'Reading Parser',
  'Provider Runtime'
]

const MOCK_EVENTS: WorkspaceEvent[] = [
  {
    id: 'evt-demo-001',
    timestamp: '2026-05-24T00:00:05.000Z',
    type: 'command-submitted',
    message: 'Submitted command: /dict a big deal'
  },
  {
    id: 'evt-demo-002',
    timestamp: '2026-05-24T00:00:10.000Z',
    type: 'tool-running',
    message: "Looking up 'a big deal' in Dictionary Pro...",
    toolName: 'dictionary_lookup',
    toolStatus: 'running'
  },
  {
    id: 'evt-demo-003',
    timestamp: '2026-05-24T00:00:45.000Z',
    type: 'artifact-created',
    message: "Generated academic conversion card for 'a big deal'",
    artifactId: 'art-demo-001'
  },
  {
    id: 'evt-demo-004',
    timestamp: '2026-05-24T00:00:50.000Z',
    type: 'complete',
    message: 'Workspace task completed successfully',
    toolStatus: 'complete'
  }
]

const MOCK_ARTIFACT: WorkspaceArtifact = {
  id: 'art-demo-001',
  title: 'Expression Card: a big deal',
  type: 'markdown',
  content: `# a big deal\n\n> [!NOTE]\n> DEVELOPMENT DEMO DATA ONLY. This is a mockup of a Dictionary Pro expression card.\n\n**Translation**: 极其重要的事情，大手笔\n\n---\n\n### Academic Alternatives\n1. **a significant milestone / event** (Formal)\n2. **of major import** (Academic)\n3. **a substantial challenge** (ETS context)\n\n---\n\n### Contextual Usage\n* *Informal*: Landing this customer is **a big deal** for our startup.\n* *Academic*: Securing this funding represents **a significant milestone** for the research laboratory.\n`,
  metadata: {
    headword: 'a big deal',
    mode: 'conversion',
    target: 'toefl-writing'
  }
}

function shuffleGallery(): typeof galleryItems {
  return [...galleryItems]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((left, right) => left.sort - right.sort)
    .map(({ item }) => item)
}

function renderPage(page: PageId): ReactElement {
  if (page === 'style') return <StylePage />
  if (page === 'dict') return <DictPage />
  if (page === 'coach') return <CoachPage />
  if (page === 'content') return <ContentPage />
  if (page === 'eval') return <EvaluationPage />
  return <SettingsPage />
}

export default function App(): ReactElement {
  const { session, activeArtifact, setActiveArtifact, initSession, appendEvent, addArtifact } = useWorkspace()
  const [page, setPage] = useState<PageId | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [randomMode, setRandomMode] = useState(false)
  const [randomItems, setRandomItems] = useState(() => shuffleGallery())
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const [scrollProgress, setScrollProgress] = useState(0)
  const galleryRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({
    active: false,
    moved: false,
    startX: 0,
    scrollLeft: 0
  })
  const clickWasDrag = useRef(false)

  const refreshBackendStatus = async () => {
    setBackendStatus('checking')
    const res = await checkHealth()
    setBackendStatus(res.ok && res.data?.ok ? 'online' : 'offline')
  }

  useEffect(() => {
    refreshBackendStatus()
  }, [])

  async function handleCommandRun(mode: WorkspaceMode, text: string): Promise<void> {
    setIsLoading(true)
    
    if (!session) {
      initSession(`session-${Date.now()}`)
    }

    const commandText = `/${mode} ${text}`
    const timeSeed = Date.now()

    appendEvent({
      id: `evt-${timeSeed}-submitted`,
      timestamp: new Date().toISOString(),
      type: 'command-submitted',
      message: `Submitted command: ${commandText}`
    })

    if (mode === 'dict') {
      appendEvent({
        id: `evt-${timeSeed}-running`,
        timestamp: new Date().toISOString(),
        type: 'tool-running',
        message: `Looking up '${text}' in Dictionary Pro...`,
        toolName: 'dictionary_lookup',
        toolStatus: 'running'
      })

      try {
        const response = await lookupDictionary({
          text,
          dryRun: true,
          mode: 'conversion',
          target: 'toefl-writing'
        })

        if (response.ok && response.data) {
          const data = response.data
          const artId = `art-${Date.now()}`

          if (data.dryRun) {
            const mdContent = `# ${text} (Dry Run Mock)

> [!NOTE]
> This lookup was run in dry-run mode. No provider API calls were performed.

- **Query**: ${text}
- **Mode**: conversion
- **Target**: toefl-writing
`
            const mdArtifact: WorkspaceArtifact = {
              id: artId,
              title: `Expression Card: ${text} (Dry Run)`,
              type: 'markdown',
              content: mdContent,
              metadata: {
                text,
                mode: 'conversion',
                target: 'toefl-writing',
                dryRun: true
              }
            }

            addArtifact(mdArtifact)
            appendEvent({
              id: `evt-${timeSeed}-artifact`,
              timestamp: new Date().toISOString(),
              type: 'artifact-created',
              message: `Created artifact 'Expression Card: ${text} (Dry Run)'`,
              artifactId: artId
            })
          } else {
            const mdArtifact: WorkspaceArtifact = {
              id: artId,
              title: `Expression Card: ${text}`,
              type: 'markdown',
              content: data.markdown || 'No content returned',
              metadata: (data.structured as Record<string, any>) || {}
            }
            addArtifact(mdArtifact)
            appendEvent({
              id: `evt-${timeSeed}-artifact`,
              timestamp: new Date().toISOString(),
              type: 'artifact-created',
              message: `Created artifact 'Expression Card: ${text}'`,
              artifactId: artId
            })
          }

          appendEvent({
            id: `evt-${timeSeed}-complete`,
            timestamp: new Date().toISOString(),
            type: 'complete',
            message: `Workspace task completed successfully`,
            toolStatus: 'complete'
          })
        } else {
          const errMsg = response.error || 'Unknown lookup error'
          const errArtId = `art-${Date.now()}-error`
          addArtifact({
            id: errArtId,
            title: 'Dictionary Lookup Error',
            type: 'error',
            content: errMsg
          })
          appendEvent({
            id: `evt-${timeSeed}-error`,
            timestamp: new Date().toISOString(),
            type: 'error',
            message: `Error: ${errMsg}`,
            toolStatus: 'error',
            artifactId: errArtId
          })
        }
      } catch (err: any) {
        const errMsg = err.message || String(err)
        const errArtId = `art-${Date.now()}-error`
        addArtifact({
          id: errArtId,
          title: 'Dictionary Lookup Error',
          type: 'error',
          content: errMsg
        })
        appendEvent({
          id: `evt-${timeSeed}-error`,
          timestamp: new Date().toISOString(),
          type: 'error',
          message: `Error: ${errMsg}`,
          toolStatus: 'error',
          artifactId: errArtId
        })
      }
    } else {
      appendEvent({
        id: `evt-${timeSeed}-running`,
        timestamp: new Date().toISOString(),
        type: 'tool-running',
        message: `Processing '${mode}' analysis for '${text.substring(0, 20)}...'`,
        toolName: `${mode}_analysis`,
        toolStatus: 'running'
      })

      await new Promise((resolve) => setTimeout(resolve, 800))

      const artId = `art-${Date.now()}`
      const mdContent = `# ${mode.toUpperCase()} Analysis (Simulated Result)

- **Query/Text**: ${text}
- **Status**: Simulated Success
`
      addArtifact({
        id: artId,
        title: `${mode.toUpperCase()} Result: ${text.substring(0, 15)}...`,
        type: 'markdown',
        content: mdContent
      })

      appendEvent({
        id: `evt-${timeSeed}-artifact`,
        timestamp: new Date().toISOString(),
        type: 'artifact-created',
        message: `Created artifact for ${mode} command`,
        artifactId: artId
      })

      appendEvent({
        id: `evt-${timeSeed}-complete`,
        timestamp: new Date().toISOString(),
        type: 'complete',
        message: `Simulated complete`,
        toolStatus: 'complete'
      })
    }

    setIsLoading(false)
  }

  const visibleItems = useMemo(
    () => (randomMode ? randomItems : galleryItems),
    [randomItems, randomMode]
  )

  const stageStyle = {
    '--scroll-progress': scrollProgress.toFixed(4),
    '--scroll-rotate': `${(scrollProgress - 0.5) * 10}deg`,
    '--scroll-shift': `${(scrollProgress - 0.5) * 34}px`,
    '--scroll-depth': `${scrollProgress * 18}px`
  } as CSSProperties

  function scrollGallery(direction: -1 | 1): void {
    galleryRef.current?.scrollBy({
      left: direction * Math.min(window.innerWidth * 0.72, 720),
      behavior: 'smooth'
    })
  }

  function updateGalleryState(element: HTMLDivElement): void {
    const maxScroll = Math.max(element.scrollWidth - element.clientWidth, 1)
    const progress = element.scrollLeft / maxScroll
    const center = element.scrollLeft + element.clientWidth / 2
    const cards = Array.from(element.querySelectorAll<HTMLElement>('.gallery-card'))
    const closestCard = cards.reduce<HTMLElement | null>((closest, card) => {
      if (!closest) return card
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const closestCenter = closest.offsetLeft + closest.offsetWidth / 2
      return Math.abs(cardCenter - center) < Math.abs(closestCenter - center) ? card : closest
    }, null)

    setScrollProgress(progress)
    if (!randomMode && closestCard?.dataset.category) {
      setActiveCategory(closestCard.dataset.category)
    }
  }

  function handleGalleryScroll(event: UIEvent<HTMLDivElement>): void {
    updateGalleryState(event.currentTarget)
  }

  function handleStageWheel(event: ReactWheelEvent<HTMLElement>): void {
    const gallery = galleryRef.current
    if (!gallery) return
    const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX
    if (!delta) return
    event.preventDefault()
    gallery.scrollLeft += delta
    updateGalleryState(gallery)
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>): void {
    dragState.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>): void {
    if (!dragState.current.active) return
    const delta = event.clientX - dragState.current.startX
    if (Math.abs(delta) > 5) {
      dragState.current.moved = true
      clickWasDrag.current = true
    }
    event.currentTarget.scrollLeft = dragState.current.scrollLeft - delta
    updateGalleryState(event.currentTarget)
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>): void {
    if (!dragState.current.active) return
    dragState.current.active = false
    event.currentTarget.releasePointerCapture(event.pointerId)
    window.setTimeout(() => {
      clickWasDrag.current = false
    }, 0)
  }

  function toggleMode(): void {
    setRandomMode((current) => {
      const next = !current
      if (next) {
        setRandomItems(shuffleGallery())
        setActiveCategory('Random Study Flow')
      } else {
        setActiveCategory(categories[0])
      }
      galleryRef.current?.scrollTo({ left: 0, behavior: 'smooth' })
      return next
    })
  }

  return (
    <ToastProvider>
      <div className={`app ${page ? 'workspace-active' : ''}`}>
        <Sidebar currentPage={page} onNavigate={setPage} onHome={() => setPage(null)} />

        <main
          className={`landing-stage ${randomMode ? 'random-mode' : 'linear-mode'}`}
          style={stageStyle}
          onWheel={handleStageWheel}
        >
          <span className="corner-letter corner-letter-s" aria-hidden="true">
            S
          </span>
          <span className="corner-letter corner-letter-p" aria-hidden="true">
            P
          </span>
          <span className="corner-letter corner-letter-a" aria-hidden="true">
            A
          </span>
          <span className="corner-letter corner-letter-k" aria-hidden="true">
            K
          </span>

          <svg className="stage-decoration" viewBox="0 0 1664 774" fill="none" aria-hidden="true">
            <path d="M830 118V704" />
            <path d="M0 413H1664" />
            <path d="M830 413L308 21" />
            <path d="M260 571L1592 203" />
            <path d="M830 413L1090 267" />
          </svg>

          <div className="category-orbit" aria-live="polite">
            {categories.map((category) => (
              <span
                key={category}
                className={`category-label ${activeCategory === category ? 'active' : ''}`}
              >
                {category}
              </span>
            ))}
          </div>

          <div className="hero-core">
            <span className="radiating-lines" aria-hidden="true" />
            <p className="stage-kicker">{randomMode ? 'Random Study Flow' : activeCategory}</p>
            <h1 className="stage-intro">
              Turn informal English, reading material, and rough drafts into reusable academic
              expression.
            </h1>
            <button
              className="mode-toggle"
              type="button"
              onClick={toggleMode}
              aria-pressed={randomMode}
            >
              <span>Linear</span>
              <span className="toggle-track">
                <span className="toggle-dot" />
              </span>
              <span>Random</span>
            </button>
          </div>

          <section className="gallery-shell" aria-label="SPARK photo gallery">
            <button
              className="gallery-control gallery-control-prev"
              type="button"
              onClick={() => scrollGallery(-1)}
              aria-label="Scroll photos left"
            >
              <span dangerouslySetInnerHTML={{ __html: ICON.arrow }} />
            </button>

            <div
              className="gallery-strip"
              ref={galleryRef}
              onScroll={handleGalleryScroll}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              {/* Lane 1: Command Panel */}
              <WorkspaceLane title="Command" className="lane-command">
                <CommandDock
                  onRun={handleCommandRun}
                  isLoading={isLoading}
                  backendStatus={backendStatus}
                  onRefreshBackend={refreshBackendStatus}
                />
              </WorkspaceLane>

              {/* Lane 2: Session Timeline Panel */}
              <WorkspaceLane title="Session" className="lane-session">
                <SessionTimeline
                  events={session?.events || MOCK_EVENTS}
                  isLoading={isLoading}
                  onArtifactClick={(artifactId) => {
                    if (artifactId === 'art-demo-001') {
                      setActiveArtifact(MOCK_ARTIFACT)
                    } else if (session) {
                      const found = session.artifacts.find((art) => art.id === artifactId)
                      if (found) setActiveArtifact(found)
                    }
                  }}
                />
              </WorkspaceLane>

              {/* Lane 3: Output Rail Panel */}
              <WorkspaceLane title="Output" className="lane-output">
                <ArtifactRail activeArtifact={activeArtifact || (session ? null : MOCK_ARTIFACT)} />
              </WorkspaceLane>

              {visibleItems.map((item, index) => (
                <button
                  key={`${item.title}-${index}`}
                  type="button"
                  className="gallery-card"
                  data-category={item.category}
                  onClick={() => {
                    if (!clickWasDrag.current) setPage(item.page)
                  }}
                >
                  <img className="gallery-photo" src={item.image} alt="" aria-hidden="true" />
                  <span className="visual-layer" aria-hidden="true" />
                  <span className="gallery-meta">{item.label}</span>
                  <span className="gallery-title">{item.title}</span>
                  <span className="gallery-caption">{item.meta}</span>
                </button>
              ))}
            </div>

            <button
              className="gallery-control gallery-control-next"
              type="button"
              onClick={() => scrollGallery(1)}
              aria-label="Scroll photos right"
            >
              <span dangerouslySetInnerHTML={{ __html: ICON.arrow }} />
            </button>
          </section>
        </main>

        {page && (
          <section className="workspace-overlay" aria-label="SPARK workspace">
            <button className="workspace-close" type="button" onClick={() => setPage(null)}>
              <span dangerouslySetInnerHTML={{ __html: ICON.close }} />
            </button>
            {renderPage(page)}
          </section>
        )}
      </div>
    </ToastProvider>
  )
}
