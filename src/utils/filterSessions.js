import { getSessionDate } from './sessionHelpers'

/**
 * Return a normalised, filtered, and sorted subset of sessions.
 */
export function filterSessions(sessions, filters, sortBy) {
  const { search, sessionType, track, level, day, speaker, onDemand } = filters

  const lower = search.toLowerCase().trim()

  const result = sessions.filter(s => {
    // Full-text search across title, description, speakers
    if (lower) {
      const title = (s.title || s.sessionTitle || '').toLowerCase()
      const desc = (s.description || s.sessionDescription || '').toLowerCase()
      const speakers = getSpeakers(s)
        .map(sp => (sp.name || sp.speakerName || '').toLowerCase())
        .join(' ')
      if (!title.includes(lower) && !desc.includes(lower) && !speakers.includes(lower)) {
        return false
      }
    }

    // Session type filter
    if (sessionType.length > 0) {
      const t = getSessionType(s)
      if (!t || !sessionType.includes(t)) return false
    }

    // Track filter
    if (track.length > 0) {
      const tracks = getTrackList(s)
      if (!tracks.some(t => track.includes(t))) return false
    }

    // Level filter
    if (level.length > 0) {
      const lvl = String(s.level || s.sessionLevel || s.levelId || '')
      if (!lvl || !level.includes(lvl)) return false
    }

    // Day filter
    if (day.length > 0) {
      const d = getSessionDate(s)
      if (!d || !day.includes(d)) return false
    }

    // Speaker name filter
    if (speaker.trim()) {
      const spLower = speaker.toLowerCase()
      const names = getSpeakers(s).map(sp =>
        (sp.name || sp.speakerName || sp.fullName || '').toLowerCase()
      )
      if (!names.some(n => n.includes(spLower))) return false
    }

    // On-demand filter
    if (onDemand && !s.isAvailableOnDemand) return false

    return true
  })

  return result.sort((a, b) => {
    if (sortBy === 'title') {
      const ta = a.title || a.sessionTitle || ''
      const tb = b.title || b.sessionTitle || ''
      return ta.localeCompare(tb)
    }
    if (sortBy === 'track') {
      const ta = getTrackList(a)[0] || ''
      const tb = getTrackList(b)[0] || ''
      return ta.localeCompare(tb)
    }
    // Default: sort by time
    const da = a.startDateTime || a.startDate || a.scheduledDateTime || ''
    const db = b.startDateTime || b.startDate || b.scheduledDateTime || ''
    if (!da && !db) return 0
    if (!da) return 1
    if (!db) return -1
    return da < db ? -1 : da > db ? 1 : 0
  })
}

// ---- helpers ----

export function getSpeakers(session) {
  return (
    session.speakers ||
    session.speakerList ||
    session.presenters ||
    []
  )
}

export function getSessionType(session) {
  return (
    session.sessionType ||
    session.format ||
    session.type ||
    session.sessionFormat ||
    null
  )
}

export function getTrackList(session) {
  const raw =
    session.tracks ||
    session.track ||
    session.sessionTracks ||
    []
  if (Array.isArray(raw)) {
    return raw.map(t => (typeof t === 'string' ? t : t.name || t.trackName || '')).filter(Boolean)
  }
  if (typeof raw === 'string') return raw ? [raw] : []
  return []
}
