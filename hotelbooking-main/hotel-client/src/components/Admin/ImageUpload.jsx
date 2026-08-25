import { useRef, useState } from 'react'
import api from '../../api/client'
import { resolveImageUrl } from '../../utils/imageUrl'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ACCEPT_ATTR = '.jpg,.jpeg,.png,.webp'
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

// Image picker/uploader for hotel forms. Props: value (current image path/URL),
// initialValue (the originally saved image, used to avoid deleting it during cleanup),
// onChange (called with the new image URL, or '' on removal).
// Side effects: uploads files to the backend via POST and deletes orphaned session
// uploads via DELETE when replaced/removed/unmounted-without-save.
export default function ImageUpload({ value, initialValue, onChange }) {
  const inputRef = useRef(null) // ref to the hidden <input type="file"> so custom buttons can trigger it
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  // Delete a session-only upload (not the originally saved image, which the
  // backend cleans up on save/delete).
  async function cleanupSessionUpload(path) {
    if (!path || !path.startsWith('/uploads') || path === initialValue) return
    try {
      await api.delete('/hotels/image', { params: { path } })
    } catch {
      /* best-effort cleanup */
    }
  }

  // Handles the native file input's change event: validates type/size, uploads
  // the file, updates the parent form via onChange, then cleans up the previous
  // session-only upload (if any) now that it's been replaced.
  async function handleSelect(event) {
    const file = event.target.files?.[0]
    event.target.value = '' // allow re-selecting the same file later
    if (!file) return

    setError('')

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Only JPG, PNG or WEBP images are allowed.')
      return
    }
    if (file.size > MAX_SIZE) {
      setError('Image must be 5 MB or smaller.')
      return
    }

    const previous = value
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/hotels/upload-image', formData)
      onChange(res.data.imageUrl)
      await cleanupSessionUpload(previous)
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  // Clears the selected image and deletes the now-orphaned session upload (if any).
  async function handleRemove() {
    const previous = value
    onChange('')
    await cleanupSessionUpload(previous)
  }

  // Resolves the stored (possibly relative) path into a full displayable image URL
  const previewSrc = resolveImageUrl(value)

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-ink/70">Hotel image</span>

      {/* Conditional rendering: show the preview + replace/remove controls once an image
          exists, otherwise show the empty-state upload dropzone button */}
      {previewSrc ? (
        <div className="relative overflow-hidden rounded-2xl border border-ink/10">
          <img src={previewSrc} alt="Hotel preview" className="h-40 w-full object-cover" />
          <div className="absolute right-2 top-2 flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink shadow hover:bg-white"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-red-600 shadow hover:bg-white"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink/15 text-sm text-ink/50 transition-colors hover:border-forest hover:text-forest"
        >
          <span className="text-2xl">⬆️</span>
          {uploading ? 'Uploading…' : 'Click to upload an image'}
          <span className="text-xs text-ink/40">JPG, PNG or WEBP · max 5 MB</span>
        </button>
      )}

      {previewSrc && uploading && <span className="text-xs text-ink/50">Uploading…</span>}
      {error && <span className="text-xs text-red-600">{error}</span>}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        onChange={handleSelect}
        className="hidden"
      />
    </div>
  )
}
