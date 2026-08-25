import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Button from '../components/ui/Button'
import { ArrowIcon } from '../components/ui/Icons'

// Catch-all 404 page rendered for any route that doesn't match a defined path; offers links back to home/hotels.
export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <section className="px-6 py-24">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center">
          <span className="font-display text-7xl font-semibold text-forest">404</span>
          <h1 className="font-display text-2xl text-ink sm:text-3xl">Page not found</h1>
          <p className="max-w-md text-sm text-ink/55">
            The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Button as={Link} to="/" variant="primary" icon={<ArrowIcon className="h-4 w-4" />}>
              Back to Home
            </Button>
            <Button as={Link} to="/hotels" variant="secondary">
              Browse Hotels
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
