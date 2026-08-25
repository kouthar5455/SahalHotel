import SectionHeading from '../ui/SectionHeading'
import StatCard from './StatCard'
import { SparkleIcon } from '../ui/Icons'
import { aboutImages, aboutStats } from '../../data/content'

// "About Us" landing page section: static marketing content built from
// aboutImages/aboutStats data. No props, no state — purely presentational.
export default function AboutSection() {
  return (
    <section id="about" className="px-6 py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div className="relative flex justify-center">
          {/* Main portrait image */}
          <img
            src={aboutImages[0].src}
            alt={aboutImages[0].alt}
            className="h-[420px] w-[260px] rounded-[2rem] object-cover"
          />
          {/* Smaller circular image overlapping the main one */}
          <img
            src={aboutImages[1].src}
            alt={aboutImages[1].alt}
            className="absolute bottom-[-24px] right-4 h-[220px] w-[220px] rounded-full border-8 border-cream object-cover shadow-lg sm:right-10"
          />
          <SparkleIcon className="absolute -left-2 top-0 h-8 w-8 text-forest/40" />
        </div>

        <div className="flex flex-col gap-8">
          <SectionHeading eyebrow="About Us" title="We are an extension of your dream vacation" />
          <p className="max-w-md text-sm text-ink/60">
            From the moment you search to the moment you check out, our team
            works to keep every stay simple, well-priced and worry-free.
          </p>
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
            {/* Render one StatCard per stat entry from content data */}
            {aboutStats.map((stat) => (
              <StatCard key={stat.value} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
