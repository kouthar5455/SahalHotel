import { partners } from '../data/content'

// Simple horizontal strip of partner/brand names, sourced from static content data.
export default function PartnerStrip() {
  return (
    <section className="border-y border-ink/5 bg-cream-2 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-12 gap-y-4">
        {partners.map((name) => (
          <span
            key={name}
            className="font-display text-lg font-semibold tracking-wide text-ink/35"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  )
}
