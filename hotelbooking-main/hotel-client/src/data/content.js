// Static marketing/site copy for the public-facing pages (nav, hero, about, etc.).
// `to` links are internal routes (React Router), `href` links are plain anchors/hashes.
export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Hotels', to: '/hotels' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
]

// Partner/brand names shown in a logo strip.
export const partners = ['SUNSTAY', 'VOYAGECO', 'NOMAD', 'WANDERLUST', 'TRAVELINE']

// Hero section background image.
export const heroImage = {
  src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
  alt: 'Luxury hotel resort with pool at sunset',
}

// Stat highlights shown in the "About" section.
export const aboutStats = [
  { value: '48%', label: 'of guests rebook their next trip with us within a year' },
  { value: '26%', label: 'faster average booking time than other platforms' },
]

export const aboutImages = [
  {
    src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=700&q=80',
    alt: 'Elegant modern hotel room interior',
  },
  {
    src: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=600&q=80',
    alt: 'Bright hotel lobby lounge',
  },
]

// Steps shown in the "how it works" section, in display order (numbered 01-03).
export const processSteps = [
  {
    number: '01',
    title: 'Search destination',
    description: 'Tell us where and when — we surface the best-matched stays in seconds.',
  },
  {
    number: '02',
    title: 'Compare & choose',
    description: 'Filter by price, amenities and reviews to find the room that fits.',
  },
  {
    number: '03',
    title: 'Book & relax',
    description: 'Confirm instantly, manage your booking anytime, and enjoy the trip.',
  },
]

export const processImage = {
  src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80',
  alt: 'Modern hotel room with a comfortable bed',
}

// Content for the featured-hotels carousel/showcase section, including its slide images.
export const showcase = {
  eyebrow: 'Featured stays',
  title: 'A quick glance at our favorite hotels',
  description:
    'From beachfront resorts to boutique city stays, take a look at the properties our guests love most.',
  slides: [
    {
      src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      alt: 'Beachfront resort with infinity pool',
      caption: 'Beachfront resorts',
    },
    {
      src: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
      alt: 'Resort pool surrounded by palm trees',
      caption: 'Poolside escapes',
    },
    {
      src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
      alt: 'Modern luxury hotel suite',
      caption: 'Boutique city suites',
    },
    {
      src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      alt: 'Cozy hotel bedroom with city view',
      caption: 'Cozy rooms with a view',
    },
  ],
}

// Feature highlight cards; `icon` keys map to components via src/components/ui/featureIcons.js.
// `elevated` marks the middle card for a raised/emphasized visual treatment.
export const features = [
  {
    icon: 'chat',
    title: 'Verified Reviews',
    description: 'Every review comes from a guest who actually stayed.',
  },
  {
    icon: 'support',
    title: 'Live Support',
    description:
      'Our team is on hand around the clock to help with any change, question or request before, during and after your stay.',
    elevated: true,
  },
  {
    icon: 'guests',
    title: 'Trusted by Guests',
    description: 'Thousands of travelers book with confidence every month.',
  },
]

// Link groups rendered in the site footer, one column per group.
export const footerColumns = [
  {
    title: 'Pages',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Hotels', to: '/hotels' },
      { label: 'My Bookings', to: '/my-bookings' },
      { label: 'Contact', href: '/#contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/#about' },
      { label: 'Careers', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQ', href: '#' },
      { label: 'Help Center', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  },
]

// Contact details shown in the footer/contact section.
export const contactInfo = {
  address: '128 Ocean Drive, Malibu, CA 90265',
  phone: '+1 (555) 210-7788',
  email: 'hello@horizonstays.com',
}
