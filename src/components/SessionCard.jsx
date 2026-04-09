import { formatDateTime, formatDuration } from '../utils/sessionHelpers'
import { getSpeakers, getSessionType, getTrackList } from '../utils/filterSessions'

const TYPE_COLORS = {
  Keynote: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Workshop: 'bg-green-500/20 text-green-300 border-green-500/30',
  Breakout: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Theater Session': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Ask the Experts': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Demo: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
}

const DEFAULT_TYPE_COLOR = 'bg-gray-700/50 text-gray-300 border-gray-600/50'

function TypeBadge({ type }) {
  if (!type) return null
  const cls = TYPE_COLORS[type] || DEFAULT_TYPE_COLOR
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${cls}`}>
      {type}
    </span>
  )
}

function LevelBadge({ level }) {
  if (!level) return null
  const n = String(level)
  const colors = {
    '100': 'bg-emerald-500/20 text-emerald-300',
    '200': 'bg-blue-500/20 text-blue-300',
    '300': 'bg-orange-500/20 text-orange-300',
    '400': 'bg-red-500/20 text-red-300',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${colors[n] || 'bg-gray-700 text-gray-300'}`}>
      L{n}
    </span>
  )
}

export default function SessionCard({ session, view, onSelect }) {
  const title = session.title || session.sessionTitle || 'Untitled Session'
  const description = session.description || session.sessionDescription || ''
  const speakers = getSpeakers(session)
  const type = getSessionType(session)
  const tracks = getTrackList(session)
  const level = session.level || session.sessionLevel || session.levelId
  const startRaw = session.startDateTime || session.startDate || session.scheduledDateTime
  const duration = session.durationInMinutes || session.duration
  const room = session.room || session.roomName || session.location
  const tags = session.tags || session.sessionTags || []

  if (view === 'list') {
    return (
      <button
        onClick={() => onSelect(session)}
        className="w-full text-left bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-blue-700 hover:bg-gray-900/80 transition-all group"
      >
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <TypeBadge type={type} />
              <LevelBadge level={level} />
              {session.isAvailableOnDemand && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-teal-500/20 text-teal-300">
                  On Demand
                </span>
              )}
            </div>
            <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2 text-sm leading-snug">
              {title}
            </h3>
            {speakers.length > 0 && (
              <p className="text-gray-400 text-xs mt-1">
                {speakers.map(s => s.name || s.speakerName || s.fullName).filter(Boolean).join(', ')}
              </p>
            )}
          </div>
          <div className="shrink-0 text-right space-y-1">
            {startRaw && (
              <p className="text-xs text-gray-400 whitespace-nowrap">
                {formatDateTime(startRaw)}
              </p>
            )}
            {duration && (
              <p className="text-xs text-gray-500">{formatDuration(duration)}</p>
            )}
            {tracks.length > 0 && (
              <p className="text-xs text-blue-400 truncate max-w-32">{tracks[0]}</p>
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
      className="w-full text-left bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-blue-700 hover:bg-gray-900/80 transition-all group flex flex-col gap-3"
    >
      {/* Badges */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <TypeBadge type={type} />
        <LevelBadge level={level} />
        {session.isAvailableOnDemand && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-teal-500/20 text-teal-300">
            On Demand
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-3 text-sm leading-snug flex-1">
        {title}
      </h3>

      {/* Description snippet */}
      {description && (
        <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}

      {/* Meta row */}
      <div className="flex flex-col gap-1 mt-auto pt-2 border-t border-gray-800">
        {startRaw && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <ClockIcon />
            <span>{formatDateTime(startRaw)}</span>
            {duration && <span className="text-gray-600">· {formatDuration(duration)}</span>}
          </div>
        )}
        {room && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <LocationIcon />
            <span className="truncate">{room}</span>
          </div>
        )}
        {tracks.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-blue-400">
            <TagIcon />
            <span className="truncate">{tracks.join(', ')}</span>
          </div>
        )}
        {speakers.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <SpeakerIcon />
            <span className="truncate">
              {speakers.map(s => s.name || s.speakerName || s.fullName).filter(Boolean).join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Tags */}
      {Array.isArray(tags) && tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 4).map((tag, i) => (
            <span key={i} className="text-xs px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded">
              {typeof tag === 'string' ? tag : tag.name || tag.tagName}
            </span>
          ))}
          {tags.length > 4 && (
            <span className="text-xs px-1.5 py-0.5 text-gray-600">+{tags.length - 4}</span>
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

function LocationIcon() {
  return (
    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
