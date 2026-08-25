// Renders a single numbered step row (step number, title, description) used inside ProcessSection.
export default function ProcessStep({ number, title, description }) {
  return (
    <div className="flex flex-col gap-3 border-t border-ink/10 py-6 sm:flex-row sm:items-start sm:gap-8">
      <span className="font-display text-4xl text-forest/70">{number}</span>
      <div className="flex flex-col gap-2 sm:flex-1">
        <h3 className="font-display text-lg text-ink">{title}</h3>
        <p className="max-w-md text-sm text-ink/55">{description}</p>
      </div>
    </div>
  )
}
