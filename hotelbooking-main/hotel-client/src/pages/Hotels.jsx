import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer/Footer'
import SectionHeading from '../components/ui/SectionHeading'
import SearchFilterBar from '../components/Hotels/SearchFilterBar'
import HotelCard from '../components/Hotels/HotelCard'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { useHotels } from '../hooks/useHotels'
import { useDebouncedValue } from '../hooks/useDebouncedValue'

// Page listing hotels with search/filter/sort controls; initializes filters from URL query params so links are shareable.
export default function Hotels() {
  const [searchParams] = useSearchParams()
  // Lazy initializer reads filter values from the URL once on mount, so a shared/bookmarked link pre-fills the search.
  const [filters, setFilters] = useState(() => ({
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    capacity: searchParams.get('capacity') || '',
    sortBy: searchParams.get('sortBy') || '',
  }))

  // Debounce filter changes before hitting the API, avoiding a request on every keystroke.
  const debouncedFilters = useDebouncedValue(filters, 400)

  // Client-side validation: min price must not exceed max price; checked against the debounced values shown to the API.
  const validationError =
    debouncedFilters.minPrice &&
    debouncedFilters.maxPrice &&
    Number(debouncedFilters.minPrice) > Number(debouncedFilters.maxPrice)
      ? 'Minimum price cannot be greater than maximum price.'
      : ''

  // Convert empty-string filter values to `undefined` so they're omitted from the query string instead of sent as blanks.
  const apiParams = {
    search: debouncedFilters.search || undefined,
    minPrice: debouncedFilters.minPrice || undefined,
    maxPrice: debouncedFilters.maxPrice || undefined,
    capacity: debouncedFilters.capacity || undefined,
    sortBy: debouncedFilters.sortBy || undefined,
  }

  const { hotels, loading, error, refresh } = useHotels(apiParams)

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <section className="px-6 py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <SectionHeading eyebrow="All Stays" title="Find your next hotel" />
          <SearchFilterBar filters={filters} onChange={setFilters} />

          {validationError && <p className="text-sm text-red-600">{validationError}</p>}

          {/* Each branch below is gated on !validationError so results/loading/error states never show alongside an invalid filter */}
          {!validationError && loading && <Spinner label="Loading hotels…" />}
          {!validationError && !loading && error && <ErrorState onRetry={refresh} />}
          {!validationError && !loading && !error && hotels.length === 0 && (
            <EmptyState
              title="No hotels match your search"
              description="Try adjusting your filters or search terms."
            />
          )}
          {!validationError && !loading && !error && hotels.length > 0 && (
            <div className="grid gap-6 md:grid-cols-3">
              {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
