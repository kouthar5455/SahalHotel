import { useState } from 'react'
import Navbar from '../components/Navbar'
import SectionHeading from '../components/ui/SectionHeading'
import SearchInput from '../components/ui/SearchInput'
import BookingCard from '../components/Bookings/BookingCard'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { useMyBookings } from '../hooks/useMyBookings'
import { matchesQuery } from '../utils/matchesQuery'

// Page listing the current user's bookings with client-side text search across hotel name, room type and status.
export default function MyBookings() {
  const { bookings, loading, error, refresh } = useMyBookings()
  const [query, setQuery] = useState('')

  // Client-side filtering (no API call): matches the query against hotel name, room type, or booking status.
  const filteredBookings = bookings.filter((booking) =>
    matchesQuery([booking.hotel?.name, booking.room?.roomType, booking.status], query),
  )

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <section className="px-6 py-16">
        <div className="mx-auto flex max-w-3xl flex-col gap-8">
          <SectionHeading eyebrow="Your Trips" title="My Bookings" />

          {loading && <Spinner label="Loading your bookings…" />}
          {!loading && error && <ErrorState onRetry={refresh} />}
          {!loading && !error && bookings.length === 0 && (
            <EmptyState title="No bookings yet" description="Browse our hotels and book your first stay." />
          )}

          {!loading && !error && bookings.length > 0 && (
            <>
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Search by hotel, room type or status…"
              />

              {filteredBookings.length === 0 ? (
                <EmptyState
                  title="No matching bookings"
                  description="Try a different hotel name, room type or status."
                />
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredBookings.map((booking) => (
                    // onChanged triggers a re-fetch (e.g. after cancelling) so the list stays in sync with the server
                    <BookingCard key={booking.id} booking={booking} onChanged={refresh} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
