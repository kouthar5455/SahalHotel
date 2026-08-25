import { useState } from 'react'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import ErrorState from '../../components/ui/ErrorState'
import RoleBadge from '../../components/ui/RoleBadge'
import SearchInput from '../../components/ui/SearchInput'
import IconAction from '../../components/Admin/IconAction'
import UserForm from '../../components/Admin/UserForm'
import { ViewIcon, EditIcon, DeleteIcon, RoleIcon } from '../../components/Admin/AdminIcons'
import { useUsers } from '../../hooks/useUsers'
import { useAuth } from '../../context/useAuth'
import { matchesQuery } from '../../utils/matchesQuery'
import api from '../../api/client'

// Formats an ISO date string as e.g. "Jan 5, 2026"; returns an em dash placeholder when no value is present.
function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

// Admin page for listing all users with search, viewing details, editing, changing role, creating and deleting accounts.
export default function ManageUsers() {
  const { users, loading, error, refresh } = useUsers()
  const { user: currentUser } = useAuth()
  const [query, setQuery] = useState('')
  const [viewUser, setViewUser] = useState(null)
  const [editUser, setEditUser] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [roleTarget, setRoleTarget] = useState(null)
  const [changingRole, setChangingRole] = useState(false)
  const [actionError, setActionError] = useState('')

  // Saves edits to the currently selected user, then refreshes the list.
  async function handleSave(form) {
    await api.put(`/users/${editUser.id}`, form)
    setEditUser(null)
    refresh()
  }

  // Creates a new user account from the "Add user" form, then refreshes the list.
  async function handleCreate(form) {
    await api.post('/users', form)
    setAddOpen(false)
    refresh()
  }

  // Toggles the role of the user staged in `roleTarget` between Admin and User, then refreshes the list.
  async function confirmChangeRole() {
    if (!roleTarget) return

    const nextRole = roleTarget.role === 'Admin' ? 'User' : 'Admin'
    setActionError('')
    setChangingRole(true)
    try {
      await api.put(`/users/${roleTarget.id}/role`, { role: nextRole })
      setRoleTarget(null)
      refresh()
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not change this user’s role.')
    } finally {
      setChangingRole(false)
    }
  }

  // Deletes the user staged in `deleteTarget`, then refreshes the list.
  async function handleDelete() {
    if (!deleteTarget) return

    setActionError('')
    setDeleting(true)
    try {
      await api.delete(`/users/${deleteTarget.id}`)
      setDeleteTarget(null)
      refresh()
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not delete this user.')
    } finally {
      setDeleting(false)
    }
  }

  // Client-side filtering across name, email, phone, and role.
  const filteredUsers = users.filter((u) =>
    matchesQuery([u.fullName, u.email, u.phoneNumber, u.role], query),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-xl text-ink">Manage Users</h2>
          <p className="text-sm text-ink/55">View and manage all registered accounts.</p>
        </div>
        <Button variant="primary" onClick={() => setAddOpen(true)}>
          Add User
        </Button>
      </div>

      {!loading && !error && (
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search by name, email, phone or role…"
          className="max-w-md"
        />
      )}

      {loading && <Spinner label="Loading users…" />}
      {!loading && error && <ErrorState onRetry={refresh} />}
      {actionError && <p className="text-sm text-red-600">{actionError}</p>}

      {!loading && !error && (
        <div className="rounded-3xl bg-white shadow-sm shadow-ink/5">
          <table className="w-full table-auto text-left text-sm">
            <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="hidden px-4 py-3 md:table-cell">Email</th>
                <th className="hidden px-4 py-3 xl:table-cell">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="hidden px-4 py-3 lg:table-cell">Registered</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                // Route guard for row actions: an admin cannot change their own role or delete their own account
                // (prevents accidental self-lockout), so those actions are disabled for the logged-in user's own row.
                const isSelf = currentUser?.id === u.id
                return (
                  <tr key={u.id} className="border-b border-ink/5 last:border-0">
                    <td className="px-4 py-3 font-medium text-ink">
                      <div className="flex flex-col">
                        <span>{u.fullName || '—'}</span>
                        <span className="text-xs font-normal text-ink/45 md:hidden">{u.email}</span>
                      </div>
                    </td>
                    <td className="hidden max-w-[220px] truncate px-4 py-3 text-ink/60 md:table-cell">{u.email}</td>
                    <td className="hidden px-4 py-3 text-ink/60 xl:table-cell">{u.phoneNumber || '—'}</td>
                    <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                    <td className="hidden px-4 py-3 text-ink/60 lg:table-cell">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <IconAction label="View" tone="neutral" onClick={() => setViewUser(u)}>
                          <ViewIcon />
                        </IconAction>
                        <IconAction label="Edit" tone="brand" onClick={() => setEditUser(u)}>
                          <EditIcon />
                        </IconAction>
                        <IconAction
                          label={isSelf ? 'You cannot change your own role' : 'Change role'}
                          tone="brand"
                          onClick={() => {
                            setActionError('')
                            setRoleTarget(u)
                          }}
                          disabled={isSelf}
                        >
                          <RoleIcon />
                        </IconAction>
                        <IconAction
                          label={isSelf ? 'You cannot delete yourself' : 'Delete'}
                          tone="danger"
                          onClick={() => {
                            setActionError('')
                            setDeleteTarget(u)
                          }}
                          disabled={isSelf}
                        >
                          <DeleteIcon />
                        </IconAction>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-ink/50">
                    {users.length === 0 ? 'No users yet.' : 'No users match your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View details */}
      <Modal open={viewUser !== null} onClose={() => setViewUser(null)} title="User details">
        {viewUser && (
          <dl className="flex flex-col gap-3 text-sm">
            {/* Rendered as an array of [label, value] pairs so the row markup only needs to be written once */}
            {[
              ['Name', viewUser.fullName || '—'],
              ['Email', viewUser.email],
              ['Phone', viewUser.phoneNumber || '—'],
              ['Registered', formatDate(viewUser.createdAt)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-b border-ink/5 pb-2">
                <dt className="text-ink/50">{label}</dt>
                <dd className="text-right font-medium text-ink">{value}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4">
              <dt className="text-ink/50">Role</dt>
              <dd><RoleBadge role={viewUser.role} /></dd>
            </div>
          </dl>
        )}
      </Modal>

      {/* Edit */}
      <Modal open={editUser !== null} onClose={() => setEditUser(null)} title="Edit user">
        {editUser && (
          <UserForm mode="edit" initialValues={editUser} onSubmit={handleSave} onCancel={() => setEditUser(null)} />
        )}
      </Modal>

      {/* Add */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add user">
        {addOpen && (
          <UserForm mode="create" onSubmit={handleCreate} onCancel={() => setAddOpen(false)} />
        )}
      </Modal>

      {/* Change role; onClose is disabled while the role change request is in flight */}
      <Modal
        open={roleTarget !== null}
        onClose={() => !changingRole && setRoleTarget(null)}
        title="Change user role"
      >
        {roleTarget && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-ink/65">
              Change{' '}
              <span className="font-semibold text-ink">{roleTarget.fullName || roleTarget.email}</span>{' '}
              from{' '}
              <RoleBadge role={roleTarget.role} /> to{' '}
              <RoleBadge role={roleTarget.role === 'Admin' ? 'User' : 'Admin'} />?
            </p>
            <p className="text-sm text-ink/55">
              {roleTarget.role === 'Admin'
                ? 'They will lose access to the admin panel and management features.'
                : 'They will gain full access to the admin panel, including managing hotels, rooms, bookings and users.'}
            </p>
            {actionError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{actionError}</p>}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setRoleTarget(null)} disabled={changingRole}>
                Cancel
              </Button>
              <Button type="button" variant="primary" onClick={confirmChangeRole} disabled={changingRole}>
                {changingRole ? 'Updating...' : 'Change role'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation; onClose is disabled while the delete request is in flight */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Delete user"
      >
        {deleteTarget && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-ink/65">
              Delete <span className="font-semibold text-ink">{deleteTarget.fullName || deleteTarget.email}</span>?
              This action cannot be undone.
            </p>
            {actionError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{actionError}</p>}
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
