import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import ErrorState from '../components/ui/ErrorState'
import PaymentMethodSelect from '../components/Bookings/PaymentMethodSelect'
import { useRoom } from '../hooks/useRoom'
import api from '../api/client'

// Returns today's date as a YYYY-MM-DD string, used as the `min` bound for the check-in date input.
function todayIso() {
  return new Date().toISOString().split('T')[0]
}

// Page for booking a specific room: loads the room by id from the route, collects dates/payment method, and submits the booking.
export default function BookRoom() {
  const { roomId } = useParams()
  const { room, loading, error, refresh } = useRoom(roomId)

  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState(null)

  // Derived value: number of nights between the two dates (0 if either is unset or the range is invalid).
  const nights =
    checkInDate && checkOutDate
      ? Math.round((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))
      : 0
  // Derived value: total price for the stay, only computed once a room is loaded and the date range is valid.
  const totalPrice = room && nights > 0 ? (nights * room.pricePerNight).toFixed(2) : null

  // Validates the form, then submits the booking to the API and stores the confirmation to switch the UI to the success view.
  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')

    if (!checkInDate || !checkOutDate) {
      setSubmitError('Please select both check-in and check-out dates.')
      return
    }
    if (nights <= 0) {
      setSubmitError('Check-out date must be after check-in date.')
      return
    }
    if (!paymentMethod) {
      setSubmitError('Please select a payment method.')
      return
    }

    setSubmitting(true)
    try {
      const res = await api.post('/bookings', {
        roomId: Number(roomId),
        checkInDate,
        checkOutDate,
        paymentMethod,
      })
      setConfirmation(res.data)
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <section className="px-6 py-16">
        <div className="mx-auto flex max-w-xl flex-col gap-8">
          {loading && <Spinner label="Loading room…" />}
          {!loading && error && <ErrorState onRetry={refresh} />}

          {/* Booking form: shown only once the room has loaded successfully and no confirmation exists yet */}
          {!loading && !error && room && !confirmation && (
            <div className="flex flex-col gap-8 rounded-3xl bg-white p-8 shadow-sm shadow-ink/5">
              <div className="flex flex-col gap-1">
                {room.hotel?.name && (
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">
                    {room.hotel.name}
                  </span>
                )}
                <h1 className="font-display text-2xl text-ink">{room.roomType}</h1>
                <span className="text-sm text-ink/55">
                  Sleeps {room.capacity} · ${room.pricePerNight.toFixed(2)} / night
                </span>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1 text-sm text-ink/70">
                    Check-in
                    <input
                      type="date"
                      required
                      min={todayIso()}
                      value={checkInDate}
                      onChange={(event) => setCheckInDate(event.target.value)}
                      className="rounded-xl border border-ink/10 px-4 py-2.5 text-sm focus:border-forest focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-ink/70">
                    Check-out
                    <input
                      type="date"
                      required
                      min={checkInDate || todayIso()}
                      value={checkOutDate}
                      onChange={(event) => setCheckOutDate(event.target.value)}
                      className="rounded-xl border border-ink/10 px-4 py-2.5 text-sm focus:border-forest focus:outline-none"
                    />
                  </label>
                </div>

                {/* Live price summary, only rendered once both dates yield a valid night count */}
                {totalPrice && (
                  <div className="flex items-center justify-between rounded-xl bg-cream-2 px-4 py-3 text-sm">
                    <span className="text-ink/60">
                      {nights} night{nights > 1 ? 's' : ''} × ${room.pricePerNight.toFixed(2)}
                    </span>
                    <span className="font-semibold text-ink">${totalPrice}</span>
                  </div>
                )}

                <PaymentMethodSelect value={paymentMethod} onChange={setPaymentMethod} />

                {submitError && <p className="text-sm text-red-600">{submitError}</p>}

                <Button type="submit" variant="primary" className="w-full justify-center" disabled={submitting}>
                  {submitting ? 'Booking…' : 'Confirm Booking'}
                </Button>
              </form>
            </div>
          )}

          {/* Success view: replaces the form once the booking API call has returned a confirmation */}
          {confirmation && (
            <div className="flex flex-col items-start gap-4 rounded-3xl bg-white p-8 shadow-sm shadow-ink/5">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mint text-forest">✓</span>
              <h1 className="font-display text-2xl text-ink">Booking confirmed</h1>
              <p className="text-sm text-ink/60">
                {confirmation.message}. Your booking ID is <strong>#{confirmation.bookingId}</strong>. It's currently
                pending confirmation from our team.
              </p>
              <div className="flex gap-3">
                <Button as={Link} to="/my-bookings" variant="primary">
                  View My Bookings
                </Button>
                <Button as={Link} to="/hotels" variant="secondary">
                  Browse More Hotels
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
