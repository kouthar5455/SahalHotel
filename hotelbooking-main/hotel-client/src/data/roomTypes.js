// Predefined room types with default/allowed capacity ranges and a suggested
// description. `capacity` is the value auto-filled on selection; min/max
// constrain what the admin may enter.
export const roomTypes = [
  {
    value: 'Standard Room',
    description: 'Basic room with essential amenities.',
    capacity: 2,
    minCapacity: 1,
    maxCapacity: 2,
  },
  {
    value: 'Single Room',
    description: 'One single bed for one person.',
    capacity: 1,
    minCapacity: 1,
    maxCapacity: 1,
  },
  {
    value: 'Double Room',
    description: 'One double/queen bed.',
    capacity: 2,
    minCapacity: 2,
    maxCapacity: 2,
  },
  {
    value: 'Twin Room',
    description: 'Two separate single beds.',
    capacity: 2,
    minCapacity: 2,
    maxCapacity: 2,
  },
  {
    value: 'Deluxe Room',
    description: 'Larger room with upgraded furnishings.',
    capacity: 3,
    minCapacity: 2,
    maxCapacity: 3,
  },
  {
    value: 'Superior Room',
    description: 'Better view and more amenities than a Standard Room.',
    capacity: 3,
    minCapacity: 2,
    maxCapacity: 3,
  },
  {
    value: 'Family Room',
    description: 'Multiple beds suitable for families.',
    capacity: 4,
    minCapacity: 4,
    maxCapacity: 6,
  },
  {
    value: 'Triple Room',
    description: 'Three single beds or one double and one single bed.',
    capacity: 3,
    minCapacity: 3,
    maxCapacity: 3,
  },
  {
    value: 'Executive Room',
    description: 'Designed for business travelers with premium facilities.',
    capacity: 2,
    minCapacity: 2,
    maxCapacity: 2,
  },
]

// Same room type data keyed by `value` (the room type name) for O(1) lookup,
// e.g. to get capacity constraints for a room type selected elsewhere in a form.
export const roomTypeMap = Object.fromEntries(roomTypes.map((t) => [t.value, t]))
