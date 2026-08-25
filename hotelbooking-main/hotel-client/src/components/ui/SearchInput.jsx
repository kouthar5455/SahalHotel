// Controlled search box (value/onChange are owned by the parent) with a search
// icon and a clear button that appears once there is text to clear.
export default function SearchInput({ value, onChange, placeholder = 'Search…', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
          <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <input
        type="search"
        value={value}
        // Forward just the raw string to the parent's onChange rather than the full event.
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-ink/10 bg-white py-2.5 pl-9 pr-9 text-sm text-ink placeholder:text-ink/40 focus:border-forest focus:outline-none"
      />
      {/* Only show the clear (x) button once there's something typed to clear */}
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70"
        >
          ✕
        </button>
      )}
    </div>
  )
}
