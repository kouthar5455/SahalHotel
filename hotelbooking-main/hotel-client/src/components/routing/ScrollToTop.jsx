import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Renders nothing; scrolls the window to the top on every route change so
// navigating between pages doesn't preserve the previous page's scroll position.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  // Re-runs whenever the path or hash changes (i.e. on every navigation)
  useEffect(() => {
    // Skip scrolling to top when navigating to an in-page anchor (e.g. #section)
    if (hash) return

    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [pathname, hash])

  return null
}