import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RequireAuth from './components/routing/RequireAuth'
import RequireAdmin from './components/routing/RequireAdmin'
import ScrollToTop from './components/routing/ScrollToTop'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import Hotels from './pages/Hotels'
import HotelDetail from './pages/HotelDetail'
import BookRoom from './pages/BookRoom'
import MyBookings from './pages/MyBookings'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import ManageHotels from './pages/admin/ManageHotels'
import ManageRooms from './pages/admin/ManageRooms'
import AllBookings from './pages/admin/AllBookings'
import ManageUsers from './pages/admin/ManageUsers'
import NotFound from './pages/NotFound'

// Root component: sets up global auth context and all client-side routes.
// Wraps everything in AuthProvider so any page/component can access the logged-in user,
// and BrowserRouter to enable path-based navigation.
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Resets scroll position to top on every route change */}
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route
            path="/book/:roomId"
            element={
              // Booking a room requires being logged in; redirects with a message otherwise
              <RequireAuth message="Please login to book">
                <BookRoom />
              </RequireAuth>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <RequireAuth message="Please login to view your bookings">
                <MyBookings />
              </RequireAuth>
            }
          />

          <Route
            path="/admin"
            element={
              // Entire admin section is gated behind admin-role check; AdminLayout renders nested routes via <Outlet />
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="hotels" element={<ManageHotels />} />
            <Route path="rooms" element={<ManageRooms />} />
            <Route path="bookings" element={<AllBookings />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>

          {/* Catch-all for unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
