import { useState } from 'react'
import Button from '../ui/Button'
import TextField from '../ui/TextField'
import ImageUpload from './ImageUpload'

const emptyForm = { name: '', location: '', description: '', imageUrl: '' }

// Validates required fields; returns a map of fieldName -> error message (empty object = valid).
function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Hotel name is required.'
  if (!form.location.trim()) errors.location = 'Location is required.'
  return errors
}

// Create/edit form for a hotel. Props: initialValues (prefill for edit mode, undefined for create),
// onSubmit (async callback invoked with the form data), onCancel (dismiss handler).
export default function HotelForm({ initialValues, onSubmit, onCancel }) {
  // Seed state from initialValues when editing, falling back to blank fields when creating
  const [form, setForm] = useState({ ...emptyForm, ...initialValues })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  // Preserves the original saved image URL so ImageUpload can tell a fresh session upload
  // apart from the already-persisted image (and avoid deleting the latter).
  const initialImage = initialValues?.imageUrl || ''

  // Generic input change handler: updates the field by name and clears any existing error for it.
  function handleChange(event) {
    const { name, value } = event.target
    setForm((f) => ({ ...f, [name]: value }))
    setFieldErrors((f) => ({ ...f, [name]: undefined }))
  }

  // Validates, then calls the parent-provided onSubmit with the form data.
  // Surfaces server-side error messages (e.g. from axios) if the submit fails.
  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    const errors = validate(form)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField label="Name" name="name" value={form.name} onChange={handleChange} error={fieldErrors.name} />
      <TextField
        label="Location"
        name="location"
        value={form.location}
        onChange={handleChange}
        error={fieldErrors.location}
      />
      <TextField label="Description" name="description" value={form.description} onChange={handleChange} />
      <ImageUpload
        value={form.imageUrl}
        initialValue={initialImage}
        onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="mt-2 flex gap-3">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
