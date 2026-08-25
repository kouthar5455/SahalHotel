import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

// Route guard: renders `children` only for signed-in users with the Admin role.
// Redirects guests to /login and non-admin users back to the home page.
export default function RequireAdmin({ children }) {
  const { user, loading } = useAuth()

  // Wait until the auth provider finishes checking the current session.
  if (loading) return null

  // Guests must sign in before reaching any admin route.
  if (!user) {
    return <Navigate to="/login" state={{ message: 'Please login to continue', from: '/admin' }} replace />
  }

  // Signed-in non-admin users are sent back to the public site.
  if (user.role !== 'Admin') {
    return <Navigate to="/" replace />
  }

  // Admin users can access the protected page.
  return children
}
