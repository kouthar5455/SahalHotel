// Admin dashboard summary tile showing a metric value, label, and optional icon.
// Props: label (caption text), value (the metric to display), icon (optional React node).
export default function StatCard({ label, value, icon }) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-2xl bg-white p-4 shadow-sm shadow-ink/5 transition-transform duration-300 hover:-translate-y-1">
      {/* Icon badge only rendered when an icon is provided */}
      {icon && (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint text-forest">
          {icon}
        </span>
      )}
      <span className="font-display text-2xl leading-none text-ink">{value}</span>
      <span className="text-[11px] font-semibold uppercase leading-tight tracking-wide text-ink/50">{label}</span>
    </div>
  )
}
