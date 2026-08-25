// Brand mark + wordmark for Sahal Stay. `textClassName` adapts the wordmark
// colour to light or dark backgrounds; pass showText={false} for the mark alone.
export default function Logo({ showText = true, textClassName = 'text-ink', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-mint to-mint-dark shadow-sm shadow-forest/20">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-forest" aria-hidden="true">
          <path
            d="M16.4 7.4c-1-1.5-2.9-2.1-4.5-1.5-1.9.6-2.6 2.6-1.4 3.9.9.9 2.3 1 3.5 1.2 1.3.2 2.6.4 3.5 1.2 1.2 1.3.5 3.3-1.4 3.9-1.6.6-3.5 0-4.5-1.5"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {/* Wordmark is optional so the logo can be used as an icon-only mark (e.g. favicon-style spots) */}
      {showText && (
        <span className={`font-display text-lg font-semibold ${textClassName}`}>Sahal Stay</span>
      )}
    </span>
  )
}
