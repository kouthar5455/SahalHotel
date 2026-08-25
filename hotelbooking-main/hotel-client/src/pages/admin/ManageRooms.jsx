import { useState } from 'react'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import ErrorState from '../../components/ui/ErrorState'
import RoomForm from '../../components/Admin/RoomForm'
import SearchInput from '../../components/ui/SearchInput'
import IconAction from '../../components/Admin/IconAction'
import { EditIcon, DeleteIcon } from '../../components/Admin/AdminIcons'
import { useHotels } from '../../hooks/useHotels'
import { matchesQuery } from '../../utils/matchesQuery'
import api from '../../api/client'

// Admin page for managing rooms scoped to a single selected hotel: pick a hotel, then list/add/edit/delete its rooms.
export default function ManageRooms() {
  const { hotels, loading, error, refresh } = useHotels()
  const [selectedHotelId, setSelectedHotelId] = useState('')
  const [query, setQuery] = useState('')
  const [modalState, setModalState] = useState(null) // null | 'add' | room object
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  // String comparison handles the <select> value (always a string) matching hotel.id (likely a number).
  const selectedHotel = hotels.find((hotel) => String(hotel.id) === String(selectedHotelId))
  const rooms = selectedHotel?.rooms || []
  // Client-side filtering across room type, description, and capacity (scoped to the selected hotel's rooms).
  const filteredRooms = rooms.filter((room) =>
    matchesQuery([room.roomType, room.description, String(room.capacity)], query),
  )

  // Shared save handler for both create and edit modals; always tags the payload with the currently selected hotel.
  async function handleSave(form) {
    const payload = { ...form, hotelId: Number(selectedHotelId) }
    if (modalState === 'add') {
      await api.post('/rooms', payload)
    } else {
      await api.put(`/rooms/${modalState.id}`, payload)
    }
    setModalState(null)
    refresh()
  }

  // Deletes the room currently staged in `deleteTarget` and refreshes the hotel/room list.
  async function handleDelete() {
    if (!deleteTarget) return

    setDeleteError('')
    setDeleting(true)
    try {
      await api.delete(`/rooms/${deleteTarget.id}`)
      setDeleteTarget(null)
      refresh()
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Could not delete this room.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl text-ink">Manage Rooms</h2>

        <div className="flex items-center gap-3">
          <select
            value={selectedHotelId}
            onChange={(event) => setSelectedHotelId(event.target.value)}
            className="rounded-xl border border-ink/10 px-4 py-2.5 text-sm focus:border-forest focus:outline-none"
          >
            <option value="">Select a hotel…</option>
            {hotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </select>
          {/* Disabled until a hotel is selected, since a new room must belong to a hotel */}
          <Button variant="primary" onClick={() => setModalState('add')} disabled={!selectedHotelId}>
            Add Room
          </Button>
        </div>
      </div>

      {loading && <Spinner label="Loading hotels…" />}
      {!loading && error && <ErrorState onRetry={refresh} />}
      {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}

      {/* Prompt shown until the admin picks a hotel; the rooms table only renders once one is selected */}
      {!loading && !error && !selectedHotelId && (
        <p className="text-sm text-ink/50">Select a hotel to manage its rooms.</p>
      )}

      {!loading && !error && selectedHotelId && (
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search rooms by type…"
          className="max-w-md"
        />
      )}

      {!loading && !error && selectedHotelId && (
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm shadow-ink/5">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Price / night</th>
                <th className="px-6 py-4">Capacity</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room) => (
                <tr key={room.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-6 py-4 font-medium text-ink">{room.roomType}</td>
                  <td className="px-6 py-4 text-ink/60">${room.pricePerNight.toFixed(2)}</td>
                  <td className="px-6 py-4 text-ink/60">{room.capacity}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <IconAction label="Edit" tone="brand" onClick={() => setModalState(room)}>
                        <EditIcon />
                      </IconAction>
                      <IconAction
                        label="Delete"
                        tone="danger"
                        onClick={() => {
                          setDeleteError('')
                          setDeleteTarget(room)
                        }}
                      >
                        <DeleteIcon />
                      </IconAction>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRooms.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-ink/50">
                    {rooms.length === 0 ? 'No rooms for this hotel yet.' : 'No rooms match your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit modal: shared between both flows, distinguished by whether modalState is 'add' or a room object */}
      <Modal
        open={modalState !== null}
        onClose={() => setModalState(null)}
        title={modalState === 'add' ? 'Add Room' : 'Edit Room'}
      >
        <RoomForm
          initialValues={modalState && modalState !== 'add' ? modalState : undefined}
          onSubmit={handleSave}
          onCancel={() => setModalState(null)}
        />
      </Modal>

      {/* Delete confirmation modal; onClose is disabled while a delete request is in flight to avoid closing mid-request */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Delete room"
      >
        {deleteTarget && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-ink/65">
              Delete this <span className="font-semibold text-ink">{deleteTarget.roomType}</span> room? This action
              cannot be undone.
            </p>
            {deleteError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{deleteError}</p>}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                Cancel
              </Button>
              <Button type="button" variant="primary" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
