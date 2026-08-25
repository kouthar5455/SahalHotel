// Shared input styling keeps all filter controls visually consistent.
const inputClass =
  'rounded-xl border border-ink/10 px-4 py-2.5 text-sm focus:border-forest focus:outline-none'

// Controlled filter bar for the hotel listing page. Props: `filters` (current filter values object),
// `onChange` (called with the full updated filters object whenever any field changes).
export default function SearchFilterBar({ filters, onChange }) {
  // Updates only the changed filter field while preserving the other filter values.
  function handleChange(event) {
    const { name, value } = event.target
    onChange({ ...filters, [name]: value })
  }

  return (
    // Responsive filter row used on the hotels listing page.
    <div className="flex flex-wrap gap-4 rounded-3xl bg-white p-4 shadow-sm shadow-ink/5">
      {/* Text search filters by hotel name or location. */}
      <input
        name="search"
        value={filters.search}
        onChange={handleChange}
        placeholder="Search by hotel or location…"
        className={`min-w-[220px] flex-1 ${inputClass}`}
      />
      {/* Price range filters are sent as separate minimum and maximum values. */}
      <input
        name="minPrice"
        type="number"
        min="0"
        value={filters.minPrice}
        onChange={handleChange}
        placeholder="Min price"
        className={`w-28 ${inputClass}`}
      />
      <input
        name="maxPrice"
        type="number"
        min="0"
        value={filters.maxPrice}
        onChange={handleChange}
        placeholder="Max price"
        className={`w-28 ${inputClass}`}
      />
      {/* Capacity limits results to hotels with rooms that fit the guest count. */}
      <input
        name="capacity"
        type="number"
        min="1"
        value={filters.capacity}
        onChange={handleChange}
        placeholder="Guests"
        className={`w-24 ${inputClass}`}
      />
      {/* Sort option controls how the hotel results are ordered. */}
      <select name="sortBy" value={filters.sortBy} onChange={handleChange} className={inputClass}>
        <option value="">Sort by</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
      </select>
    </div>
  )
}
