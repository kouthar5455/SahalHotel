import { NavLink, Outlet } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { DashboardIcon, HotelIcon, RoomIcon, BookingIcon, UsersIcon } from '../../components/Admin/AdminIcons'

// Admin nav items shared between the desktop sidebar and mobile top nav below.
// `end: true` on Dashboard prevents its NavLink from matching every /admin/* sub-route.
const links = [
  { label: 'Dashboard', to: '/admin', end: true, Icon: DashboardIcon },
  { label: 'Manage Hotels', to: '/admin/hotels', Icon: HotelIcon },
  { label: 'Manage Rooms', to: '/admin/rooms', Icon: RoomIcon },
  { label: 'All Bookings', to: '/admin/bookings', Icon: BookingIcon },
  { label: 'Manage Users', to: '/admin/users', Icon: UsersIcon },
]

// Shared layout for all /admin/* routes: renders the nav (sidebar on desktop, top nav on mobile) and the active
// child route via <Outlet />.
export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-cream-2">
      <Navbar />

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:gap-8 md:py-12">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 md:block">
          <div className="sticky top-24 flex flex-col gap-1 rounded-3xl bg-cream-2 p-4">
            <h2 className="px-3 pb-3 pt-1 font-display text-lg text-ink">Admin Panel</h2>
            {links.map(({ label, to, end, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                // NavLink's render-prop form: className/children both receive `isActive` to style the current route differently
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-forest text-cream'
                      : 'text-ink/60 hover:bg-mint/40 hover:text-forest'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? 'text-mint' : 'text-forest'}>
                      <Icon />
                    </span>
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </aside>

        {/* Mobile / tablet top nav */}
        <nav className="flex flex-wrap gap-2 rounded-2xl bg-cream-2 p-2 md:hidden">
          {links.map(({ label, to, end, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'bg-forest text-cream' : 'text-ink/60 hover:bg-mint/40 hover:text-forest'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-mint' : 'text-forest'}>
                    <Icon />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
