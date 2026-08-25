// Maps a role name to its badge color scheme; unknown roles fall back to a neutral style below.
const styles = {
  Admin: 'bg-forest text-cream',
  User: 'bg-mint text-forest',
}

// Small pill showing a user's role. Falls back to a neutral style for unrecognized
// roles and an em dash when no role is provided.
export default function RoleBadge({ role }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[role] || 'bg-ink/10 text-ink/60'}`}>
      {role || '—'}
    </span>
  )
}
