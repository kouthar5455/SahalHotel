import { useState } from 'react'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import StatusBadge from '../ui/StatusBadge'
import api from '../../api/client'

// Formats an ISO date string into a short human-readable date.
function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

// Card summarizing a single booking on the "My Bookings" page, with a modal
// showing full details. Props: booking (the booking object), onChanged (optional
// callback fired after a successful cancel, so the parent can refresh its list).
export default function BookingCard({ booking, onChanged }) {
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  // Cancel action is only available while the booking hasn't already been cancelled/completed
  const canCancel = booking.status === 'Pending' || booking.status === 'Confirmed'

  // Cancels the booking via the API, closes the details modal on success, and
  // notifies the parent (via onChanged) so it can refetch/update the booking list.
  async function handleCancel() {
    setCancelling(true)
    setError('')
    try {
      await api.put(`/bookings/${booking.id}/cancel`)
      setShowDetails(false)
      onChanged?.()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not cancel this booking.')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm shadow-ink/5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          {booking.hotel?.name && (
            <span className="text-xs font-semibold uppercase tracking-wide text-forest">{booking.hotel.name}</span>
          )}
          <h3 className="font-display text-lg text-ink">{booking.room?.roomType}</h3>
          <span className="text-sm text-ink/55">
            {formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)}
          </span>
          <span className="text-sm font-semibold text-ink">${booking.totalPrice.toFixed(2)} total</span>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <StatusBadge status={booking.status} />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowDetails(true)}>
              View
            </Button>
            {/* Cancel button only shown for bookings that are still cancellable */}
            {canCancel && (
              <Button variant="secondary" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? 'Cancelling…' : 'Cancel'}
              </Button>
            )}
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>

      <Modal open={showDetails} onClose={() => setShowDetails(false)} title="Booking details">
        <div className="flex flex-col gap-3 text-sm">
          {/* Render each detail row from a label/value tuple array to keep markup compact */}
          {[
            ['Booking ID', `#${booking.id}`],
            ['Hotel', booking.hotel?.name || '—'],
            ['Room type', booking.room?.roomType || '—'],
            ['Check-in', formatDate(booking.checkInDate)],
            ['Check-out', formatDate(booking.checkOutDate)],
            ['Payment method', booking.paymentMethod || '—'],
            ['Booked on', booking.createdAt ? formatDate(booking.createdAt) : '—'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 border-b border-ink/5 pb-2">
              <dt className="text-ink/50">{label}</dt>
              <dd className="text-right font-medium text-ink">{value}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 border-b border-ink/5 pb-2">
            <dt className="text-ink/50">Status</dt>
            <dd><StatusBadge status={booking.status} /></dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-ink/50">Total</dt>
            <dd className="font-semibold text-ink">${booking.totalPrice.toFixed(2)}</dd>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="mt-2 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowDetails(false)}>
              Close
            </Button>
            {canCancel && (
              <Button variant="primary" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? 'Cancelling…' : 'Cancel booking'}
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </>
  )
}
