import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

// Route guard: renders `children` only if a user is signed in, otherwise
// redirects to /login (passing along a message and the original path so the
// login page can return the user here afterwards).
export default function RequireAuth({ children, message = 'Please login to continue' }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Auth state hasn't resolved yet (e.g. session check in progress) — render nothing to avoid a flash redirect
  if (loading) return null

  if (!user) {
    return <Navigate to="/login" state={{ message, from: location.pathname }} replace />
  }

  return children
}
