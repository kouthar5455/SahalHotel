import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import { ArrowIcon } from '../ui/Icons'

// Simple call-to-action banner encouraging users to browse hotels; renders a heading, copy, and a link-styled button.
export default function CtaSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-[2.5rem] bg-ink px-8 py-16 text-center">
        <h2 className="font-display text-3xl text-cream sm:text-4xl">Ready for your next stay?</h2>
        <p className="max-w-md text-sm text-cream/60">
          Browse hundreds of hotels and book your perfect room in minutes.
        </p>
        <Button as={Link} to="/hotels" variant="light" icon={<ArrowIcon />}>
          Browse Hotels
        </Button>
      </div>
    </section>
  )
}
