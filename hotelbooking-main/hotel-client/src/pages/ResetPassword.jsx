import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import TextField from '../components/ui/TextField'
import Logo from '../components/ui/Logo'
import { ArrowIcon } from '../components/ui/Icons'
import api from '../api/client'

const initialForm = { email: '', newPassword: '', confirmPassword: '' }

// Password reset page: validates that the two password fields match, then posts to the reset endpoint (email-based, no token flow).
export default function ResetPassword() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Generic controlled-input handler keyed by input `name`, shared across all text fields in the form.
  function handleChange(event) {
    const { name, value } = event.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  // Client-side confirmation check, then submits the reset request and redirects to Login with a success message on completion.
  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      await api.post('/auth/reset-password', {
        email: form.email,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      })
      navigate('/login', {
        state: { message: 'Password reset successfully. You can now log in.' },
      })
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

          <h1 className="mb-2 text-center font-display text-3xl font-semibold text-white sm:text-4xl">Reset Password</h1>
          <p className="mb-4 text-center text-sm text-white/70">
            Enter your email and choose a new password.
          </p>

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
              label="New password"
              name="newPassword"
              type="password"
              placeholder="Enter your new password"
              value={form.newPassword}
              onChange={handleChange}
              minLength={6}
              tone="glass"
              required
            />
            <TextField
              label="Confirm new password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your new password"
              value={form.confirmPassword}
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
              {submitting ? 'Resetting...' : 'Reset password'}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-white/70">
            Remember your password?{' '}
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
