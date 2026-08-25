import { useCallback, useEffect, useState } from 'react'
import api from '../api/client'

// Loads a single hotel's details by id. Re-fetches automatically whenever `id`
// changes (e.g. navigating between hotel detail pages), and exposes `refresh` for manual re-fetch.
export function useHotel(id) {
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Manually-triggerable fetch for the current `id`; recreated only when `id` changes.
  const refresh = useCallback(() => {
    setLoading(true)
    setError('')
    return api
      .get(`/hotels/${id}`)
      .then((res) => setHotel(res.data))
      .catch(() => setError('Could not load this hotel right now.'))
      .finally(() => setLoading(false))
  }, [id])

  // Fetch whenever `id` changes so switching hotels reloads the right record.
  useEffect(() => {
    let cancelled = false

    api
      .get(`/hotels/${id}`)
      .then((res) => {
        // Avoid setting state from a stale request if `id` changed or the component unmounted.
        if (!cancelled) setHotel(res.data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load this hotel right now.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  return { hotel, loading, error, refresh }
}
