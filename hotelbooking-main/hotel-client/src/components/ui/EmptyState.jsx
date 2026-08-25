// Generic placeholder shown when a list/collection has no data to display.
// Purely presentational; `description` is optional.
export default function EmptyState({ title = 'Nothing here yet', description, className = '' }) {
  return (
    <div className={`flex flex-col items-center gap-2 rounded-3xl bg-white px-6 py-14 text-center shadow-sm shadow-ink/5 ${className}`}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-2 text-xl">🔍</span>
      <h3 className="font-display text-lg text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink/55">{description}</p>}
    </div>
  )
}
