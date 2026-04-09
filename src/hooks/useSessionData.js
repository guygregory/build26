import { useReducer, useEffect, useMemo } from 'react'

const initialState = { sessions: [], speakers: [], loading: true, error: null }

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { sessions: [], speakers: [], loading: true, error: null }
    case 'SUCCESS':
      return { sessions: action.sessions, speakers: action.speakers, loading: false, error: null }
    case 'ERROR':
      return { sessions: [], speakers: [], loading: false, error: action.error }
    default:
      return state
  }
}

export function useSessionData(sessionsUrl, speakersUrl) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    let cancelled = false
    dispatch({ type: 'LOADING' })

    Promise.all([
      fetch(sessionsUrl).then(res => {
        if (!res.ok) throw new Error(`Sessions: HTTP ${res.status}: ${res.statusText}`)
        return res.json()
      }),
      fetch(speakersUrl).then(res => {
        if (!res.ok) throw new Error(`Speakers: HTTP ${res.status}: ${res.statusText}`)
        return res.json()
      }),
    ])
      .then(([sessionsData, speakersData]) => {
        if (cancelled) return
        const sessions = Array.isArray(sessionsData)
          ? sessionsData
          : sessionsData.sessions || sessionsData.data || sessionsData.items || []
        const speakers = Array.isArray(speakersData)
          ? speakersData
          : speakersData.speakers || speakersData.data || speakersData.items || []
        dispatch({ type: 'SUCCESS', sessions, speakers })
      })
      .catch(err => {
        if (cancelled) return
        dispatch({ type: 'ERROR', error: err.message })
      })

    return () => { cancelled = true }
  }, [sessionsUrl, speakersUrl])

  const speakerMap = useMemo(() => {
    const map = new Map()
    for (const sp of state.speakers) {
      if (sp.speakerId) map.set(sp.speakerId, sp)
    }
    return map
  }, [state.speakers])

  return { ...state, speakerMap }
}

