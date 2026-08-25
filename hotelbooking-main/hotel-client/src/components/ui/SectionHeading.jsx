// Section title with a small "eyebrow" label above it and a decorative dot/line.
// `align` controls left vs center layout; `tone` switches the palette for use on
// dark ("light" tone = light text/accents) vs light ("dark" tone) section backgrounds.
export default function SectionHeading({
  eyebrow,
  title,
  align = 'left',
  tone = 'dark',
  className = '',
}) {
  const isCenter = align === 'center'
  // Pick contrasting colors depending on the background the heading sits on.
  const eyebrowColor = tone === 'light' ? 'text-mint' : 'text-forest'
  const dotColor = tone === 'light' ? 'bg-mint' : 'bg-forest'
  const titleColor = tone === 'light' ? 'text-cream' : 'text-ink'
  const lineColor = tone === 'light' ? 'bg-cream/30' : 'bg-ink/15'

  return (
    <div className={`flex flex-col gap-3 ${isCenter ? 'items-center text-center' : 'items-start text-left'} ${className}`}>
      <span className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${eyebrowColor}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
        {eyebrow}
      </span>
      <h2 className={`flex max-w-xl items-center gap-4 font-display text-3xl leading-[1.15] sm:text-4xl ${titleColor}`}>
        {title}
        {/* Decorative rule filling remaining width; hidden on small screens to avoid crowding */}
        <span className={`hidden h-px flex-1 sm:inline-block ${lineColor}`} />
      </h2>
    </div>
  )
}
