import { useMemo } from 'react'

const statusColors = {
  Pending: '#f4b740',
  Confirmed: '#0f766e',
  Cancelled: '#ef6a45',
  Other: '#8a6fd6',
}

const metricColors = {
  Hotels: '#74d7d4',
  Rooms: '#49b7c9',
  Bookings: '#2f91b8',
  Customers: '#3469a4',
  Pending: '#1d3a30',
}

// Formats a raw number using locale-aware thousands separators (e.g. 1,234).
function formatCount(value) {
  return new Intl.NumberFormat().format(value)
}

// Buckets bookings by status into chart-ready { label, value } items,
// dropping any status with a zero count so the donut chart doesn't render empty slices.
function getStatusItems(bookings) {
  const pendingCount = bookings.filter((booking) => booking.status === 'Pending').length
  const confirmedCount = bookings.filter((booking) => booking.status === 'Confirmed').length
  const cancelledCount = bookings.filter((booking) => booking.status === 'Cancelled').length
  // Catch-all for any status value not explicitly tracked above
  const otherCount = bookings.length - pendingCount - confirmedCount - cancelledCount

  return [
    { label: 'Pending', value: pendingCount },
    { label: 'Confirmed', value: confirmedCount },
    { label: 'Cancelled', value: cancelledCount },
    { label: 'Other', value: Math.max(otherCount, 0) },
  ].filter((item) => item.value > 0)
}

// Converts a polar coordinate (angle around a center point) to an SVG x/y cartesian point.
// Angle is offset by -90deg so 0 degrees points up (12 o'clock) instead of right.
function polarToCartesian(center, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180

  return {
    x: center + radius * Math.cos(angleInRadians),
    y: center + radius * Math.sin(angleInRadians),
  }
}

// Builds an SVG arc "d" path string between two angles on a circle, used to draw
// each colored segment of the donut chart. largeArcFlag picks the correct arc
// direction when a slice spans more than half the circle.
function describeArc(center, radius, startAngle, endAngle) {
  const start = polarToCartesian(center, radius, endAngle)
  const end = polarToCartesian(center, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
}

// Renders a hand-built SVG bar chart (no charting library) for admin totals
// (hotels/rooms/bookings/customers/pending). items: [{ label, value }].
function BarChart({ items }) {
  const chart = {
    width: 520,
    height: 170,
    top: 20,
    right: 18,
    bottom: 34,
    left: 44,
  }
  const plotHeight = chart.height - chart.top - chart.bottom
  const plotWidth = chart.width - chart.left - chart.right
  // Y-axis max rounded up to the nearest multiple of 5 so gridlines land on round numbers
  const maxValue = Math.max(1, ...items.map((item) => item.value))
  const roundedMax = Math.max(5, Math.ceil(maxValue / 5) * 5)
  // 4 evenly-spaced gridline values from 0 to roundedMax
  const ticks = Array.from({ length: 4 }, (_, index) => Math.round((roundedMax / 3) * index))
  const slotWidth = plotWidth / items.length
  const barWidth = Math.min(38, slotWidth * 0.42)

  return (
    <svg
      width="100%"
      height="170"
      viewBox={`0 0 ${chart.width} ${chart.height}`}
      role="img"
      aria-label="Admin totals bar chart"
      style={{ display: 'block', maxHeight: 170 }}
    >
      {ticks.map((tick) => {
        const y = chart.top + plotHeight - (tick / roundedMax) * plotHeight

        return (
          <g key={tick}>
            <line x1={chart.left} x2={chart.width - chart.right} y1={y} y2={y} stroke="#ded8ca" strokeWidth="1" />
            <text x={chart.left - 12} y={y + 4} textAnchor="end" fill="rgba(23, 36, 31, 0.5)" fontSize="10" fontWeight="500">
              {tick}
            </text>
          </g>
        )
      })}

      <line
        x1={chart.left}
        x2={chart.width - chart.right}
        y1={chart.top + plotHeight}
        y2={chart.top + plotHeight}
        stroke="#17241f"
        strokeOpacity="0.4"
        strokeWidth="1"
      />

      {items.map((item, index) => {
        const barHeight = (item.value / roundedMax) * plotHeight
        const x = chart.left + slotWidth * index + (slotWidth - barWidth) / 2
        const y = chart.top + plotHeight - barHeight

        return (
          <g key={item.label}>
            <rect x={x} y={y} width={barWidth} height={barHeight} rx="7" fill={metricColors[item.label]} />
            <text x={x + barWidth / 2} y={Math.max(chart.top + 12, y - 6)} textAnchor="middle" fill="#17241f" fontSize="10" fontWeight="600">
              {formatCount(item.value)}
            </text>
            <text x={x + barWidth / 2} y={chart.height - 10} textAnchor="middle" fill="#17241f" fontSize="9" fontWeight="500">
              {item.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// Renders a hand-built SVG donut chart showing the proportion of bookings per status.
// items: [{ label, value }], total: sum of all item values (used for percentages).
function DonutChart({ items, total }) {
  const size = 160
  const center = size / 2
  const radius = 54
  const strokeWidth = 26
  // Walk through items accumulating a running angle so each slice starts where the previous ended
  const slices = items.reduce(
    (acc, item) => {
      const startAngle = acc.currentAngle
      const percent = total > 0 ? item.value / total : 0
      const endAngle = startAngle + percent * 360

      return {
        currentAngle: endAngle,
        items: [...acc.items, { ...item, endAngle, percent, startAngle }],
      }
    },
    { currentAngle: 0, items: [] },
  ).items

  return (
    <svg
      width="160"
      height="160"
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Booking status donut chart"
      style={{ display: 'block', height: 160, width: 160 }}
    >
      <circle cx={center} cy={center} r={radius} fill="none" stroke="#f1efe6" strokeWidth={strokeWidth} />

      {slices.map((item) => {
        const labelAngle = item.startAngle + (item.endAngle - item.startAngle) / 2
        const labelPoint = polarToCartesian(center, radius, labelAngle)
        const path = describeArc(center, radius, item.startAngle, item.endAngle)

        return (
          <g key={item.label}>
            <path d={path} fill="none" stroke={statusColors[item.label]} strokeWidth={strokeWidth} />
            <text x={labelPoint.x} y={labelPoint.y + 2} textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="700">
              {Math.round(item.percent * 100)}%
            </text>
          </g>
        )
      })}

      <circle cx={center} cy={center} r="34" fill="#ffffff" />
      <text x={center} y={center - 1} textAnchor="middle" fill="#17241f" fontFamily="Fraunces, serif" fontSize="18">
        {formatCount(total)}
      </text>
      <text x={center} y={center + 14} textAnchor="middle" fill="rgba(23, 36, 31, 0.45)" fontSize="6" fontWeight="700" letterSpacing="1">
        Bookings
      </text>
    </svg>
  )
}

// Admin dashboard visualization panel: shows a bar chart of overall totals
// (hotels/rooms/bookings/customers/pending) and a donut chart of booking status split.
// Props: stats (aggregate counts object), bookings (full booking list used to derive status counts).
export default function DashboardCharts({ stats, bookings }) {
  // Memoized so the bar-chart data array is only rebuilt when the underlying stats/bookings change,
  // avoiding unnecessary re-renders of the SVG bar chart.
  const metricBars = useMemo(
    () => [
      { label: 'Hotels', value: stats.totalHotels },
      { label: 'Rooms', value: stats.totalRooms },
      { label: 'Bookings', value: stats.totalBookings },
      { label: 'Customers', value: stats.totalCustomers },
      { label: 'Pending', value: bookings.filter((booking) => booking.status === 'Pending').length },
    ],
    [bookings, stats.totalBookings, stats.totalCustomers, stats.totalHotels, stats.totalRooms],
  )

  const statusItems = getStatusItems(bookings)
  const totalStatuses = statusItems.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="grid gap-3 xl:grid-cols-2">
      <section className="rounded-xl border border-ink/10 bg-white p-3 shadow-sm shadow-ink/5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-display text-lg text-ink">Performance</h2>
            <p className="text-xs font-medium text-ink/50">Admin totals by category</p>
          </div>
          <span className="w-fit rounded-full bg-cream-2 px-3 py-1 text-xs font-semibold text-ink/55">
            Bar chart
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
          {metricBars.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-[11px] font-medium text-ink/65">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: metricColors[item.label] }} />
              {item.label}
            </div>
          ))}
        </div>

        <div className="mt-2">
          <BarChart items={metricBars} />
        </div>
      </section>

      <section className="rounded-xl border border-ink/10 bg-white p-3 shadow-sm shadow-ink/5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-display text-lg text-ink">Booking Status</h2>
            <p className="text-xs font-medium text-ink/50">Current booking split</p>
          </div>
          <span className="w-fit rounded-full bg-cream-2 px-3 py-1 text-xs font-semibold text-ink/55">
            Donut chart
          </span>
        </div>

        {/* Only render the donut chart and breakdown when there's at least one booking to chart */}
        {bookings.length > 0 ? (
          <>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
              {statusItems.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-[11px] font-medium text-ink/65">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: statusColors[item.label] }} />
                  {item.label}
                </div>
              ))}
            </div>

            <div className="mt-2 flex justify-center overflow-hidden">
              <DonutChart items={statusItems} total={totalStatuses} />
            </div>

            <div className="mt-2 grid gap-1.5 sm:grid-cols-3">
              {statusItems.map((item) => (
                <div key={item.label} className="rounded-lg bg-cream-2/65 p-1.5 text-center">
                  <div className="font-display text-base text-ink">{formatCount(item.value)}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink/45">{item.label}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-4 grid min-h-48 place-items-center rounded-xl bg-cream-2/55 text-sm text-ink/55">
            No bookings available for chart data yet.
          </div>
        )}
      </section>
    </div>
  )
}
