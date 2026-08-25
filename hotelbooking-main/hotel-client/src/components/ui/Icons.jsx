// Arrow icon used for nav/carousel controls; flips horizontally when direction="left"
export function ArrowIcon({ className = 'h-4 w-4', direction = 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} ${direction === 'left' ? 'rotate-180' : ''}`}
      aria-hidden="true"
    >
      <path
        d="M4 12h16m0 0-6-6m6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Play button triangle icon (e.g. for video thumbnails)
export function PlayIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  )
}

// Decorative sparkle/star icon
export function SparkleIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2c.6 3.4 1.6 5.6 3 7 1.4 1.4 3.6 2.4 7 3-3.4.6-5.6 1.6-7 3-1.4 1.4-2.4 3.6-3 7-.6-3.4-1.6-5.6-3-7-1.4-1.4-3.6-2.4-7-3 3.4-.6 5.6-1.6 7-3 1.4-1.4 2.4-3.6 3-7Z" />
    </svg>
  )
}

// Chat bubble icon (e.g. for support/messaging features)
export function ChatIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M21 11.5a8.38 8.38 0 0 1-4.5 7.5c-3.6 1.9-7.9 1.4-11-1L3 20l2-3.5A8.5 8.5 0 1 1 21 11.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Support/help icon (target-like circles with corner ticks)
export function SupportIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="m6 6 2.5 2.5M18 6l-2.5 2.5M6 18l2.5-2.5M18 18l-2.5-2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

// Guests/people icon (two overlapping person silhouettes)
export function GuestsIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.5 14a4.7 4.7 0 0 1 5.5 4.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

// Open-eye icon, typically used to toggle "show password"
export function EyeIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

// Crossed-out eye icon, typically used to toggle "hide password"
export function EyeOffIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M6.5 6.7C4.3 8.1 2.5 12 2.5 12s3.5 6.5 9.5 6.5c1.8 0 3.3-.5 4.5-1.3M9.9 5.6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5s-.8 1.5-2.2 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Renders one of several social-network logo icons, selected by the `name` prop
// (e.g. "facebook", "instagram", "twitter"); path data undefined for unknown names.
export function SocialIcon({ name, className = 'h-4 w-4' }) {
  // SVG path data keyed by social network name
  const paths = {
    facebook: 'M13 22v-8h2.7l.4-3H13V9c0-.9.2-1.5 1.5-1.5H16V4.9c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7V11H8v3h2.3v8H13Z',
    instagram:
      'M12 8.3a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4Zm0 6.1a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8Zm4.7-6.3a.9.9 0 1 1-1.8 0 .9.9 0 0 1 1.8 0ZM12 4.9c2.4 0 2.7 0 3.6.1.9 0 1.5.2 1.9.3.5.2.8.4 1.2.8.4.4.6.7.8 1.2.2.4.3 1 .3 1.9.1.9.1 1.2.1 3.6s0 2.7-.1 3.6c0 .9-.2 1.5-.3 1.9-.2.5-.4.8-.8 1.2-.4.4-.7.6-1.2.8-.4.2-1 .3-1.9.3-.9.1-1.2.1-3.6.1s-2.7 0-3.6-.1c-.9 0-1.5-.2-1.9-.3-.5-.2-.8-.4-1.2-.8-.4-.4-.6-.7-.8-1.2-.2-.4-.3-1-.3-1.9-.1-.9-.1-1.2-.1-3.6s0-2.7.1-3.6c0-.9.2-1.5.3-1.9.2-.5.4-.8.8-1.2.4-.4.7-.6 1.2-.8.4-.2 1-.3 1.9-.3.9-.1 1.2-.1 3.6-.1Z',
    twitter:
      'M20 6.6c-.6.3-1.2.5-1.9.6.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8a3.3 3.3 0 0 0-5.6 3c-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.6 0 1.1.5 2 1.4 2.6-.5 0-1-.2-1.4-.4v.1c0 1.5 1.1 2.8 2.5 3a3.3 3.3 0 0 1-1.5.1c.4 1.3 1.6 2.3 3.1 2.3A6.7 6.7 0 0 1 4 17c1.4.9 3.1 1.4 4.9 1.4 5.9 0 9.1-4.9 9.1-9.1v-.4c.6-.4 1.2-1 1.6-1.7Z',
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  )
}
