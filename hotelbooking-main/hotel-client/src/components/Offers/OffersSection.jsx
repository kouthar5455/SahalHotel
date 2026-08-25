import SectionHeading from '../ui/SectionHeading'
import Spinner from '../ui/Spinner'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import HotelCard from '../Hotels/HotelCard'
import { useHotels } from '../../hooks/useHotels'

// Landing-page section highlighting the 3 cheapest hotels, fetched already sorted ascending by price.
export default function OffersSection() {
  const { hotels, loading, error, refresh } = useHotels({ sortBy: 'priceAsc' })
  // Top 3 cheapest results (hotels array is already price-ascending from the hook call above).
  const bestValue = hotels.slice(0, 3)

  return (
    <section className="bg-cream-2 px-6 py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <SectionHeading eyebrow="Special Offers" title="Our best-value stays right now" />

        {/* Conditional rendering covers loading, error, empty, and populated states in sequence. */}
        {loading && <Spinner label="Finding the best deals…" />}
        {!loading && error && <ErrorState onRetry={refresh} />}
        {!loading && !error && bestValue.length === 0 && (
          <EmptyState title="No offers available yet" description="Check back soon for great deals." />
        )}
        {!loading && !error && bestValue.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            {bestValue.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
