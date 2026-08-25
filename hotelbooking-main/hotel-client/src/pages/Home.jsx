import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import PartnerStrip from '../components/PartnerStrip'
import ServicesSection from '../components/Services/ServicesSection'
import DestinationsSection from '../components/Destinations/DestinationsSection'
import AmenitiesSection from '../components/Amenities/AmenitiesSection'
import FeaturesSection from '../components/Features/FeaturesSection'
import AboutSection from '../components/About/AboutSection'
import StatsSection from '../components/Stats/StatsSection'
import ProcessSection from '../components/Process/ProcessSection'
import OffersSection from '../components/Offers/OffersSection'
import ProjectsShowcase from '../components/Showcase/ProjectsShowcase'
import CtaSection from '../components/Cta/CtaSection'
import Footer from '../components/Footer/Footer'

// Landing page: renders the marketing/home sections in order, each wrapped for a staggered reveal-on-scroll animation.
export default function Home() {
  // Ordered list of page sections; using an array (rather than JSX directly) lets us assign each a staggered animation delay below.
  const sections = [
    { key: 'hero', element: <Hero /> },
    { key: 'partners', element: <PartnerStrip /> },
    { key: 'services', element: <ServicesSection /> },
    { key: 'destinations', element: <DestinationsSection /> },
    { key: 'amenities', element: <AmenitiesSection /> },
    { key: 'features', element: <FeaturesSection /> },
    { key: 'about', element: <AboutSection /> },
    { key: 'stats', element: <StatsSection /> },
    { key: 'process', element: <ProcessSection /> },
    { key: 'offers', element: <OffersSection /> },
    { key: 'showcase', element: <ProjectsShowcase /> },
    { key: 'cta', element: <CtaSection /> },
    { key: 'footer', element: <Footer /> },
  ]

  return (
    <div className="home-page min-h-screen bg-cream">
      <Navbar />
      {sections.map(({ key, element }, index) => (
        // Each section gets an increasing CSS custom property delay so they reveal in a staggered sequence as the page loads
        <div key={key} className="page-reveal" style={{ '--reveal-delay': `${index * 95}ms` }}>
          {element}
        </div>
      ))}
    </div>
  )
}
