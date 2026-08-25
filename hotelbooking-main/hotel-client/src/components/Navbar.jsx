import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from './ui/Button'
import Logo from './ui/Logo'
import { useAuth } from '../context/useAuth'
import { navLinks } from '../data/content'

// Site header/navigation bar. Shows nav links, auth-aware account actions, and a mobile hamburger menu.
// Reads the current user from auth context so it can render logged-in vs logged-out states.
export default function Navbar() {
  // Tracks whether the mobile dropdown menu is expanded.
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Logs the user out, closes the mobile menu, then redirects to the home page.
  async function handleLogout() {
    await logout()
    setOpen(false)
    navigate('/')
  }

  // Extra nav links only shown when logged in; admins additionally get an Admin link.
  const accountLinks = user
    ? [
        { label: 'My Bookings', to: '/my-bookings' },
        ...(user.role === 'Admin' ? [{ label: 'Admin', to: '/admin' }] : []),
      ]
    : []

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center">
          <Logo textClassName="text-ink" />
        </Link>

        {/* Desktop nav: static nav links plus any auth-dependent account links. */}
        <ul className="hidden items-center gap-8 text-sm font-medium text-ink/80 md:flex">
          {[...navLinks, ...accountLinks].map((link) =>
            link.to ? (
              <li key={link.label}>
                <Link to={link.to} className="transition-colors hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ) : (
              <li key={link.label}>
                <a href={link.href} className="transition-colors hover:text-ink">
                  {link.label}
                </a>
              </li>
            ),
          )}
        </ul>

        {/* Desktop auth controls: greeting + logout when signed in, otherwise login/signup links. */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <span className="text-sm text-ink/70">Hi, {user.fullName?.split(' ')[0]}</span>
              <Button variant="secondary" onClick={handleLogout}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink/80 hover:text-ink">
                Log In
              </Link>
              <Button as={Link} to="/register" variant="primary">
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Hamburger toggle, only visible on mobile breakpoints. */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="text-lg">{open ? '✕' : '☰'}</span>
        </button>
      </nav>

      {/* Mobile dropdown menu, only rendered while `open` is true. */}
      {open && (
        <div className="border-t border-ink/5 px-6 pb-6 md:hidden">
          <ul className="flex flex-col gap-4 pt-4 text-sm font-medium text-ink/80">
            {[...navLinks, ...accountLinks].map((link) =>
              link.to ? (
                <li key={link.label}>
                  <Link to={link.to} onClick={() => setOpen(false)}>
                    {link.label}
                  </Link>
                </li>
              ) : (
                <li key={link.label}>
                  <a href={link.href} onClick={() => setOpen(false)}>
                    {link.label}
                  </a>
                </li>
              ),
            )}
          </ul>

          {user ? (
            <Button variant="secondary" className="mt-4 w-full" onClick={handleLogout}>
              Log Out
            </Button>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              <Link to="/login" onClick={() => setOpen(false)} className="text-center text-sm font-medium text-ink/80">
                Log In
              </Link>
              <Button as={Link} to="/register" variant="primary" className="w-full" onClick={() => setOpen(false)}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
