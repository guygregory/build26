import { getSessionDate } from './sessionHelpers'

/**
 * Return a normalised, filtered, and sorted subset of sessions.
 */
export function filterSessions(sessions, filters, sortBy) {
  const { search, sessionType, track, level, day, speaker, deliveryType } = filters

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
      const lvl = getSessionLevelCode(s)
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
      const speakerStr = (s.speakerNames || '').toLowerCase()
      const names = getSpeakers(s).map(sp =>
        (sp.name || sp.speakerName || sp.fullName || '').toLowerCase()
      )
      if (!speakerStr.includes(spLower) && !names.some(n => n.includes(spLower))) return false
    }

    // Delivery type filter
    if (deliveryType.length > 0) {
      const types = getDeliveryTypes(s)
      if (!types.some(t => deliveryType.includes(t))) return false
    }

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
    if (sortBy === 'lastUpdate') {
      const da = a.lastUpdate || a.lastUpdated || a.updatedAt || ''
      const db = b.lastUpdate || b.lastUpdated || b.updatedAt || ''
      if (!da && !db) return 0
      if (!da) return 1
      if (!db) return -1
      return da > db ? -1 : da < db ? 1 : 0
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
  if (session.speakers || session.speakerList || session.presenters) {
    return session.speakers || session.speakerList || session.presenters
  }
  // Build API returns a comma-separated string
  if (session.speakerNames) {
    return session.speakerNames.split(',').map(n => ({ name: n.trim() })).filter(s => s.name)
  }
  return []
}

export function getSessionType(session) {
  const t = session.sessionType || session.format || session.type || session.sessionFormat || null
  if (t && typeof t === 'object') return t.displayValue || t.logicalValue || null
  return t
}

export function getTrackList(session) {
  const raw =
    session.tracks ||
    session.track ||
    session.sessionTracks ||
    session.topic ||
    []
  if (Array.isArray(raw)) {
    return raw.map(t => (typeof t === 'string' ? t : t.displayValue || t.name || t.trackName || '')).filter(Boolean)
  }
  if (typeof raw === 'string') return raw ? [raw] : []
  return []
}

export function getSessionLevelCode(session) {
  const lvl = session.level || session.sessionLevel || session.levelId
  if (!lvl) return null
  if (typeof lvl === 'number') return String(lvl)
  if (typeof lvl === 'string') return lvl
  if (Array.isArray(lvl) && lvl.length > 0) {
    const val = lvl[0].logicalValue || lvl[0].displayValue || ''
    const match = val.match(/\((\d+)\)/)
    return match ? match[1] : null
  }
  return null
}

export function getDeliveryTypes(session) {
  const raw = session.deliveryTypes || []
  if (Array.isArray(raw)) {
    return raw.map(t => (typeof t === 'string' ? t : t.displayValue || t.logicalValue || '')).filter(Boolean)
  }
  if (typeof raw === 'string') return raw ? [raw] : []
  return []
}
