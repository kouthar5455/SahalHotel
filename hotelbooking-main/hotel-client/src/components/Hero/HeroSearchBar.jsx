import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'

// Compact hero search form that collects a destination/name search term and guest count,
// then navigates to the hotels listing page with those values encoded as query params.
export default function HeroSearchBar() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [capacity, setCapacity] = useState('')

  // Builds a query string from whichever fields were filled in and redirects to /hotels.
  function handleSubmit(event) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (capacity) params.set('capacity', capacity)
    // Only append "?" when there's at least one param, so empty submissions go to a clean /hotels URL.
    navigate(`/hotels${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 rounded-3xl bg-white p-3 shadow-lg shadow-ink/10 sm:flex-row sm:items-center"
    >
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Where do you want to stay?"
        className="flex-1 rounded-2xl border border-ink/10 px-4 py-3 text-sm focus:border-forest focus:outline-none"
      />
      <input
        type="number"
        min="1"
        value={capacity}
        onChange={(event) => setCapacity(event.target.value)}
        placeholder="Guests"
        className="w-full rounded-2xl border border-ink/10 px-4 py-3 text-sm focus:border-forest focus:outline-none sm:w-24"
      />
      <Button type="submit" variant="primary" className="w-full justify-center sm:w-auto">
        Search
      </Button>
    </form>
  )
}
