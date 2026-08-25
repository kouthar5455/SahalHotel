// Small presentational card pairing a big stat number with a descriptive label.
// Used in AboutSection to show marketing metrics (e.g. "10k+ Happy guests").
export default function StatCard({ value, label }) {
  return (
    <div className="flex items-start gap-4 border-t border-ink/10 pt-4">
      <span className="font-display text-3xl text-forest">{value}</span>
      <p className="max-w-[220px] text-sm text-ink/60">{label}</p>
    </div>
  )
}
