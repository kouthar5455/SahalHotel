const tones = {
  neutral: 'text-ink/60 hover:bg-ink/5 hover:text-ink',
  brand: 'text-forest hover:bg-mint/50 hover:text-forest',
  danger: 'text-red-500 hover:bg-red-50 hover:text-red-600',
  success: 'text-forest hover:bg-mint/50 hover:text-forest',
}

/**
 * Small square icon button with an accessible CSS tooltip.
 * Used for row actions (view / edit / delete / change role) in admin tables.
 */
export default function IconAction({ label, tone = 'neutral', children, className = '', ...props }) {
  return (
    // "group" wrapper lets the tooltip span react to hover state on the parent (group-hover)
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-label={label}
        className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-200 disabled:opacity-40 ${tones[tone]} ${className}`}
        {...props}
      >
        {children}
      </button>
      {/* Tooltip is always in the DOM but invisible (opacity-0); fades in on button hover via group-hover */}
      <span
        role="tooltip"
        className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-xs font-medium text-cream opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100"
      >
        {label}
      </span>
    </span>
  )
}
