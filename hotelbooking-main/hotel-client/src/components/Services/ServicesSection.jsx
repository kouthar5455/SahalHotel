import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SectionHeading from '../ui/SectionHeading'
import IconButton from '../ui/IconButton'
import Button from '../ui/Button'
import HotelCard from '../Hotels/HotelCard'
import Spinner from '../ui/Spinner'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import { ArrowIcon } from '../ui/Icons'
import { useHotels } from '../../hooks/useHotels'

// Fetches hotels (via useHotels) and displays them in a horizontally
// scrollable carousel of up to 3 visible cards at a time, with prev/next
// controls and loading/error/empty states.
export default function ServicesSection() {
  const { hotels, loading, error, refresh } = useHotels()
  // Index of the first hotel currently scrolled into view (carousel position)
  const [start, setStart] = useState(0)
  // Reference to the scrollable track div so we can imperatively scroll it
  const trackRef = useRef(null)
  const canPrev = start > 0
  const canNext = start + 3 < hotels.length

  // Recomputes the pixel width of one card+gap "step" based on the current
  // viewport width, so scrolling by one card works responsively (3 columns on
  // desktop, 1 on mobile). Recalculated when `start` changes since the
  // carousel re-renders; window width itself isn't tracked reactively.
  const cardStep = useMemo(() => {
    if (typeof window === 'undefined') return 0

    const viewportWidth = window.innerWidth
    const gap = 24

    if (viewportWidth >= 768) {
      // Desktop: 3 cards visible, subtract page padding (48) and the 2 gaps between them
      return (viewportWidth - 48 - gap * 2) / 3 + gap
    }

    // Mobile: 1 card visible, subtract page padding and add the trailing gap
    return viewportWidth - 48 + gap
  }, [start])

  // Handles prev/next button clicks: clamps the new start index within bounds,
  // updates state, and smooth-scrolls the track to the new position.
  function slide(direction) {
    const nextStart = direction === 'next' ? Math.min(hotels.length - 3, start + 1) : Math.max(0, start - 1)
    if (nextStart === start) return

    setStart(nextStart)
    trackRef.current?.scrollTo({
      left: nextStart * cardStep,
      behavior: 'smooth',
    })
  }

  // Keeps the scroll position in sync with `start`/`cardStep` (e.g. if the
  // step size changes due to a re-render) without requiring a button click.
  useEffect(() => {
    if (!trackRef.current) return
    trackRef.current.scrollTo({ left: start * cardStep, behavior: 'smooth' })
  }, [cardStep, start])

  return (
    <section id="services" className="px-6 py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Our Stays" title="Explore hotels you can book today" />
          {/* Only show carousel arrows when there's more than one page of cards to scroll through */}
          {hotels.length > 3 && (
            <div className="flex gap-3">
              <IconButton variant="outline" onClick={() => slide('prev')} disabled={!canPrev}>
                <ArrowIcon direction="left" />
              </IconButton>
              <IconButton variant="dark" onClick={() => slide('next')} disabled={!canNext}>
                <ArrowIcon />
              </IconButton>
            </div>
          )}
        </div>

        {/* Mutually exclusive render branches driven by the fetch state from useHotels */}
        {loading && <Spinner label="Loading hotels…" />}
        {!loading && error && <ErrorState onRetry={refresh} />}
        {!loading && !error && hotels.length === 0 && (
          <EmptyState title="No hotels available yet" description="Check back soon for new stays." />
        )}

        {!loading && !error && hotels.length > 0 && (
          <>
            <div ref={trackRef} className="flex gap-6 overflow-hidden scroll-smooth">
              {hotels.map((hotel) => (
                <div key={hotel.id} className="w-full shrink-0 md:w-[calc((100%-3rem*2)/3)]">
                  <HotelCard hotel={hotel} />
                </div>
              ))}
            </div>
            <Button as={Link} to="/hotels" variant="secondary" icon={<ArrowIcon />} className="self-start">
              View all hotels
            </Button>
          </>
        )}
      </div>
    </section>
  )
}
