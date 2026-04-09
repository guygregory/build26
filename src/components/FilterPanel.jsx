import { useMemo } from 'react'
import { uniqueValues, getSessionDate } from '../utils/sessionHelpers'
import { getSessionType, getTrackList, getSessionLevelCode, getDeliveryTypes } from '../utils/filterSessions'

const LEVEL_OPTIONS = [
  { value: '100', label: 'Foundational', color: 'var(--accent-emerald)' },
  { value: '200', label: 'Intermediate', color: 'var(--accent-cyan)' },
  { value: '300', label: 'Advanced', color: 'var(--accent-amber)' },
  { value: '400', label: 'Expert', color: 'var(--accent-rose)' },
]

export default function FilterPanel({ sessions, filters, updateFilter, clearFilters, loading }) {
  const sessionTypes = useMemo(() => uniqueValues(sessions, getSessionType), [sessions])
  const tracks = useMemo(() => uniqueValues(sessions, s => getTrackList(s)), [sessions])
  const levels = useMemo(
    () => uniqueValues(sessions, s => getSessionLevelCode(s)).filter(v => /^\d+$/.test(v)),
    [sessions]
  )
  const deliveryTypes = useMemo(() => uniqueValues(sessions, s => getDeliveryTypes(s)), [sessions])
  const days = useMemo(() => {
    const dates = uniqueValues(sessions, getSessionDate)
    return dates.map(d => {
      const dt = new Date(d + 'T00:00:00Z')
      return {
        value: d,
        label: dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }),
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
    filters.deliveryType.length > 0

  function toggleArrayFilter(key, value) {
    const current = filters[key]
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    updateFilter(key, next)
  }

  return (
    <div className="rounded-xl p-5 space-y-6 lg:sticky lg:top-[73px]" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Filters</h2>
        {hasActive && (
          <button
            onClick={clearFilters}
            className="text-[11px] font-medium transition-colors hover:opacity-80"
            style={{ color: 'var(--accent-cyan)' }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={filters.search}
            onChange={e => updateFilter('search', e.target.value)}
            placeholder="Search sessions…"
            className="w-full rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      </div>

      {/* Delivery Type */}
      {deliveryTypes.length > 0 && (
        <FilterSection title="Delivery Type" loading={loading}>
          {deliveryTypes.map(t => (
            <CheckboxItem
              key={t}
              label={t}
              checked={filters.deliveryType.includes(t)}
              onChange={() => toggleArrayFilter('deliveryType', t)}
            />
          ))}
        </FilterSection>
      )}

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
        <FilterSection title="Topic" loading={loading} scrollable>
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
              accent={o.color}
            />
          ))}
        </FilterSection>
      )}

      {/* Speaker */}
      <div>
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--text-muted)' }}>Speaker</p>
        <input
          type="text"
          value={filters.speaker}
          onChange={e => updateFilter('speaker', e.target.value)}
          placeholder="Filter by name…"
          className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-all"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
          }}
        />
      </div>
    </div>
  )
}

function FilterSection({ title, children, loading, scrollable }) {
  return (
    <div>
      <p className="font-display text-[11px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--text-muted)' }}>{title}</p>
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-4 rounded skeleton-shimmer" />
          ))}
        </div>
      ) : (
        <div className={`space-y-0.5 ${scrollable ? 'max-h-48 overflow-y-auto pr-1' : ''}`}>
          {children}
        </div>
      )}
    </div>
  )
}

function CheckboxItem({ label, checked, onChange, accent }) {
  return (
    <label onClick={onChange} className="flex items-center gap-2.5 py-1 px-2 -mx-2 rounded-md cursor-pointer transition-colors duration-150 hover:bg-white/[0.03] group">
      <span
        className="w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 transition-all duration-150"
        style={{
          border: checked ? 'none' : '1.5px solid var(--text-muted)',
          background: checked ? (accent || 'var(--accent-cyan)') : 'transparent',
        }}
      >
        {checked && (
          <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="var(--bg-base)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="text-[13px] leading-tight transition-colors duration-150" style={{ color: checked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{label}</span>
    </label>
  )
}
