// Static list of selectable payment methods rendered as option cards below.
const methods = [
  {
    value: 'EVC',
    label: 'EVC Plus',
    hint: 'Mobile money',
  },
  {
    value: 'VISA',
    label: 'VISA Card',
    hint: 'Credit / debit card',
  },
]

// Renders the EVC Plus (mobile money) icon as inline SVG.
function EvcIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 5.5h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
    </svg>
  )
}

// Renders the VISA card icon as inline SVG.
function VisaIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.5 9.5h19" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

// Maps a method's value to its corresponding icon component for lookup below.
const icons = { EVC: EvcIcon, VISA: VisaIcon }

// Controlled selectable-card group for choosing a payment method.
// Props: `value` (currently selected method value), `onChange` (called with the new value on selection).
export default function PaymentMethodSelect({ value, onChange }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-sm text-ink/70">Payment method</legend>
      <div className="grid grid-cols-2 gap-3">
        {methods.map((method) => {
          const Icon = icons[method.value]
          // Highlights the card that matches the currently selected value.
          const selected = value === method.value
          return (
            <button
              key={method.value}
              type="button"
              onClick={() => onChange(method.value)}
              aria-pressed={selected}
              className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors duration-200 ${
                selected
                  ? 'border-forest bg-mint/40 text-ink'
                  : 'border-ink/10 text-ink/70 hover:border-forest/40'
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  selected ? 'bg-forest text-cream' : 'bg-cream-2 text-forest'
                }`}
              >
                <Icon />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-medium">{method.label}</span>
                <span className="text-xs text-ink/50">{method.hint}</span>
              </span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
