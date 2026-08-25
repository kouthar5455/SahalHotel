import SectionHeading from '../ui/SectionHeading'
import Spinner from '../ui/Spinner'
import ErrorState from '../ui/ErrorState'
import { useStats } from '../../hooks/useStats'

// Maps each stats field returned by the API to the display label shown under it
const labels = [
  { key: 'totalHotels', label: 'Hotels' },
  { key: 'totalRooms', label: 'Rooms' },
  { key: 'totalBookings', label: 'Bookings' },
  { key: 'totalCustomers', label: 'Happy Guests' },
]

// Fetches site-wide stats (via useStats) and displays them in a grid, with
// loading/error/empty states handled before the numbers are shown.
export default function StatsSection() {
  const { stats, loading, error, refresh } = useStats()

  return (
    <section className="bg-forest px-6 py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <SectionHeading
          eyebrow="By The Numbers"
          title="Trusted by travelers everywhere"
          tone="light"
          align="center"
          className="mx-auto items-center text-center"
        />

        {/* Mutually exclusive render branches driven by the fetch state from useStats */}
        {loading && <Spinner label="Loading statistics…" className="text-cream/60" />}
        {!loading && error && <ErrorState onRetry={refresh} />}

        {!loading && !error && stats && (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {/* Look up each stat's value from the fetched `stats` object by its key */}
            {labels.map(({ key, label }) => (
              <div key={key} className="flex flex-col items-center gap-1 text-center">
                <span className="font-display text-4xl text-cream">{stats[key]}</span>
                <span className="text-sm text-cream/60">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
