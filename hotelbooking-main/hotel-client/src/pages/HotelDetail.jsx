import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer/Footer'
import RoomCard from '../components/Rooms/RoomCard'
import Spinner from '../components/ui/Spinner'
import ErrorState from '../components/ui/ErrorState'
import EmptyState from '../components/ui/EmptyState'
import { useHotel } from '../hooks/useHotel'
import { resolveImageUrl } from '../utils/imageUrl'

const FALLBACK_IMAGE = 'https://picsum.photos/seed/horizon-hotel-detail/900/420'

// Page showing a single hotel's details plus its list of bookable rooms; hotel id comes from the route params.
export default function HotelDetail() {
  const { id } = useParams()
  const { hotel, loading, error, refresh } = useHotel(id)

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <section className="px-6 py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          {loading && <Spinner label="Loading hotel…" />}
          {!loading && error && <ErrorState onRetry={refresh} />}

          {/* Main content: only rendered once loading finished without error and hotel data is present */}
          {!loading && !error && hotel && (
            <>
              <img
                src={resolveImageUrl(hotel.imageUrl, FALLBACK_IMAGE)}
                alt={hotel.name}
                className="h-72 w-full rounded-[2rem] object-cover"
              />

              <div className="flex flex-col gap-2">
                {hotel.location && (
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">
                    {hotel.location}
                  </span>
                )}
                <h1 className="font-display text-3xl text-ink sm:text-4xl">{hotel.name}</h1>
                <p className="max-w-2xl text-sm text-ink/60">{hotel.description || 'No description yet.'}</p>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="font-display text-xl text-ink">Available rooms</h2>
                {/* Guard against hotel.rooms being undefined; show empty state when there are no rooms */}
                {(hotel.rooms || []).length === 0 && (
                  <EmptyState title="No rooms listed yet" description="Check back soon for available rooms." />
                )}
                <div className="flex flex-col gap-4">
                  {(hotel.rooms || []).map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
