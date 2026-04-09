import { useReducer, useEffect } from 'react'

const initialState = { sessions: [], loading: true, error: null }

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { sessions: [], loading: true, error: null }
    case 'SUCCESS':
      return { sessions: action.sessions, loading: false, error: null }
    case 'ERROR':
      return { sessions: [], loading: false, error: action.error }
    default:
      return state
  }
}

export function useSessionData(url) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    let cancelled = false
    dispatch({ type: 'LOADING' })

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        return res.json()
      })
      .then(data => {
        if (cancelled) return
        // API may return an array directly or wrapped in a property
        const list = Array.isArray(data)
          ? data
          : data.sessions || data.data || data.items || []
        dispatch({ type: 'SUCCESS', sessions: list })
      })
      .catch(err => {
        if (cancelled) return
        dispatch({ type: 'ERROR', error: err.message })
      })

    return () => { cancelled = true }
  }, [url])

  return state
}

