import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import Button from '../components/ui/Button'
import TextField from '../components/ui/TextField'
import Logo from '../components/ui/Logo'
import { ArrowIcon } from '../components/ui/Icons'

// Login page: authenticates the user via context, then redirects based on where they came from or their role.
export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Generic controlled-input handler: reads `checked` for checkboxes, `value` for everything else, keyed by input `name`.
  function handleChange(event) {
    const { checked, name, type, value } = event.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  // Submits credentials to the auth context, then routes the user: back to the page that redirected them here,
  // to the admin dashboard for Admin accounts, or to the home page otherwise.
  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const loggedInUser = await login(form.email, form.password, form.rememberMe)
      if (location.state?.from) {
        navigate(location.state.from)
      } else if (loggedInUser.role === 'Admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-ink text-white">
      <img
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/55 lg:bg-gradient-to-r lg:from-ink/15 lg:via-ink/35 lg:to-ink/75" />

      <div className="relative flex min-h-dvh items-center justify-center px-4 py-4 sm:px-6 lg:justify-end lg:px-0 lg:py-0">
        <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-sm border border-white/10 bg-black/35 px-5 py-5 shadow-2xl backdrop-blur-md sm:px-7 sm:py-6 lg:flex lg:min-h-dvh lg:w-1/2 lg:max-w-none lg:items-center lg:justify-center lg:rounded-none lg:border-y-0 lg:border-r-0 lg:bg-black/30 lg:px-10 lg:py-0">
          <div className="w-full max-w-sm">
          <Link to="/" className="mb-4 inline-flex">
            <Logo textClassName="text-white" />
          </Link>

          <h1 className="mb-4 text-center font-display text-3xl font-semibold text-white sm:text-4xl">Login</h1>

          {/* Shown when redirected here from Register with { justRegistered: true } in router state */}
          {location.state?.justRegistered && (
            <p className="mb-4 rounded-sm bg-white/90 px-4 py-2 text-sm text-forest">
              Account created. You can log in now.
            </p>
          )}
          {/* Generic informational message passed via router state (e.g. by a route guard redirecting here) */}
          {location.state?.message && (
            <p className="mb-4 rounded-sm bg-white/90 px-4 py-2 text-sm text-ink/70">{location.state.message}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <TextField
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              tone="glass"
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              tone="glass"
              required
            />

            {error && <p className="text-sm text-red-200">{error}</p>}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-white/80">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={form.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-white/30 bg-white/90 accent-forest"
                />
                Remember me
              </label>
              <Link to="/reset-password" className="text-sm font-medium text-white/80 hover:text-mint">
                Forgot password?
              </Link>
            </div>

            <div className="flex items-center gap-3 text-xs text-white/65">
              <span className="h-px flex-1 bg-white/25" />
              <span>secure booking access</span>
              <span className="h-px flex-1 bg-white/25" />
            </div>

            <Button
              type="submit"
              variant="primary"
              icon={<ArrowIcon className="h-4 w-4" />}
              className="w-full rounded-sm bg-forest py-2.5 text-cream hover:bg-mint hover:text-forest-dark"
              disabled={submitting}
            >
              {submitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-white/70">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-white hover:text-mint">
              Register here
            </Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  )
}
