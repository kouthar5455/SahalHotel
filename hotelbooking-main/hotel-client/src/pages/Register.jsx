import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import Button from '../components/ui/Button'
import TextField from '../components/ui/TextField'
import Logo from '../components/ui/Logo'
import { ArrowIcon } from '../components/ui/Icons'

const initialForm = { fullName: '', email: '', password: '', phoneNumber: '' }

// Registration page: collects account details, creates the account via context, then redirects to Login with a success flag.
export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Generic controlled-input handler keyed by input `name`, shared across all text fields in the form.
  function handleChange(event) {
    const { name, value } = event.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  // Submits the registration form; on success navigates to Login and flags `justRegistered` so it can show a confirmation message.
  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(form)
      navigate('/login', { state: { justRegistered: true } })
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-ink text-white">
      <img
        src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1800&q=85"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/55 lg:bg-gradient-to-r lg:from-ink/15 lg:via-ink/35 lg:to-ink/75" />

      <div className="relative flex min-h-dvh items-center justify-center px-4 py-4 sm:px-6 lg:justify-end lg:px-0 lg:py-0">
        <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-sm border border-white/10 bg-black/35 px-5 py-4 shadow-2xl backdrop-blur-md sm:px-7 sm:py-5 lg:flex lg:min-h-dvh lg:w-1/2 lg:max-w-none lg:items-center lg:justify-center lg:rounded-none lg:border-y-0 lg:border-r-0 lg:bg-black/30 lg:px-10 lg:py-0">
          <div className="w-full max-w-sm">
          <Link to="/" className="mb-3 inline-flex">
            <Logo textClassName="text-white" />
          </Link>

          <h1 className="mb-3 text-center font-display text-3xl font-semibold text-white sm:text-4xl">Sign Up</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
            <TextField
              label="Full name"
              name="fullName"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={handleChange}
              tone="glass"
              required
            />
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
              label="Phone number"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="0612345678"
              // Browser-native validation: enforces the local phone format (starts with 061, 10 digits total) before submit
              pattern="061[0-9]{7}"
              title="Must start with 061 and be exactly 10 digits"
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

            <Button
              type="submit"
              variant="primary"
              icon={<ArrowIcon className="h-4 w-4" />}
              className="w-full rounded-sm bg-forest py-2.5 text-cream hover:bg-mint hover:text-forest-dark"
              disabled={submitting}
            >
              {submitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="mt-3 text-center text-xs text-white/70">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-white hover:text-mint">
              Login
            </Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  )
}
