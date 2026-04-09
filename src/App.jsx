import { useState, useMemo } from 'react'
import Header from './components/Header'
import FilterPanel from './components/FilterPanel'
import SessionGrid from './components/SessionGrid'
import SessionModal from './components/SessionModal'
import { useSessionData } from './hooks/useSessionData'
import { filterSessions } from './utils/filterSessions'

const API_URL = 'https://api-v2.build.microsoft.com/api/session/all'

export default function App() {
  const { sessions, loading, error } = useSessionData(API_URL)
  const [selectedSession, setSelectedSession] = useState(null)
  const [view, setView] = useState('grid')
  const [filters, setFilters] = useState({
    search: '',
    sessionType: [],
    track: [],
    level: [],
    day: [],
    speaker: '',
    onDemand: false,
  })
  const [sortBy, setSortBy] = useState('time')

  const filtered = useMemo(
    () => filterSessions(sessions, filters, sortBy),
    [sessions, filters, sortBy]
  )

  const updateFilter = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value }))

  const clearFilters = () =>
    setFilters({ search: '', sessionType: [], track: [], level: [], day: [], speaker: '', onDemand: false })

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header sessionCount={filtered.length} totalCount={sessions.length} loading={loading} />

      <main className="max-w-screen-2xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-900/40 border border-red-700 rounded-xl text-red-300 text-sm">
            <strong>Failed to load sessions:</strong> {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-72 xl:w-80 shrink-0">
            <FilterPanel
              sessions={sessions}
              filters={filters}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
              loading={loading}
            />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
              <p className="text-gray-400 text-sm">
                Showing <span className="text-white font-semibold">{filtered.length}</span> of{' '}
                <span className="text-white font-semibold">{sessions.length}</span> sessions
              </p>
              <div className="flex items-center gap-3">
                <label className="text-gray-400 text-sm">Sort:</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="time">Date &amp; Time</option>
                  <option value="title">Title</option>
                  <option value="track">Track</option>
                </select>
                <div className="flex border border-gray-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setView('grid')}
                    className={`px-3 py-1.5 text-sm ${view === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    title="Grid view"
                  >
                    <GridIcon />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`px-3 py-1.5 text-sm ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
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
        <SessionModal session={selectedSession} onClose={() => setSelectedSession(null)} />
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
