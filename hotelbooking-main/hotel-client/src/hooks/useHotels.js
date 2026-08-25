import { useCallback, useEffect, useState } from 'react'
import api from '../api/client'

// Loads the hotel list, optionally filtered/sorted by `params` (e.g. search, city).
// Automatically re-fetches whenever the filter params change, and exposes `refresh`.
export function useHotels(params) {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // `params` is often a fresh object/reference on every render (e.g. inline object literal),
  // so it's serialized to a stable string key for use as a hook dependency.
  const paramsKey = JSON.stringify(params || {})

  // Manually-triggerable fetch using the current params; re-created only when they actually change.
  const refresh = useCallback(() => {
    setLoading(true)
    setError('')
    return api
      .get('/hotels', { params: JSON.parse(paramsKey) })
      .then((res) => setHotels(res.data))
      .catch(() => setError('Could not load hotels right now.'))
      .finally(() => setLoading(false))
  }, [paramsKey])

  // Fetch whenever the (stringified) params change so filters/search stay in sync with results.
  useEffect(() => {
    let cancelled = false

    api
      .get('/hotels', { params: JSON.parse(paramsKey) })
      .then((res) => {
        // Ignore the response if a newer params change or unmount happened first.
        if (!cancelled) setHotels(res.data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load hotels right now.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [paramsKey])

  return { hotels, loading, error, refresh }
}
