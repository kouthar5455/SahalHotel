import { featureIcons } from '../ui/featureIcons'

// Displays a single feature/benefit tile with an icon, title, and description.
// Props: `icon` (key into featureIcons map), `title`, `description`, `elevated` (raises/highlights the card with a shadow when true).
export default function FeatureCard({ icon, title, description, elevated = false }) {
  // Resolve the icon component from the named key so callers can pass a string identifier.
  const Icon = featureIcons[icon]

  return (
    <div
      className={`flex flex-col items-center gap-4 rounded-full px-8 py-10 text-center transition-transform duration-200 ${
        elevated
          ? 'z-10 rounded-[2.5rem] bg-white shadow-xl shadow-ink/10 sm:-translate-y-6'
          : 'bg-white/60'
      }`}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mint text-forest">
        <Icon />
      </span>
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <p className="text-sm text-ink/55">{description}</p>
    </div>
  )
}
