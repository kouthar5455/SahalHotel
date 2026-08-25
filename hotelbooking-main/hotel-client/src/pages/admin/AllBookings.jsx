import { useState } from 'react'
import StatusBadge from '../../components/ui/StatusBadge'
import SearchInput from '../../components/ui/SearchInput'
import Spinner from '../../components/ui/Spinner'
import ErrorState from '../../components/ui/ErrorState'
import IconAction from '../../components/Admin/IconAction'
import { CheckIcon, CloseIcon } from '../../components/Admin/AdminIcons'
import { useAdminBookings } from '../../hooks/useAdminBookings'
import { matchesQuery } from '../../utils/matchesQuery'
import api from '../../api/client'

// Admin page listing every booking across all users, with search and per-row confirm/reject actions for pending bookings.
export default function AllBookings() {
  const { bookings, loading, error, refresh } = useAdminBookings()
  const [query, setQuery] = useState('')
  const [actionError, setActionError] = useState('')
  // Tracks which booking row currently has a confirm/reject request in flight, so only that row's buttons disable.
  const [actingId, setActingId] = useState(null)

  // Confirms a pending booking, then re-fetches the list so the row's status updates.
  async function handleConfirm(booking) {
    setActionError('')
    setActingId(booking.id)
    try {
      await api.put(`/bookings/${booking.id}/confirm`)
      refresh()
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not confirm this booking.')
    } finally {
      setActingId(null)
    }
  }

  // Rejects a pending booking, then re-fetches the list so the row's status updates.
  async function handleReject(booking) {
    setActionError('')
    setActingId(booking.id)
    try {
      await api.put(`/bookings/${booking.id}/reject`)
      refresh()
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not reject this booking.')
    } finally {
      setActingId(null)
    }
  }

  // Client-side filtering across guest name/email, hotel, room type, and status.
  const filteredBookings = bookings.filter((booking) =>
    matchesQuery(
      [
        booking.user?.fullName,
        booking.user?.email,
        booking.hotel?.name,
        booking.room?.roomType,
        booking.status,
      ],
      query,
    ),
  )

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-xl text-ink">All Bookings</h2>

      {!loading && !error && (
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search by guest, hotel, room or status…"
          className="max-w-md"
        />
      )}

      {loading && <Spinner label="Loading bookings…" />}
      {!loading && error && <ErrorState onRetry={refresh} />}
      {actionError && <p className="text-sm text-red-600">{actionError}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-3xl bg-white shadow-sm shadow-ink/5">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Hotel</th>
                <th className="px-6 py-4">Room</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-6 py-4 text-ink">
                    <div className="flex flex-col">
                      <span className="font-medium">{booking.user?.fullName}</span>
                      <span className="text-xs text-ink/50">{booking.user?.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-ink/60">{booking.hotel?.name}</td>
                  <td className="px-6 py-4 text-ink/60">{booking.room?.roomType}</td>
                  <td className="px-6 py-4 text-ink/60">
                    {new Date(booking.checkInDate).toLocaleDateString()} →{' '}
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-ink/60">${booking.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-4">
                    {/* Confirm/Reject actions only make sense while a booking is still Pending */}
                    {booking.status === 'Pending' ? (
                      <div className="flex justify-end gap-1">
                        <IconAction
                          label="Confirm"
                          tone="success"
                          onClick={() => handleConfirm(booking)}
                          disabled={actingId === booking.id}
                        >
                          <CheckIcon />
                        </IconAction>
                        <IconAction
                          label="Reject"
                          tone="danger"
                          onClick={() => handleReject(booking)}
                          disabled={actingId === booking.id}
                        >
                          <CloseIcon />
                        </IconAction>
                      </div>
                    ) : (
                      <div className="flex justify-end text-ink/30">—</div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-ink/50">
                    {/* Distinguish "genuinely empty" from "search filtered everything out" */}
                    {bookings.length === 0 ? 'No bookings yet.' : 'No bookings match your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
