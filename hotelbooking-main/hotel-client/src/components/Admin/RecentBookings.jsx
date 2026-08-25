import { Link } from 'react-router-dom'
import StatusBadge from '../ui/StatusBadge'

// Formats an ISO date string into a short human-readable date, or an em-dash if missing.
function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

// Admin dashboard widget listing the most recent bookings in a table.
// Props: bookings (full list of bookings — this component sorts/slices it locally).
export default function RecentBookings({ bookings }) {
  // Copy the array before sorting (avoid mutating the prop) then take the 6 newest by createdAt
  const recent = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-ink">Recent Bookings</h2>
        <Link to="/admin/bookings" className="text-sm font-medium text-forest hover:underline">
          View all
        </Link>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-white shadow-sm shadow-ink/5">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-6 py-4">Guest</th>
              <th className="px-6 py-4">Hotel</th>
              <th className="px-6 py-4">Room Type</th>
              <th className="px-6 py-4">Booking Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((booking) => (
              <tr key={booking.id} className="border-b border-ink/5 last:border-0">
                <td className="px-6 py-4 font-medium text-ink">{booking.user?.fullName || '—'}</td>
                <td className="px-6 py-4 text-ink/60">{booking.hotel?.name || '—'}</td>
                <td className="px-6 py-4 text-ink/60">{booking.room?.roomType || '—'}</td>
                <td className="px-6 py-4 text-ink/60">{formatDate(booking.createdAt)}</td>
                <td className="px-6 py-4"><StatusBadge status={booking.status} /></td>
                <td className="px-6 py-4 text-right text-ink/60">${booking.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
            {/* Empty-state row shown when there are no bookings at all */}
            {recent.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-ink/50">
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
