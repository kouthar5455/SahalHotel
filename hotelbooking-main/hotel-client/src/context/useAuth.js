import { useContext } from 'react'
import { AuthContext } from './auth-context'

// Convenience hook to read the current auth state/actions ({ user, loading, login,
// register, logout }) from AuthContext without importing useContext everywhere.
export function useAuth() {
  return useContext(AuthContext)
}
