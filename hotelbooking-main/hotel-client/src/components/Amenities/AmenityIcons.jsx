// Collection of small inline SVG icon components representing hotel amenities
// (used in AmenitiesSection). Each accepts an optional className override
// (defaults to a 6x6 size) and is purely presentational.
const base = 'h-6 w-6'

// WiFi signal icon — represents "Free WiFi" amenity.
export function WifiIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M2 8.5a15 15 0 0 1 20 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M5 12a10 10 0 0 1 14 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8.5 15.5a5 5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="19" r="1.2" fill="currentColor" />
    </svg>
  )
}

// Swimming pool icon — represents "Swimming Pool" amenity.
export function PoolIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M8 14V5a2 2 0 0 1 4 0M12 14V5a2 2 0 0 1 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3 17c1.5 0 1.5 1.2 3 1.2s1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

// Cutlery icon — represents "On-site Restaurant" amenity.
export function RestaurantIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 3v7M9 3v7M6 10a1.5 1.5 0 0 0 3 0M7.5 10v11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Shuttle van icon — represents "Airport Shuttle" amenity.
export function ShuttleIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 16V8a2 2 0 0 1 2-2h9l4 4v6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 16h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 6v4h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="17.5" r="1.6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16" cy="17.5" r="1.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

// Leaf/petal icon — represents "Spa & Wellness" amenity.
export function SpaIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 13c0-4 2.5-7 6-8-1 4-3 6.5-6 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 13c0-4-2.5-7-6-8 1 4 3 6.5 6 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 15c2.5 1.5 5 2.2 8 2.2s5.5-.7 8-2.2c-1.3 3-4.4 5-8 5s-6.7-2-8-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

// Concierge bell icon — represents "24/7 Front Desk" amenity.
export function ConciergeIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M5 18a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 8V6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="5" r="1.2" fill="currentColor" />
    </svg>
  )
}
