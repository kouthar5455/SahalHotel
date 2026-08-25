import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import { resolveImageUrl } from '../../utils/imageUrl'

const FALLBACK_IMAGE = 'https://picsum.photos/seed/horizon-hotel/500/650'

// Card summarizing a single hotel for list/grid views. Prop: `hotel` (hotel object with rooms, images, etc.).
// Renders a clickable image with an overlay of key info plus a description, capacity/room-count chips, and booking actions.
export default function HotelCard({ hotel }) {
  // Normalize room data so the card can safely render even if the API omits rooms.
  const rooms = hotel.rooms || []
  // Calculate summary values shown on the card: starting price, capacity, and availability.
  const prices = rooms.map((room) => room.pricePerNight)
  const fromPrice = prices.length ? Math.min(...prices) : null
  const maxCapacity = rooms.length ? Math.max(...rooms.map((room) => room.capacity)) : null
  const isAvailable = rooms.length > 0
  // The booking button uses the cheapest room for a quick path into checkout.
  const cheapestRoom = rooms.length
    ? rooms.reduce((lowest, room) => (room.pricePerNight < lowest.pricePerNight ? room : lowest), rooms[0])
    : null

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm shadow-ink/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/10">
      {/* Image area links to hotel details and overlays key information. */}
      <Link to={`/hotels/${hotel.id}`} className="relative block h-56 overflow-hidden">
        <img
          src={resolveImageUrl(hotel.imageUrl, FALLBACK_IMAGE)}
          alt={hotel.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
        <span
          className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
            isAvailable ? 'bg-mint text-forest' : 'bg-white/90 text-ink/60'
          }`}
        >
          {isAvailable ? 'Available' : 'Fully Booked'}
        </span>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
          <div className="flex flex-col gap-0.5">
            <h3 className="font-display text-lg text-white">{hotel.name}</h3>
            {hotel.location && <span className="text-xs text-white/80">{hotel.location}</span>}
          </div>
          {fromPrice != null && (
            <span className="whitespace-nowrap font-display text-lg font-semibold text-white">
              ${fromPrice.toFixed(0)}
              <span className="text-xs font-normal text-white/70">/night</span>
            </span>
          )}
        </div>
      </Link>

      {/* Lower content area shows description, metadata chips, and primary actions. */}
      <div className="flex flex-col gap-3 p-5">
        <p className="line-clamp-2 text-sm text-ink/55">{hotel.description || 'No description yet.'}</p>

        <div className="flex flex-wrap gap-2">
          {maxCapacity != null && (
            <span className="rounded-full bg-cream-2 px-3 py-1 text-xs font-medium text-ink/60">
              Sleeps up to {maxCapacity}
            </span>
          )}
          <span className="rounded-full bg-cream-2 px-3 py-1 text-xs font-medium text-ink/60">
            {rooms.length} room{rooms.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Action buttons let users either book immediately or inspect the hotel first. */}
        <div className="mt-1 flex gap-2">
          <Button
            as={Link}
            to={cheapestRoom ? `/book/${cheapestRoom.id}` : `/hotels/${hotel.id}`}
            variant="primary"
            className="flex-1 justify-center"
          >
            Book Now
          </Button>
          <Button as={Link} to={`/hotels/${hotel.id}`} variant="secondary" className="flex-1 justify-center">
            View Rooms
          </Button>
        </div>
      </div>
    </article>
  )
}
