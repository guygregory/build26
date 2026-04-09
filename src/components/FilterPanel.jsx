import { useMemo } from 'react'
import { uniqueValues, getSessionDate } from '../utils/sessionHelpers'
import { getSessionType, getTrackList } from '../utils/filterSessions'

const LEVEL_OPTIONS = [
  { value: '100', label: 'L100 – Introductory' },
  { value: '200', label: 'L200 – Intermediate' },
  { value: '300', label: 'L300 – Advanced' },
  { value: '400', label: 'L400 – Expert' },
]

export default function FilterPanel({ sessions, filters, updateFilter, clearFilters, loading }) {
  const sessionTypes = useMemo(() => uniqueValues(sessions, getSessionType), [sessions])
  const tracks = useMemo(() => uniqueValues(sessions, s => getTrackList(s)), [sessions])
  const levels = useMemo(
    () => uniqueValues(sessions, s => String(s.level || s.sessionLevel || s.levelId || '')).filter(v => /^\d+$/.test(v)),
    [sessions]
  )
  const days = useMemo(() => {
    const dates = uniqueValues(sessions, getSessionDate)
    return dates.map(d => {
      const dt = new Date(d + 'T00:00:00Z')
      return {
        value: d,
        label: dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' }),
      }
    })
  }, [sessions])

  const hasActive =
    filters.search ||
    filters.sessionType.length > 0 ||
    filters.track.length > 0 ||
    filters.level.length > 0 ||
    filters.day.length > 0 ||
    filters.speaker ||
    filters.onDemand

  function toggleArrayFilter(key, value) {
    const current = filters[key]
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    updateFilter(key, next)
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Filters</h2>
        {hasActive && (
          <button
            onClick={clearFilters}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Search</label>
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={filters.search}
            onChange={e => updateFilter('search', e.target.value)}
            placeholder="Title, description, speaker…"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* On demand toggle */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-400">On-demand only</label>
        <button
          role="switch"
          aria-checked={filters.onDemand}
          onClick={() => updateFilter('onDemand', !filters.onDemand)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${filters.onDemand ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${filters.onDemand ? 'translate-x-5' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* Day */}
      {days.length > 0 && (
        <FilterSection title="Day" loading={loading}>
          {days.map(({ value, label }) => (
            <CheckboxItem
              key={value}
              label={label}
              checked={filters.day.includes(value)}
              onChange={() => toggleArrayFilter('day', value)}
            />
          ))}
        </FilterSection>
      )}

      {/* Session Type */}
      {sessionTypes.length > 0 && (
        <FilterSection title="Session Type" loading={loading}>
          {sessionTypes.map(t => (
            <CheckboxItem
              key={t}
              label={t}
              checked={filters.sessionType.includes(t)}
              onChange={() => toggleArrayFilter('sessionType', t)}
            />
          ))}
        </FilterSection>
      )}

      {/* Track */}
      {tracks.length > 0 && (
        <FilterSection title="Track" loading={loading} scrollable>
          {tracks.map(t => (
            <CheckboxItem
              key={t}
              label={t}
              checked={filters.track.includes(t)}
              onChange={() => toggleArrayFilter('track', t)}
            />
          ))}
        </FilterSection>
      )}

      {/* Level */}
      {levels.length > 0 && (
        <FilterSection title="Level" loading={loading}>
          {LEVEL_OPTIONS.filter(o => levels.includes(o.value)).map(o => (
            <CheckboxItem
              key={o.value}
              label={o.label}
              checked={filters.level.includes(o.value)}
              onChange={() => toggleArrayFilter('level', o.value)}
            />
          ))}
        </FilterSection>
      )}

      {/* Speaker */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Speaker</label>
        <input
          type="text"
          value={filters.speaker}
          onChange={e => updateFilter('speaker', e.target.value)}
          placeholder="Filter by speaker name…"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}

function FilterSection({ title, children, loading, scrollable }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">{title}</p>
      {loading ? (
        <div className="space-y-1.5">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-4 bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className={`space-y-1 ${scrollable ? 'max-h-48 overflow-y-auto pr-1 scrollbar-thin' : ''}`}>
          {children}
        </div>
      )}
    </div>
  )
}

function CheckboxItem({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-3.5 h-3.5 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 focus:ring-1"
      />
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors leading-tight">{label}</span>
    </label>
  )
}
