import { useState } from 'react'
import Button from '../ui/Button'
import { EyeIcon, EyeOffIcon } from '../ui/Icons'

// Create/edit form for a user account. Props: initialValues (prefill for edit mode),
// mode ('create' or 'edit' — controls whether password/role fields show), onSubmit
// (async callback with the payload), onCancel (dismiss handler).
export default function UserForm({ initialValues, mode = 'edit', onSubmit, onCancel }) {
  const isCreate = mode === 'create'
  const [fullName, setFullName] = useState(initialValues?.fullName || '')
  const [email, setEmail] = useState(initialValues?.email || '')
  const [phoneNumber, setPhoneNumber] = useState(initialValues?.phoneNumber || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState(initialValues?.role || 'User')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  // Validates all fields; password/role checks only apply in create mode since
  // editing an existing user doesn't change their password here.
  function validate() {
    const next = {}
    if (!fullName.trim()) next.fullName = 'Full name is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address'
    if (phoneNumber && !/^061\d{7}$/.test(phoneNumber))
      next.phoneNumber = 'Phone must start with 061 and be 10 digits'
    if (isCreate && password.length < 6) next.password = 'Password must be at least 6 characters'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  // Validates then submits; password and role are only included in the payload
  // when creating a new user (editing doesn't touch those fields).
  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    if (!validate()) return
    setSubmitting(true)
    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber || null,
      }
      if (isCreate) {
        payload.password = password
        payload.role = role
      }
      await onSubmit(payload)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'rounded-xl border border-ink/10 px-4 py-2.5 text-sm focus:border-forest focus:outline-none'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Full name</label>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
        {errors.fullName && <span className="text-xs text-red-600">{errors.fullName}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} autoComplete="off" />
        {errors.email && <span className="text-xs text-red-600">{errors.email}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Phone number</label>
        <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="061XXXXXXX" className={inputClass} />
        {errors.phoneNumber && <span className="text-xs text-red-600">{errors.phoneNumber}</span>}
      </div>

      {/* Password and role are only collected when creating a brand-new user */}
      {isCreate && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} w-full pr-11`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 flex h-5 w-5 items-center justify-center text-ink/40 hover:text-ink"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <span className="text-xs text-red-600">{errors.password}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className={inputClass}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </>
      )}

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Saving…' : isCreate ? 'Create user' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}
