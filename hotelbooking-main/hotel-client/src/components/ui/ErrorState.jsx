import Button from './Button'

// Generic error placeholder shown when a data fetch fails. Optionally renders
// a "Try Again" button that calls `onRetry` (typically a hook's refresh function).
export default function ErrorState({
  title = 'Something went wrong',
  description = "We couldn't load this right now. Please try again.",
  onRetry,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center gap-3 rounded-3xl bg-white px-6 py-14 text-center shadow-sm shadow-ink/5 ${className}`}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl">⚠️</span>
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <p className="max-w-sm text-sm text-ink/55">{description}</p>
      {/* Retry button only shows up when a retry handler was actually provided */}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  )
}
