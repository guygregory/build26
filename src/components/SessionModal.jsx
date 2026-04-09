import { useEffect } from 'react'
import { formatDateTime, formatDuration, formatLevel } from '../utils/sessionHelpers'
import { getSpeakers, getSessionType, getTrackList } from '../utils/filterSessions'

export default function SessionModal({ session, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const title = session.title || session.sessionTitle || 'Untitled Session'
  const description = session.description || session.sessionDescription || ''
  const speakers = getSpeakers(session)
  const type = getSessionType(session)
  const tracks = getTrackList(session)
  const level = session.level || session.sessionLevel || session.levelId
  const startRaw = session.startDateTime || session.startDate || session.scheduledDateTime
  const endRaw = session.endDateTime || session.endDate
  const duration = session.durationInMinutes || session.duration
  const room = session.room || session.roomName || session.location
  const capacity = session.capacity || session.roomCapacity
  const registered = session.registrationCount || session.attendeeCount
  const tags = session.tags || session.sessionTags || []
  const sessionId = session.sessionId || session.id
  const sessionCode = session.sessionCode || session.code
  const contentUrl = session.contentUrl || session.recordingUrl || session.sessionUrl

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-800 gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-3">
              {type && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {type}
                </span>
              )}
              {level && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-orange-500/20 text-orange-300">
                  {formatLevel(level)}
                </span>
              )}
              {session.isAvailableOnDemand && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-teal-500/20 text-teal-300">
                  ✓ On Demand
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white leading-snug">{title}</h2>
            {sessionCode && (
              <p className="text-gray-500 text-xs mt-1">Session code: {sessionCode}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Key details grid */}
          <div className="grid grid-cols-2 gap-3">
            {startRaw && (
              <DetailBlock icon="🗓" label="Start">
                {formatDateTime(startRaw)}
              </DetailBlock>
            )}
            {endRaw && (
              <DetailBlock icon="🏁" label="End">
                {formatDateTime(endRaw)}
              </DetailBlock>
            )}
            {duration && (
              <DetailBlock icon="⏱" label="Duration">
                {formatDuration(duration)}
              </DetailBlock>
            )}
            {room && (
              <DetailBlock icon="📍" label="Room">
                {room}
              </DetailBlock>
            )}
            {capacity && (
              <DetailBlock icon="🪑" label="Capacity">
                {capacity.toLocaleString()} seats
              </DetailBlock>
            )}
            {registered !== undefined && registered !== null && (
              <DetailBlock icon="👥" label="Registered">
                {Number(registered).toLocaleString()}
              </DetailBlock>
            )}
            {sessionId && (
              <DetailBlock icon="🆔" label="Session ID">
                <span className="font-mono text-xs">{sessionId}</span>
              </DetailBlock>
            )}
          </div>

          {/* Tracks */}
          {tracks.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tracks</h3>
              <div className="flex flex-wrap gap-2">
                {tracks.map((t, i) => (
                  <span key={i} className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm rounded-lg">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {description && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{description}</p>
            </div>
          )}

          {/* Speakers */}
          {speakers.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Speakers</h3>
              <div className="grid gap-3">
                {speakers.map((sp, i) => (
                  <SpeakerCard key={sp.speakerId || sp.id || i} speaker={sp} />
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {Array.isArray(tags) && tags.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-md">
                    {typeof tag === 'string' ? tag : tag.name || tag.tagName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Extra metadata (render any remaining fields) */}
          <ExtraFields session={session} />

          {/* Link */}
          {contentUrl && (
            <div className="pt-2">
              <a
                href={contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                View Session ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailBlock({ icon, label, children }) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-3">
      <p className="text-xs text-gray-500 mb-0.5">{icon} {label}</p>
      <p className="text-sm text-white font-medium">{children}</p>
    </div>
  )
}

function SpeakerCard({ speaker }) {
  const name = speaker.name || speaker.speakerName || speaker.fullName || 'Unknown'
  const role = speaker.role || speaker.jobTitle || speaker.title
  const company = speaker.company || speaker.organization
  const bio = speaker.bio || speaker.biography
  const photo = speaker.photoUrl || speaker.imageUrl || speaker.avatarUrl

  return (
    <div className="flex items-start gap-3 bg-gray-800/50 rounded-xl p-3">
      {photo ? (
        <img src={photo} alt={name} className="w-10 h-10 rounded-full object-cover shrink-0" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center shrink-0 text-gray-400 text-sm font-semibold">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{name}</p>
        {(role || company) && (
          <p className="text-xs text-gray-400 mt-0.5">
            {[role, company].filter(Boolean).join(' · ')}
          </p>
        )}
        {bio && (
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-3 leading-relaxed">{bio}</p>
        )}
      </div>
    </div>
  )
}

const KNOWN_FIELDS = new Set([
  'sessionId', 'id', 'title', 'sessionTitle', 'description', 'sessionDescription',
  'speakers', 'speakerList', 'presenters',
  'sessionType', 'format', 'type', 'sessionFormat',
  'tracks', 'track', 'sessionTracks',
  'level', 'sessionLevel', 'levelId',
  'startDateTime', 'startDate', 'scheduledDateTime',
  'endDateTime', 'endDate',
  'durationInMinutes', 'duration',
  'room', 'roomName', 'location',
  'capacity', 'roomCapacity',
  'registrationCount', 'attendeeCount',
  'sessionCode', 'code',
  'contentUrl', 'recordingUrl', 'sessionUrl',
  'isAvailableOnDemand',
  'tags', 'sessionTags',
])

function ExtraFields({ session }) {
  const extra = Object.entries(session).filter(
    ([key, val]) =>
      !KNOWN_FIELDS.has(key) &&
      val !== null &&
      val !== undefined &&
      val !== '' &&
      !Array.isArray(val)
  )

  if (extra.length === 0) return null

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Additional Details
      </h3>
      <div className="grid gap-2">
        {extra.map(([key, val]) => (
          <div key={key} className="flex gap-3 text-sm">
            <span className="text-gray-500 shrink-0 min-w-32 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}:
            </span>
            <span className="text-gray-300 break-all">
              {typeof val === 'boolean'
                ? val ? '✓ Yes' : '✗ No'
                : typeof val === 'object'
                ? JSON.stringify(val)
                : String(val)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
