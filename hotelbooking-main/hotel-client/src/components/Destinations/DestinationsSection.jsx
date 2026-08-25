import { Link } from 'react-router-dom'
import SectionHeading from '../ui/SectionHeading'
import Spinner from '../ui/Spinner'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import { useHotels } from '../../hooks/useHotels'
import { resolveImageUrl } from '../../utils/imageUrl'

const FALLBACK_IMAGE = 'https://picsum.photos/seed/horizon-destination/500/380'

// Aggregates a flat hotel list into per-location summaries (count of hotels + a representative image),
// sorted by descending hotel count so the most popular destinations come first.
function groupByLocation(hotels) {
  const map = new Map()

  hotels.forEach((hotel) => {
    const key = hotel.location?.trim()
    if (!key) return
    if (!map.has(key)) map.set(key, { location: key, count: 0, image: hotel.imageUrl })
    const entry = map.get(key)
    entry.count += 1
    // Backfill the image if the first-seen hotel for this location had none.
    if (!entry.image && hotel.imageUrl) entry.image = hotel.imageUrl
  })

  return Array.from(map.values()).sort((a, b) => b.count - a.count)
}

// Landing-page section that fetches hotels, groups them by location, and shows the top 4 destinations as clickable cards.
export default function DestinationsSection() {
  const { hotels, loading, error, refresh } = useHotels()
  // Only display the 4 most popular destinations.
  const destinations = groupByLocation(hotels).slice(0, 4)

  return (
    <section className="px-6 py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <SectionHeading eyebrow="Popular Destinations" title="Where our guests are staying" />

        {/* Conditional rendering covers loading, error, empty, and populated states in sequence. */}
        {loading && <Spinner label="Loading destinations…" />}
        {!loading && error && <ErrorState onRetry={refresh} />}
        {!loading && !error && destinations.length === 0 && (
          <EmptyState title="No destinations yet" description="Hotels will appear here once they're added." />
        )}

        {!loading && !error && destinations.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((destination) => (
              <Link
                key={destination.location}
                // Clicking a destination navigates to the hotel list pre-filtered by that location's search term.
                to={`/hotels?search=${encodeURIComponent(destination.location)}`}
                className="group relative block h-64 overflow-hidden rounded-3xl shadow-sm shadow-ink/5 transition-transform duration-300 hover:-translate-y-1"
              >
                <img
                  src={resolveImageUrl(destination.image, FALLBACK_IMAGE)}
                  alt={destination.location}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-display text-lg text-white">{destination.location}</h3>
                  <span className="text-xs text-white/75">
                    {destination.count} hotel{destination.count === 1 ? '' : 's'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
