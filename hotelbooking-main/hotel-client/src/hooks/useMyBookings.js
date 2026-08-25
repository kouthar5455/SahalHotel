import { useCallback, useEffect, useState } from 'react'
import api from '../api/client'

// Hook that fetches the current user's bookings and exposes loading/error state plus a manual refresh function.
export function useMyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Manually re-fetches the bookings list (e.g. after cancelling a booking); callers can await the returned promise.
  const refresh = useCallback(() => {
    setLoading(true)
    setError('')
    return api
      .get('/bookings/my')
      .then((res) => setBookings(res.data))
      .catch(() => setError('Could not load your bookings right now.'))
      .finally(() => setLoading(false))
  }, [])

  // Fetches bookings once on mount. Uses a `cancelled` flag so state isn't set if the component unmounts before the request resolves.
  useEffect(() => {
    let cancelled = false

    api
      .get('/bookings/my')
      .then((res) => {
        if (!cancelled) setBookings(res.data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load your bookings right now.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { bookings, loading, error, refresh }
}
