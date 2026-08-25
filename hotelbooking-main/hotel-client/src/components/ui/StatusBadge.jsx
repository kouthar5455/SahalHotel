// Maps a booking status to its badge color scheme; unrecognized statuses fall back below.
const styles = {
  Pending: 'bg-amber-100 text-amber-700',
  Confirmed: 'bg-mint text-forest',
  Cancelled: 'bg-red-100 text-red-600',
}

// Small pill showing a booking's status (Pending/Confirmed/Cancelled).
export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || 'bg-ink/10 text-ink/60'}`}>
      {status}
    </span>
  )
}
