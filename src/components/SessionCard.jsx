import { formatDateTime, formatDuration } from '../utils/sessionHelpers'
import { getSpeakers, getSessionType, getTrackList, getSessionLevelCode } from '../utils/filterSessions'

const TYPE_STYLES = {
  Keynote:           { stripe: 'var(--accent-amber)',  bg: 'rgba(255 171 0 / 0.06)',   text: 'var(--accent-amber)',  border: 'rgba(255 171 0 / 0.15)' },
  Workshop:          { stripe: 'var(--accent-emerald)', bg: 'rgba(52 211 153 / 0.06)',  text: 'var(--accent-emerald)', border: 'rgba(52 211 153 / 0.15)' },
  Breakout:          { stripe: 'var(--accent-cyan)',   bg: 'rgba(0 212 255 / 0.06)',    text: 'var(--accent-cyan)',   border: 'rgba(0 212 255 / 0.15)' },
  'Theater Session': { stripe: 'var(--accent-violet)', bg: 'rgba(167 139 250 / 0.06)', text: 'var(--accent-violet)', border: 'rgba(167 139 250 / 0.15)' },
  'Ask the Experts': { stripe: 'var(--accent-amber)',  bg: 'rgba(255 171 0 / 0.06)',   text: 'var(--accent-amber)',  border: 'rgba(255 171 0 / 0.15)' },
  Demo:              { stripe: 'var(--accent-rose)',   bg: 'rgba(251 113 133 / 0.06)', text: 'var(--accent-rose)',   border: 'rgba(251 113 133 / 0.15)' },
}
const DEFAULT_STYLE = { stripe: 'var(--text-muted)', bg: 'rgba(255 255 255 / 0.02)', text: 'var(--text-secondary)', border: 'var(--border-subtle)' }

const LEVEL_COLORS = {
  '100': 'var(--accent-emerald)',
  '200': 'var(--accent-cyan)',
  '300': 'var(--accent-amber)',
  '400': 'var(--accent-rose)',
}

function TypeBadge({ type }) {
  if (!type) return null
  const s = TYPE_STYLES[type] || DEFAULT_STYLE
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium font-display tracking-wide" style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
      {type}
    </span>
  )
}

function LevelBadge({ level }) {
  if (!level) return null
  const color = LEVEL_COLORS[level] || 'var(--text-muted)'
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium" style={{ color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      L{level}
    </span>
  )
}

export default function SessionCard({ session, view, onSelect, index = 0 }) {
  const title = session.title || session.sessionTitle || 'Untitled Session'
  const description = session.description || session.sessionDescription || ''
  const speakers = getSpeakers(session)
  const type = getSessionType(session)
  const tracks = getTrackList(session)
  const level = getSessionLevelCode(session)
  const startRaw = session.startDateTime || session.startDate || session.scheduledDateTime
  const duration = session.durationInMinutes || session.duration
  const tags = session.tags || session.sessionTags || []
  const sessionCode = session.sessionCode || session.code
  const style = TYPE_STYLES[type] || DEFAULT_STYLE

  if (view === 'list') {
    return (
      <button
        onClick={() => onSelect(session)}
        className="w-full text-left rounded-lg pl-4 pr-4 py-3.5 transition-all duration-200 group stripe-left"
        style={{
          '--stripe-color': style.stripe,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = style.stripe + '40'; e.currentTarget.style.background = 'var(--bg-elevated)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg-card)' }}
      >
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0 ml-2">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <TypeBadge type={type} />
              <LevelBadge level={level} />
              {sessionCode && (
                <span className="font-mono text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{sessionCode}</span>
              )}
            </div>
            <h3 className="font-display font-semibold text-sm leading-snug line-clamp-2 transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>
              {sessionCode ? (
                <a
                  href={`https://build.microsoft.com/sessions/${sessionCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="no-underline hover:underline"
                  style={{ color: 'inherit' }}
                >
                  {title}
                </a>
              ) : title}
            </h3>
            {speakers.length > 0 && (
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {speakers.map(s => s.name || s.speakerName || s.fullName).filter(Boolean).join(', ')}
              </p>
            )}
          </div>
          <div className="shrink-0 text-right space-y-1 pt-0.5">
            {startRaw && (
              <p className="text-xs whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                {formatDateTime(startRaw)}
              </p>
            )}
            {duration && (
              <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{formatDuration(duration)}</p>
            )}
            {tracks.length > 0 && (
              <p className="text-[11px] truncate max-w-32" style={{ color: style.text }}>{tracks[0]}</p>
            )}
          </div>
        </div>
      </button>
    )
  }

  // Grid view
  return (
    <button
      onClick={() => onSelect(session)}
      className="w-full text-left rounded-xl p-5 transition-all duration-200 group flex flex-col gap-3 stripe-left"
      style={{
        '--stripe-color': style.stripe,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        animationDelay: `${Math.min(index * 30, 400)}ms`,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = style.stripe + '40'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px -8px ${style.stripe}15` }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap ml-2">
        <TypeBadge type={type} />
        <LevelBadge level={level} />
        {sessionCode && (
          <span className="font-mono text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{sessionCode}</span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-display font-semibold leading-snug line-clamp-3 text-[15px] flex-1 ml-2 transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>
        {sessionCode ? (
          <a
            href={`https://build.microsoft.com/sessions/${sessionCode}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="no-underline hover:underline"
            style={{ color: 'inherit' }}
          >
            {title}
          </a>
        ) : title}
      </h3>

      {/* Description snippet */}
      {description && (
        <p className="text-xs line-clamp-2 leading-relaxed ml-2" style={{ color: 'var(--text-muted)' }}>
          {description}
        </p>
      )}

      {/* Meta */}
      <div className="flex flex-col gap-1.5 mt-auto pt-3 ml-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        {startRaw && (
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <ClockIcon />
            <span>{formatDateTime(startRaw)}</span>
            {duration && <span style={{ color: 'var(--text-muted)' }}>· {formatDuration(duration)}</span>}
          </div>
        )}
        {tracks.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs" style={{ color: style.text }}>
            <TagIcon />
            <span className="truncate">{tracks.join(', ')}</span>
          </div>
        )}
        {speakers.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <SpeakerIcon />
            <span className="truncate">
              {speakers.map(s => s.name || s.speakerName || s.fullName).filter(Boolean).join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Tags */}
      {Array.isArray(tags) && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 ml-2">
          {tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: 'rgba(255 255 255 / 0.04)', color: 'var(--text-muted)' }}>
              {typeof tag === 'string' ? tag : tag.displayValue || tag.name || tag.tagName}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5" style={{ color: 'var(--text-muted)' }}>+{tags.length - 3}</span>
          )}
        </div>
      )}
    </button>
  )
}

function ClockIcon() {
  return (
    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 10V5a2 2 0 012-2z" />
    </svg>
  )
}

function SpeakerIcon() {
  return (
    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}
