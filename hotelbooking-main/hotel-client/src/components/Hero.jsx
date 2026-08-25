import { Link } from 'react-router-dom'
import Button from './ui/Button'
import HeroSearchBar from './Hero/HeroSearchBar'
import { ArrowIcon, SparkleIcon } from './ui/Icons'
import { heroImage } from '../data/content'

// Top-of-page hero section: headline, copy, a CTA button, the search bar, and a hero image.
export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden px-6 pb-20 pt-16">
      {/* Decorative sparkle icons, hidden on smaller screens. */}
      <SparkleIcon className="absolute left-[8%] top-24 hidden h-8 w-8 text-forest/40 lg:block" />
      <SparkleIcon className="absolute bottom-10 right-[6%] hidden h-6 w-6 text-forest/30 lg:block" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <h1 className="hero-title font-display text-4xl leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
            Find your perfect stay, every time.
          </h1>
          <p className="hero-copy max-w-md text-base text-ink/60">
            Sahal Stay curates hand-picked hotels, resorts and villas so
            booking your next trip takes minutes, not hours.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button as={Link} to="/hotels" variant="primary" icon={<ArrowIcon />} className="hero-action">
              Browse Hotels
            </Button>
          </div>

          <div className="hero-search-enter w-full max-w-lg">
            <HeroSearchBar />
          </div>
        </div>

        <div className="hero-image-wrap relative">
          <img
            src={heroImage.src}
            alt={heroImage.alt}
            className="hero-image h-[360px] w-full rounded-[2.5rem] object-cover shadow-xl sm:h-[460px]"
          />
        </div>
      </div>
    </section>
  )
}
