import { useEffect, useRef, useState } from 'react'
import { formatDateTime, formatDuration, formatLevel } from '../utils/sessionHelpers'
import { getSpeakers, getSessionType, getTrackList, getSessionLevelCode } from '../utils/filterSessions'

const TYPE_ACCENT = {
  Keynote: 'var(--accent-amber)',
  Workshop: 'var(--accent-emerald)',
  Breakout: 'var(--accent-cyan)',
  'Theater Session': 'var(--accent-violet)',
  'Ask the Experts': 'var(--accent-amber)',
  Demo: 'var(--accent-rose)',
}

export default function SessionModal({ session, speakerMap, onClose }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const title = session.title || session.sessionTitle || 'Untitled Session'
  const description = session.description || session.sessionDescription || ''
  const rawSpeakers = getSpeakers(session)
  // Enrich speakers with full data from speakerMap using speakerIds
  const speakers = (session.speakerIds && speakerMap && speakerMap.size > 0)
    ? session.speakerIds
        .map(id => speakerMap.get(id))
        .filter(Boolean)
    : rawSpeakers
  const type = getSessionType(session)
  const tracks = getTrackList(session)
  const level = getSessionLevelCode(session)
  const startRaw = session.startDateTime || session.startDate || session.scheduledDateTime
  const endRaw = session.endDateTime || session.endDate
  const duration = session.durationInMinutes || session.duration
  const room = session.room || session.roomName || session.location
  const tags = session.tags || session.sessionTags || []
  const sessionId = session.sessionId || session.id
  const sessionCode = session.sessionCode || session.code
  const contentUrl = session.contentUrl || session.recordingUrl || session.sessionUrl
  const accent = TYPE_ACCENT[type] || 'var(--accent-cyan)'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0 0 0 / 0.75)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-modal-enter"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)' }}
      >
        {/* Accent top bar */}
        <div className="h-1 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}80, transparent)` }} />

        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {type && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium font-display tracking-wide" style={{ background: `color-mix(in srgb, ${accent} 12%, transparent)`, color: accent, border: `1px solid color-mix(in srgb, ${accent} 20%, transparent)` }}>
                  {type}
                </span>
              )}
              {level && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium" style={{ background: 'rgba(255 255 255 / 0.04)', color: 'var(--text-secondary)' }}>
                  {formatLevel(level)}
                </span>
              )}
              {sessionCode && (
                <span className="font-mono text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{sessionCode}</span>
              )}
            </div>
            <h2 className="font-display text-xl font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-2 rounded-lg transition-colors duration-150"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 space-y-6">
          {/* Key details */}
          <div className="grid grid-cols-2 gap-2.5">
            {startRaw && (
              <DetailBlock label="Start" accent={accent}>
                {formatDateTime(startRaw)}
              </DetailBlock>
            )}
            {endRaw && (
              <DetailBlock label="End" accent={accent}>
                {formatDateTime(endRaw)}
              </DetailBlock>
            )}
            {duration && (
              <DetailBlock label="Duration" accent={accent}>
                {formatDuration(duration)}
              </DetailBlock>
            )}
            {room && (
              <DetailBlock label="Room" accent={accent}>
                {room}
              </DetailBlock>
            )}
          </div>

          {/* Tracks */}
          {tracks.length > 0 && (
            <Section title="Topics">
              <div className="flex flex-wrap gap-2">
                {tracks.map((t, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg text-sm font-medium" style={{ background: `color-mix(in srgb, ${accent} 8%, transparent)`, color: accent, border: `1px solid color-mix(in srgb, ${accent} 15%, transparent)` }}>
                    {t}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Description */}
          {description && (
            <Section title="About">
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{description}</p>
            </Section>
          )}

          {/* Speakers */}
          {speakers.length > 0 && (
            <Section title="Speakers">
              <div className="grid gap-2.5">
                {speakers.map((sp, i) => (
                  <SpeakerCard key={sp.speakerId || sp.id || i} speaker={sp} accent={accent} />
                ))}
              </div>
            </Section>
          )}

          {/* Tags */}
          {Array.isArray(tags) && tags.length > 0 && (
            <Section title="Tags">
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 rounded text-xs font-medium" style={{ background: 'rgba(255 255 255 / 0.04)', color: 'var(--text-muted)' }}>
                    {typeof tag === 'string' ? tag : tag.displayValue || tag.name || tag.tagName}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Link */}
          {contentUrl && (
            <div className="pt-2">
              <a
                href={contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-display font-semibold transition-all duration-200 hover:scale-[1.02]"
                style={{ background: accent, color: 'var(--bg-base)' }}
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

function Section({ title, children }) {
  return (
    <div>
      <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: 'var(--text-muted)' }}>{title}</h3>
      {children}
    </div>
  )
}

function DetailBlock({ label, accent, children }) {
  return (
    <div className="rounded-lg p-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
      <p className="text-[11px] font-display font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{children}</p>
    </div>
  )
}

function SpeakerCard({ speaker, accent }) {
  const [bioExpanded, setBioExpanded] = useState(false)
  const [bioIsClamped, setBioIsClamped] = useState(false)
  const bioRef = useRef(null)
  const name = speaker.displayName || speaker.name || speaker.speakerName || speaker.fullName || 'Unknown'
  const role = speaker.jobTitle || speaker.role || speaker.title
  const company = speaker.company || speaker.organization
  const bio = speaker.bio || speaker.biography
  const photo = speaker.photo || speaker.photoUrl || speaker.imageUrl || speaker.avatarUrl
  const linkedIn = speaker.linkedIn

  useEffect(() => {
    if (bioRef.current) {
      setBioIsClamped(bioRef.current.scrollHeight > bioRef.current.clientHeight)
    }
  }, [bio, bioExpanded])

  return (
    <div className="flex items-start gap-4 rounded-xl p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
      {photo ? (
        <img src={photo} alt={name} className="w-14 h-14 rounded-full object-cover shrink-0" style={{ border: '2px solid var(--border-medium)' }} />
      ) : (
        <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 font-display font-bold text-lg" style={{ background: `color-mix(in srgb, ${accent} 15%, transparent)`, color: accent, border: '2px solid var(--border-medium)' }}>
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-display text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{name}</p>
          {linkedIn && (
            <a
              href={linkedIn.startsWith('http') ? linkedIn : `https://www.linkedin.com/in/${linkedIn}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 transition-opacity hover:opacity-80"
              title={`${name} on LinkedIn`}
              onClick={e => e.stopPropagation()}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#f5a623">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          )}
        </div>
        {(role || company) && (
          <p className="text-xs mt-0.5 font-semibold" style={{ color: 'var(--text-secondary)' }}>
            {role}{role && company ? ', ' : ''}<span style={{ color: 'var(--text-muted)' }}>{company}</span>
          </p>
        )}
        {bio && (
          <div className="mt-2">
            <p ref={bioRef} className={`text-xs leading-relaxed${bioExpanded ? '' : ' line-clamp-3'}`} style={{ color: 'var(--text-muted)' }}>{bio}</p>
            {(bioIsClamped || bioExpanded) && (
              <button
                className="text-xs mt-1 font-semibold transition-opacity hover:opacity-80"
                style={{ color: accent }}
                aria-expanded={bioExpanded}
                aria-label="Toggle speaker biography"
                onClick={() => setBioExpanded(prev => !prev)}
              >
                {bioExpanded ? 'Less' : 'More'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
