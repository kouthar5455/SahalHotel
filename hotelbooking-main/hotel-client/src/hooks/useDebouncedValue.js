import { useEffect, useState } from 'react'

// Returns a version of `value` that only updates after it has stopped changing
// for `delay` ms — useful for delaying search/API calls while a user is typing.
export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    // Schedule the update; if `value` changes again before `delay` elapses, the
    // cleanup below cancels the pending timer so only the latest value "wins".
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
