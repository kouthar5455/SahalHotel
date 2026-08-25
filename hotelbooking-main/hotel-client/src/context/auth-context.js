import { createContext } from 'react'

// Split into its own file (separate from AuthContext.jsx's provider component) so
// non-component modules like useAuth.js can import just the context, not the component.
export const AuthContext = createContext(null)
