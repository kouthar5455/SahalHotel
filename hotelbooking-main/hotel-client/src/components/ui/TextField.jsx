import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from './Icons'

// Labeled text input with built-in error display and a show/hide toggle for
// password fields. `tone="glass"` restyles it for use over dark/photo backgrounds
// (e.g. hero sections); any other props are spread onto the underlying <input>.
export default function TextField({ label, name, type = 'text', error, className = '', tone = 'default', ...props }) {
  // Tracks whether a password field currently reveals plain text.
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'
  // Swap the actual input type to 'text' only while the user has toggled visibility on.
  const inputType = isPassword && visible ? 'text' : type
  const isGlass = tone === 'glass'
  // Style variants keyed off `tone`, used for the frosted-glass look on dark backgrounds.
  const labelClass = isGlass ? 'text-white/90' : 'text-ink/70'
  const inputClass = isGlass
    ? 'border-white/20 bg-white/95 text-ink placeholder:text-ink/35 focus:border-white'
    : 'border-ink/10 focus:border-forest'
  const spacingClass = isGlass ? 'gap-0.5' : 'gap-1'
  const paddingClass = isGlass ? 'px-4 py-2' : 'px-4 py-2.5'

  return (
    <label className={`flex flex-col ${spacingClass} text-sm ${labelClass} ${className}`}>
      {label}
      <span className="relative flex items-center">
        <input
          name={name}
          type={inputType}
          className={`w-full rounded-xl border ${paddingClass} text-sm focus:outline-none ${
            isPassword ? 'pr-11' : ''
          } ${error ? 'border-red-400' : inputClass}`}
          {...props}
        />
        {/* Eye toggle only rendered for password fields; tabIndex={-1} keeps it out of tab order */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 flex h-5 w-5 items-center justify-center text-ink/40 hover:text-ink"
            aria-label={visible ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {visible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          </button>
        )}
      </span>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  )
}
