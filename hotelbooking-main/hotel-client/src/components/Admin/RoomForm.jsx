import { useState } from 'react'
import Button from '../ui/Button'
import TextField from '../ui/TextField'
import { roomTypes, roomTypeMap } from '../../data/roomTypes'

const emptyForm = { roomType: '', description: '', pricePerNight: '', capacity: '' }

// Validates the room form: room type required, price must be positive, and capacity
// must fall within the min/max range defined for the selected known room type.
function validate(form) {
  const errors = {}
  if (!form.roomType) errors.roomType = 'Please select a room type.'
  if (!form.pricePerNight || Number(form.pricePerNight) <= 0) errors.pricePerNight = 'Enter a price greater than 0.'

  const type = roomTypeMap[form.roomType]
  const capacity = Number(form.capacity)
  if (!form.capacity || capacity < 1) {
    errors.capacity = 'Capacity must be at least 1.'
  } else if (type && (capacity < type.minCapacity || capacity > type.maxCapacity)) {
    errors.capacity =
      type.minCapacity === type.maxCapacity
        ? `${form.roomType} must have a capacity of ${type.minCapacity}.`
        : `${form.roomType} capacity must be between ${type.minCapacity} and ${type.maxCapacity}.`
  }
  return errors
}

const inputClass =
  'rounded-xl border border-ink/10 px-4 py-2.5 text-sm focus:border-forest focus:outline-none'

// Create/edit form for a hotel room. Props: initialValues (prefill for edit mode),
// onSubmit (async callback with the parsed room payload), onCancel (dismiss handler).
export default function RoomForm({ initialValues, onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...emptyForm, ...initialValues })
  // Existing rooms already have a description the admin chose — don't overwrite it.
  const [descriptionTouched, setDescriptionTouched] = useState(!!initialValues?.description)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Include a legacy free-text room type as an option so old rooms stay editable.
  const knownType = roomTypeMap[form.roomType]
  const options = knownType || !form.roomType ? roomTypes : [{ value: form.roomType }, ...roomTypes]

  const selectedType = roomTypeMap[form.roomType]

  // Handles the room-type <select> changing: auto-fills capacity from the type's
  // default, and auto-fills description too, but only if the admin hasn't manually
  // edited the description yet (so their edits are never clobbered).
  function handleTypeChange(event) {
    const value = event.target.value
    const type = roomTypeMap[value]
    setForm((f) => ({
      ...f,
      roomType: value,
      capacity: type ? String(type.capacity) : f.capacity,
      description: type && !descriptionTouched ? type.description : f.description,
    }))
    setFieldErrors((f) => ({ ...f, roomType: undefined, capacity: undefined }))
  }

  // Generic field change handler; marks description as manually touched so it won't
  // be auto-overwritten again by handleTypeChange.
  function handleChange(event) {
    const { name, value } = event.target
    if (name === 'description') setDescriptionTouched(true)
    setForm((f) => ({ ...f, [name]: value }))
    setFieldErrors((f) => ({ ...f, [name]: undefined }))
  }

  // Validates the form, then submits a normalized payload (numeric price/capacity)
  // to the parent. Surfaces server error messages on failure.
  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    const errors = validate(form)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      await onSubmit({
        roomType: form.roomType,
        description: form.description,
        pricePerNight: Number(form.pricePerNight),
        capacity: Number(form.capacity),
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-ink/70">
        Room type
        <select name="roomType" value={form.roomType} onChange={handleTypeChange} className={inputClass}>
          <option value="">Select a room type…</option>
          {options.map((type) => (
            <option key={type.value} value={type.value}>
              {type.value}
            </option>
          ))}
        </select>
        {fieldErrors.roomType && <span className="text-xs text-red-600">{fieldErrors.roomType}</span>}
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink/70">
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={2}
          placeholder="Auto-suggested from the room type — edit if needed"
          className={inputClass}
        />
      </label>

      <TextField
        label="Price per night"
        name="pricePerNight"
        type="number"
        min="0.01"
        step="0.01"
        value={form.pricePerNight}
        onChange={handleChange}
        error={fieldErrors.pricePerNight}
      />

      <TextField
        label={
          selectedType
            ? `Capacity (${selectedType.minCapacity === selectedType.maxCapacity
                ? selectedType.minCapacity
                : `${selectedType.minCapacity}–${selectedType.maxCapacity}`} guests)`
            : 'Capacity'
        }
        name="capacity"
        type="number"
        min={selectedType ? selectedType.minCapacity : 1}
        max={selectedType ? selectedType.maxCapacity : undefined}
        value={form.capacity}
        onChange={handleChange}
        error={fieldErrors.capacity}
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
