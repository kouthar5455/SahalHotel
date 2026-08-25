// Prefix search used by all the search boxes. An item matches when the query is
// the start of any of its field values, or the start of any word inside them
// (words are split on spaces and punctuation such as ".", "@", "-").
// Example: query "h" matches "Hassan" and "ahmed.hassan@x.com"; query "06"
// matches the phone "0612345678". An empty query matches everything.
export function matchesQuery(fields, query) {
  const q = (query || '').trim().toLowerCase()
  if (!q) return true

  return fields.some((value) => {
    if (value === null || value === undefined) return false
    const text = String(value).toLowerCase()
    if (text.startsWith(q)) return true
    return text.split(/[^a-z0-9]+/).some((word) => word.startsWith(q))
  })
}
