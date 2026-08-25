import { useState } from 'react'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import ErrorState from '../../components/ui/ErrorState'
import HotelForm from '../../components/Admin/HotelForm'
import SearchInput from '../../components/ui/SearchInput'
import IconAction from '../../components/Admin/IconAction'
import { EditIcon, DeleteIcon } from '../../components/Admin/AdminIcons'
import { useHotels } from '../../hooks/useHotels'
import { matchesQuery } from '../../utils/matchesQuery'
import api from '../../api/client'

// Admin page for listing, creating, editing and deleting hotels, with client-side search.
export default function ManageHotels() {
  const { hotels, loading, error, refresh } = useHotels()
  const [query, setQuery] = useState('')
  const [modalState, setModalState] = useState(null) // null | 'add' | hotel object
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  // Shared save handler for both create and edit modals: branches on whether modalState is the 'add' sentinel
  // or an actual hotel object (edit), then re-fetches and closes the modal.
  async function handleSave(form) {
    if (modalState === 'add') {
      await api.post('/hotels', form)
    } else {
      await api.put(`/hotels/${modalState.id}`, form)
    }
    setModalState(null)
    refresh()
  }

  // Deletes the hotel currently staged in `deleteTarget` (set via the row's Delete action) and refreshes the list.
  async function handleDelete() {
    if (!deleteTarget) return

    setDeleteError('')
    setDeleting(true)
    try {
      await api.delete(`/hotels/${deleteTarget.id}`)
      setDeleteTarget(null)
      refresh()
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Could not delete this hotel.')
    } finally {
      setDeleting(false)
    }
  }

  // Client-side filtering across name, location, and description.
  const filteredHotels = hotels.filter((hotel) =>
    matchesQuery([hotel.name, hotel.location, hotel.description], query),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">Manage Hotels</h2>
        <Button variant="primary" onClick={() => setModalState('add')}>
          Add Hotel
        </Button>
      </div>

      {!loading && !error && (
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search by name or location…"
          className="max-w-md"
        />
      )}

      {loading && <Spinner label="Loading hotels…" />}
      {!loading && error && <ErrorState onRetry={refresh} />}
      {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}

      {!loading && !error && (
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm shadow-ink/5">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Rooms</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHotels.map((hotel) => (
                <tr key={hotel.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-6 py-4 font-medium text-ink">{hotel.name}</td>
                  <td className="px-6 py-4 text-ink/60">{hotel.location}</td>
                  <td className="px-6 py-4 text-ink/60">{hotel.rooms?.length || 0}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <IconAction label="Edit" tone="brand" onClick={() => setModalState(hotel)}>
                        <EditIcon />
                      </IconAction>
                      <IconAction
                        label="Delete"
                        tone="danger"
                        onClick={() => {
                          setDeleteError('')
                          setDeleteTarget(hotel)
                        }}
                      >
                        <DeleteIcon />
                      </IconAction>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredHotels.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-ink/50">
                    {hotels.length === 0 ? 'No hotels yet.' : 'No hotels match your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit modal: shared between both flows, distinguished by whether modalState is 'add' or a hotel object */}
      <Modal
        open={modalState !== null}
        onClose={() => setModalState(null)}
        title={modalState === 'add' ? 'Add Hotel' : 'Edit Hotel'}
      >
        <HotelForm
          initialValues={modalState && modalState !== 'add' ? modalState : undefined}
          onSubmit={handleSave}
          onCancel={() => setModalState(null)}
        />
      </Modal>

      {/* Delete confirmation modal; onClose is disabled while a delete request is in flight to avoid closing mid-request */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Delete hotel"
      >
        {deleteTarget && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-ink/65">
              Delete <span className="font-semibold text-ink">{deleteTarget.name}</span>? This action cannot be undone.
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
