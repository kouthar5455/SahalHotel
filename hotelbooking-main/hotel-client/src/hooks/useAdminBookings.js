import { useCallback, useEffect, useState } from 'react'
import api from '../api/client'

// Loads the full list of bookings for the admin view. Fetches once on mount and
// also exposes a `refresh` function so callers (e.g. after an action) can re-fetch on demand.
export function useAdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Manually-triggerable fetch, memoized so it can be safely passed as a prop/dependency.
  const refresh = useCallback(() => {
    setLoading(true)
    setError('')
    return api
      .get('/bookings')
      .then((res) => setBookings(res.data))
      .catch(() => setError('Could not load bookings right now.'))
      .finally(() => setLoading(false))
  }, [])

  // Initial load on mount. Kept separate from `refresh` (rather than calling it) so this
  // effect has no function dependency to worry about; runs exactly once ([] deps).
  useEffect(() => {
    let cancelled = false

    api
      .get('/bookings')
      .then((res) => {
        // Guard against setting state after unmount (e.g. component navigated away mid-request).
        if (!cancelled) setBookings(res.data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load bookings right now.')
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
