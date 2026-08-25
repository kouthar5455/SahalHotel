import { useCallback, useEffect, useState } from 'react'
import api from '../api/client'

// Hook that fetches the list of users (admin) and exposes loading/error state plus a manual refresh function.
export function useUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Manually re-fetches the users list (e.g. after an admin edits a user); callers can await the returned promise.
  const refresh = useCallback(() => {
    setLoading(true)
    setError('')
    return api
      .get('/users')
      .then((res) => setUsers(res.data))
      .catch(() => setError('Could not load users right now.'))
      .finally(() => setLoading(false))
  }, [])

  // Fetches users once on mount. Uses a `cancelled` flag so state isn't set if the component unmounts before the request resolves.
  useEffect(() => {
    let cancelled = false

    api
      .get('/users')
      .then((res) => {
        if (!cancelled) setUsers(res.data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load users right now.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { users, loading, error, refresh }
}
