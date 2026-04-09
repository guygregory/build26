import { useState, useMemo } from 'react'
import Header from './components/Header'
import FilterPanel from './components/FilterPanel'
import SessionGrid from './components/SessionGrid'
import SessionModal from './components/SessionModal'
import { useSessionData } from './hooks/useSessionData'
import { filterSessions } from './utils/filterSessions'

const SESSIONS_URL = '/sessions_all.json'
const SPEAKERS_URL = '/speakers_all.json'

export default function App() {
  const { sessions, loading, error, speakerMap } = useSessionData(SESSIONS_URL, SPEAKERS_URL)
  const [selectedSession, setSelectedSession] = useState(null)
  const [view, setView] = useState('grid')
  const [filters, setFilters] = useState({
    search: '',
    sessionType: [],
    track: [],
    level: [],
    day: [],
    speaker: '',
    deliveryType: [],
  })
  const [sortBy, setSortBy] = useState('time')

  const filtered = useMemo(
    () => filterSessions(sessions, filters, sortBy),
    [sessions, filters, sortBy]
  )

  const updateFilter = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value }))

  const clearFilters = () =>
    setFilters({ search: '', sessionType: [], track: [], level: [], day: [], speaker: '', deliveryType: [] })

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Subtle radial glow behind content */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(0 212 255 / 0.04) 0%, transparent 70%)' }} />

      <Header sessionCount={filtered.length} totalCount={sessions.length} loading={loading} />

      <main className="relative max-w-[1600px] mx-auto px-5 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl text-sm animate-fade-up" style={{ background: 'rgba(251 113 133 / 0.08)', border: '1px solid rgba(251 113 133 / 0.2)', color: 'var(--accent-rose)' }}>
            <strong>Failed to load sessions:</strong> {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-7">
          <aside className="w-full lg:w-72 xl:w-[296px] shrink-0 animate-slide-in">
            <FilterPanel
              sessions={sessions}
              filters={filters}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
              loading={loading}
            />
          </aside>

          <div className="flex-1 min-w-0 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{filtered.length}</span>
                <span style={{ color: 'var(--text-muted)' }}> / {sessions.length}</span>
                {' '}sessions
              </p>
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="text-sm rounded-lg px-3 py-1.5 focus:outline-none transition-colors cursor-pointer"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="time">Sort: Date &amp; Time</option>
                  <option value="title">Sort: Title</option>
                  <option value="track">Sort: Track</option>
                </select>
                <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-medium)' }}>
                  <button
                    onClick={() => setView('grid')}
                    className="px-3 py-1.5 text-sm transition-all duration-200"
                    style={{
                      background: view === 'grid' ? 'var(--accent-cyan-dim)' : 'var(--bg-elevated)',
                      color: view === 'grid' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    }}
                    title="Grid view"
                  >
                    <GridIcon />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className="px-3 py-1.5 text-sm transition-all duration-200"
                    style={{
                      background: view === 'list' ? 'var(--accent-cyan-dim)' : 'var(--bg-elevated)',
                      color: view === 'list' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      borderLeft: '1px solid var(--border-subtle)',
                    }}
                    title="List view"
                  >
                    <ListIcon />
                  </button>
                </div>
              </div>
            </div>

            <SessionGrid
              sessions={filtered}
              loading={loading}
              view={view}
              onSelect={setSelectedSession}
            />
          </div>
        </div>
      </main>

      {selectedSession && (
        <SessionModal session={selectedSession} speakerMap={speakerMap} onClose={() => setSelectedSession(null)} />
      )}
    </div>
  )
}

function GridIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
      <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3A1.5 1.5 0 0 1 15 10.5v3A1.5 1.5 0 0 1 13.5 15h-3A1.5 1.5 0 0 1 9 13.5v-3z" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
    </svg>
  )
}
