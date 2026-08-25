import axios from 'axios'

// Shared axios instance for all API calls in the app.
// Base URL comes from the Vite env var (set per environment), falling back to local dev backend.
// withCredentials: true ensures auth cookies are sent/received on cross-origin requests.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5008/api',
  withCredentials: true,
})

export default api
