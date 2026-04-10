/**
 * Extract a normalised date string (YYYY-MM-DD) for a session's start time.
 */
export function getSessionDate(session) {
  const raw =
    session.startDateTime ||
    session.startDate ||
    session.startTime ||
    session.scheduledDateTime ||
    null
  if (!raw) return null
  try {
    return new Date(raw).toISOString().slice(0, 10)
  } catch {
    return null
  }
}

/**
 * Format a UTC datetime string as a human-readable local date/time.
 */
export function formatDateTime(raw) {
  if (!raw) return null
  try {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(new Date(raw))
  } catch {
    return raw
  }
}

/**
 * Format duration in minutes to "Xh Ym" or just "Xm".
 */
export function formatDuration(minutes) {
  if (!minutes || isNaN(minutes)) return null
  const m = Number(minutes)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  const rem = m % 60
  return rem ? `${h}h ${rem}m` : `${h}h`
}

/**
 * Get a display-friendly label for the session level.
 */
export function formatLevel(level) {
  if (!level) return null
  const n = String(level)
  const map = {
    '100': 'L100 – Introductory',
    '200': 'L200 – Intermediate',
    '300': 'L300 – Advanced',
    '400': 'L400 – Expert',
  }
  return map[n] || `Level ${n}`
}

/**
 * Format a UTC datetime string as "11th April 2026" (no time).
 */
export function formatLastUpdated(raw) {
  if (!raw) return null
  try {
    const date = new Date(raw)
    const day = date.getUTCDate()
    const month = date.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' })
    const year = date.getUTCFullYear()
    const suffix =
      day >= 11 && day <= 13 ? 'th'
      : day % 10 === 1 ? 'st'
      : day % 10 === 2 ? 'nd'
      : day % 10 === 3 ? 'rd'
      : 'th'
    return `${day}${suffix} ${month} ${year}`
  } catch {
    return null
  }
}

/**
 * Collect unique values for a given field across all sessions.
 */
export function uniqueValues(sessions, getter) {
  const set = new Set()
  sessions.forEach(s => {
    const val = getter(s)
    if (Array.isArray(val)) val.forEach(v => v && set.add(v))
    else if (val) set.add(val)
  })
  return [...set].sort()
}
