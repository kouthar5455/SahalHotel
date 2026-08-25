// Simple loading indicator: a CSS-animated spinning ring plus a text label.
export default function Spinner({ label = 'Loading…', className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-10 text-sm text-ink/50 ${className}`}>
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink/15 border-t-forest" />
      {label}
    </div>
  )
}
