import { useCallback, useEffect, useState } from 'react'
import api from '../api/client'

// Hook that fetches a single room by id and exposes loading/error state plus a manual refresh function.
export function useRoom(id) {
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Manually re-fetches the room; recreated whenever `id` changes since the request URL depends on it.
  const refresh = useCallback(() => {
    setLoading(true)
    setError('')
    return api
      .get(`/rooms/${id}`)
      .then((res) => setRoom(res.data))
      .catch(() => setError('Could not load this room right now.'))
      .finally(() => setLoading(false))
  }, [id])

  // Re-fetches whenever `id` changes. `cancelled` guards against setting state after unmount or after `id` changes mid-flight.
  useEffect(() => {
    let cancelled = false

    api
      .get(`/rooms/${id}`)
      .then((res) => {
        if (!cancelled) setRoom(res.data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load this room right now.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  return { room, loading, error, refresh }
}
