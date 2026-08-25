import { useCallback, useEffect, useState } from 'react'
import api from '../api/client'

// Hook that fetches admin dashboard statistics and exposes loading/error state plus a manual refresh function.
export function useStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Manually re-fetches the stats (e.g. after data changes elsewhere); callers can await the returned promise.
  const refresh = useCallback(() => {
    setLoading(true)
    setError('')
    return api
      .get('/stats')
      .then((res) => setStats(res.data))
      .catch(() => setError('Could not load statistics right now.'))
      .finally(() => setLoading(false))
  }, [])

  // Fetches stats once on mount. Uses a `cancelled` flag so state isn't set if the component unmounts before the request resolves.
  useEffect(() => {
    let cancelled = false

    api
      .get('/stats')
      .then((res) => {
        if (!cancelled) setStats(res.data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load statistics right now.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { stats, loading, error, refresh }
}
