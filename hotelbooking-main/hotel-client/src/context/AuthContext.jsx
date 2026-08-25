import { useEffect, useState } from 'react'
import api from '../api/client'
import { AuthContext } from './auth-context'

// Wraps the app to provide auth state (current user, loading flag) and actions
// (login/register/logout) via AuthContext, so any descendant can call useAuth().
export function AuthProvider({ children }) {
  // `user` stores the signed-in account; `loading` prevents route checks before auth is known.
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    // On app start, ask the API who the current cookie belongs to.
    api
      .get('/auth/me')
      .then((res) => {
        if (!cancelled) setUser(res.data)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      // Prevent state updates if the provider unmounts before the request finishes.
      cancelled = true
    }
  }, [])

  // Login sets the auth cookie on the API, then fetches the full current user.
  async function login(email, password, rememberMe = false) {
    await api.post('/auth/login', { email, password, rememberMe })
    const res = await api.get('/auth/me')
    setUser(res.data)
    return res.data
  }

  // Register creates an account; this app keeps login as a separate step.
  async function register(payload) {
    await api.post('/auth/register', payload)
  }

  // Logout clears the server cookie and resets local auth state.
  async function logout() {
    await api.post('/auth/logout')
    setUser(null)
  }

  return (
    // Expose auth state and actions to any component through `useAuth`.
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
