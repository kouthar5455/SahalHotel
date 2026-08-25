import StatCard from '../../components/Admin/StatCard'
import RecentBookings from '../../components/Admin/RecentBookings'
import Spinner from '../../components/ui/Spinner'
import ErrorState from '../../components/ui/ErrorState'
import { HotelIcon, RoomIcon, BookingIcon, DashboardIcon } from '../../components/Admin/AdminIcons'
import { useStats } from '../../hooks/useStats'
import { useAdminBookings } from '../../hooks/useAdminBookings'
import DashboardCharts from '../../components/Admin/DashboardCharts'

// Admin dashboard: shows summary stat cards, charts, and a recent-bookings list, combining two independent data sources.
export default function Dashboard() {
  const { stats, loading: statsLoading, error: statsError, refresh: refreshStats } = useStats()
  const { bookings, loading: bookingsLoading } = useAdminBookings()

  // Combined loading state: page-level spinner waits for both the stats and bookings requests to finish.
  const loading = statsLoading || bookingsLoading
  // Pending count is derived from the bookings list rather than the stats endpoint, since stats doesn't break it out.
  const pendingCount = bookings.filter((booking) => booking.status === 'Pending').length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl text-ink sm:text-3xl">Dashboard</h1>
        <p className="text-sm text-ink/55">An overview of your hotels, rooms and bookings.</p>
      </div>

      {loading && <Spinner label="Loading stats…" />}
      {!loading && statsError && <ErrorState onRetry={refreshStats} />}

      {/* Stat cards, charts, and recent bookings all wait for stats to load successfully before rendering */}
      {!loading && !statsError && stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Total Hotels" value={stats.totalHotels} icon={<HotelIcon className="h-5 w-5" />} />
          <StatCard label="Total Rooms" value={stats.totalRooms} icon={<RoomIcon className="h-5 w-5" />} />
          <StatCard label="Total Bookings" value={stats.totalBookings} icon={<BookingIcon className="h-5 w-5" />} />
          <StatCard label="Total Customers" value={stats.totalCustomers} icon={<DashboardIcon className="h-5 w-5" />} />
          <StatCard label="Pending Bookings" value={pendingCount} icon={<BookingIcon className="h-5 w-5" />} />
        </div>
      )}

      {!loading && !statsError && stats && <DashboardCharts stats={stats} bookings={bookings} />}

      {!loading && !statsError && <RecentBookings bookings={bookings} />}
    </div>
  )
}
